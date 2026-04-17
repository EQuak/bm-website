### Use Form Prompt Guide

this is a example how I used and organized my form on this page (transactions page)

```tsx
const form = useForm<TransactionFormSchemaType>({
  validate: mtnZodResolver(
    props.mode === "create"
      ? transactionFormSchemaValidationCreate
      : transactionFormSchemaValidationEdit
  ),
  initialValues: transactionFormInitialValues,
  enhanceGetInputProps: ({ form, field }) => ({
    readOnly:
      props.mode === "view" ||
      (props.mode === "edit" &&
        (field === "data.transactionType" || field === "data.locationId")),
    disabled: transactionData.isLoading || !form.initialized
  })
})
```

the validation will be only trigged at submission of the form, or if trigged manually by a function,

the types and initial values, I stardardize on another file, normaly formname.type.to-slate-50

so I can use accross the project.

```ts
import { z } from "zod/v4"

import type { RouterOutputs } from "@repo/api"
import {
  inventoryTransactionsSchema,
  subTypeEnum,
  transactionsTypeEnum
} from "@repo/db/schema"

export const transactionFormSchema = z.object({
  states: z.object({
    loading: z.boolean()
  }),
  data: inventoryTransactionsSchema.select
    .extend({
      transactionType: z.literal("").or(transactionsTypeEnum),
      subType: z.literal("").or(subTypeEnum)
    })
    .omit({
      id: true,
      createdAt: true,
      updatedAt: true
    })
})

export const transactionFormSchemaValidationCreate =
  transactionFormSchema.extend({
    data: inventoryTransactionsSchema.insert.omit({
      id: true
    })
  })

export const transactionFormSchemaValidationEdit = transactionFormSchema.extend(
  {
    data: inventoryTransactionsSchema.update
  }
)

export type TransactionFormSchemaType = z.infer<
  typeof transactionFormSchema
> & {
  states: {
    locationDrawer: {
      opened: boolean
    }
    itemDrawer: {
      opened: boolean
    }
    loading: boolean
    transaction?: NonNullable<
      RouterOutputs["inventoryTransactions"]["getInventoryTransactionsById"]
    >
    selectedItem?: NonNullable<
      RouterOutputs["inventory"]["items"]["getItemBySku"]
    > | null

    selectedLocation?:
      | NonNullable<
          RouterOutputs["inventoryTransactions"]["getInventoryTransactionsById"]
        >["location"]
      | null
  }
}

export const transactionFormInitialValues = {
  states: {
    locationDrawer: {
      opened: false
    },
    itemDrawer: {
      opened: false
    },
    loading: false,
    transaction: undefined,
    selectedItem: undefined,
    selectedLocation: undefined
  },
  data: {
    locationSlug: null,
    profileId: null,
    transferedToSlug: null,
    transferedFromSlug: null,
    transactionType: "",
    subType: "",
    qty: 0,
    price: "0.00",
    supplier: "",
    justification: "",
    itemSku: ""
  }
} satisfies TransactionFormSchemaType
```

Look a interestand thing. I'm using the form to control the state of the form and the states to control other states of the component, without need to use zustand or useState.
With this states, I also use the `enhanceGetInputProps` to control like if the modal is open, or if the form/page is loading.

### Performance Issue

By default, the form is in controlled mode, so the form data is stored in React state and all components are rerendered when form data changes.
This is fine for a small form, will be probably fine for 95% of this app forms, but for a large form, this can cause performance issues, because the form is rerendered on every change, all components.

So by default we will use the controlled mode, but be ready to change for uncontrolled mode, if the form is large, and the performance is an issue.
