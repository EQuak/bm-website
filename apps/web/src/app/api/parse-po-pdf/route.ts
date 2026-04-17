/**
 * @file Parse PO PDF API route
 * @description Extracts text from a Purchase Order PDF and uses OpenAI to parse
 * it into structured PO data for form prefill.
 */

import { NextResponse } from "next/server"
import OpenAI from "openai"
import { env } from "#/env"
import { createSBServer } from "#/utils/supabase/server"

const PO_PARSE_SCHEMA = {
  type: "object",
  properties: {
    poNumber: { type: "string", description: "PO number from the document" },
    poDate: {
      type: "string",
      description: "PO date in YYYY-MM-DD format"
    },
    salesOrderNumber: {
      type: "string",
      description: "Sales order number if present, else empty string"
    },
    vendorInfo: {
      type: "object",
      properties: {
        vendorCode: { type: "string" },
        vendorName: { type: "string" },
        vendorAddress: {
          type: "object",
          properties: {
            street1: { type: "string" },
            street2: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            postalCode: { type: "string" },
            country: { type: "string" }
          },
          required: [
            "street1",
            "street2",
            "city",
            "state",
            "postalCode",
            "country"
          ]
        }
      },
      required: ["vendorCode", "vendorName", "vendorAddress"]
    },
    shipToInfo: {
      type: "object",
      properties: {
        name: { type: "string" },
        projectCode: { type: "string" },
        address: {
          type: "object",
          properties: {
            street1: { type: "string" },
            street2: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            postalCode: { type: "string" },
            country: { type: "string" }
          },
          required: [
            "street1",
            "street2",
            "city",
            "state",
            "postalCode",
            "country"
          ]
        }
      },
      required: ["name", "projectCode", "address"]
    },
    billToInfo: {
      type: "object",
      properties: {
        name: { type: "string" },
        address: {
          type: "object",
          properties: {
            street1: { type: "string" },
            street2: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            postalCode: { type: "string" },
            country: { type: "string" }
          },
          required: [
            "street1",
            "street2",
            "city",
            "state",
            "postalCode",
            "country"
          ]
        }
      },
      required: ["name", "address"]
    },
    deliverToInfo: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"]
    },
    projectId: { type: "string", description: "Project ID or code if present" },
    memo: { type: "string", description: "Memo or notes if present" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sku: { type: "string", description: "Part number or SKU" },
          title: { type: "string", description: "Item description or title" },
          description: {
            type: "string",
            description: "Additional description"
          },
          orderQty: { type: "number", description: "Ordered quantity" },
          needByDate: {
            type: "string",
            description: "Need-by date in YYYY-MM-DD format"
          },
          rate: { type: "number", description: "Unit price/rate" }
        },
        required: ["sku", "title", "orderQty", "needByDate", "rate"]
      }
    },
    tax: { type: "number" },
    total: { type: "number" }
  },
  required: [
    "poNumber",
    "poDate",
    "salesOrderNumber",
    "vendorInfo",
    "shipToInfo",
    "billToInfo",
    "deliverToInfo",
    "projectId",
    "memo",
    "items",
    "tax",
    "total"
  ]
} as const

function emptyAddress() {
  return {
    street1: "",
    street2: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createSBServer()
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "PDF parsing is not configured. Add OPENAI_API_KEY to your environment."
        },
        { status: 503 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided. Upload a PDF file." },
        { status: 400 }
      )
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File must be a PDF (application/pdf)" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { PDFParse } = await import("pdf-parse")
    const parser = new PDFParse({ data: buffer })
    const pdfResult = await parser.getText()
    await parser.destroy()
    const text = pdfResult.text?.trim() ?? ""

    if (!text || text.length < 50) {
      return NextResponse.json(
        {
          error:
            "Could not extract enough text from the PDF. The file may be scanned; try a text-based PDF."
        },
        { status: 400 }
      )
    }

    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an assistant that extracts structured data from Purchase Order PDFs. Extract all visible fields into the exact JSON schema requested. Use empty strings for missing text fields, 0 for missing numbers. For dates, use YYYY-MM-DD. For addresses, split street lines into street1 and street2. For line items, extract part number/SKU, description, quantity, need-by date, and unit rate.`
        },
        {
          role: "user",
          content: `Extract the Purchase Order data from this PDF text into the required JSON format:\n\n${text}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "po_parse",
          strict: true,
          schema: PO_PARSE_SCHEMA
        }
      },
      temperature: 0
    })

    const raw = completion.choices[0]?.message?.content
    if (!raw) {
      return NextResponse.json(
        { error: "No structured data returned from parser" },
        { status: 500 }
      )
    }

    const parsed = JSON.parse(raw) as {
      poNumber: string
      poDate: string
      salesOrderNumber: string
      vendorInfo: {
        vendorCode: string
        vendorName: string
        vendorAddress: Record<string, string>
      }
      shipToInfo: {
        name: string
        projectCode: string
        address: Record<string, string>
      }
      billToInfo: { name: string; address: Record<string, string> }
      deliverToInfo: { name: string }
      projectId: string
      memo: string
      items: Array<{
        sku: string
        title: string
        description?: string
        orderQty: number
        needByDate: string
        rate: number
      }>
      tax: number
      total: number
    }

    const items = (parsed.items ?? []).map((item) => ({
      itemId: "",
      orderQty: Number(item.orderQty) || 0,
      needByDate: item.needByDate ?? "",
      rate: Number(item.rate) || 0,
      newItem: {
        sku: item.sku ?? "",
        title: item.title ?? "",
        description: item.description ?? ""
      }
    }))

    const parsedFormData = {
      poNumber: parsed.poNumber ?? "",
      poDate: parsed.poDate ?? "",
      salesOrderNumber: parsed.salesOrderNumber ?? "",
      vendorInfo: {
        vendorCode: parsed.vendorInfo?.vendorCode ?? "",
        vendorName: parsed.vendorInfo?.vendorName ?? "",
        vendorAddress: {
          ...emptyAddress(),
          ...parsed.vendorInfo?.vendorAddress
        }
      },
      shipToInfo: {
        name: parsed.shipToInfo?.name ?? "",
        projectCode: parsed.shipToInfo?.projectCode ?? "",
        address: { ...emptyAddress(), ...parsed.shipToInfo?.address }
      },
      billToInfo: {
        name: parsed.billToInfo?.name ?? "",
        address: { ...emptyAddress(), ...parsed.billToInfo?.address }
      },
      deliverToInfo: { name: parsed.deliverToInfo?.name ?? "" },
      projectId: parsed.projectId ?? "",
      memo: parsed.memo ?? "",
      items,
      tax: Number(parsed.tax) || 0,
      total: Number(parsed.total) || 0
    }

    return NextResponse.json(parsedFormData)
  } catch (err) {
    console.error("[parse-po-pdf]", err)
    const message = err instanceof Error ? err.message : "Failed to parse PDF"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
