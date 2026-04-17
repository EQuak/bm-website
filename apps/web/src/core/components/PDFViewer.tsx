import {
  Button,
  Card,
  Center,
  Group,
  Loader,
  Modal,
  notifications,
  Stack,
  Text,
  useMediaQuery
} from "@repo/mantine-ui"
import {
  IconAlertCircle,
  IconDownload,
  IconFileOff,
  IconMaximize,
  IconTrash
} from "@repo/mantine-ui/icons/index"
import { useCallback, useEffect, useState } from "react"

export interface PDFViewerProps {
  file: File | null
  removeFile?: () => void
  isModalView?: boolean
  open?: boolean
  close?: () => void
  height?: string | number
}

export function PDFViewer({
  file,
  removeFile,
  isModalView = false,
  open = false,
  close,
  height = 600
}: PDFViewerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [showFullscreen, setShowFullscreen] = useState(false)

  // Single mobile detection for consistency
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Create blob URL when file changes
  useEffect(() => {
    if (!file) {
      setLoading(false)
      setError("No PDF file specified")
      setBlobUrl(null)
      return
    }

    // Validate file type
    if (
      !file.type.includes("pdf") &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setLoading(false)
      setError("Invalid file type. Please select a PDF file")
      setBlobUrl(null)
      return
    }

    // Create blob URL for valid file
    setLoading(true)
    setError(null)

    try {
      const url = URL.createObjectURL(file)
      setBlobUrl(url)
      setLoading(false)
    } catch {
      setLoading(false)
      setError("Failed to load PDF document")
      setBlobUrl(null)
    }
  }, [file])

  // Cleanup blob URL on unmount or file change
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [blobUrl])

  const handleDownload = useCallback(() => {
    if (!file) {
      notifications.show({
        title: "Download Failed",
        message: "No file available for download.",
        color: "red"
      })
      return
    }

    if (blobUrl) {
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = file.name
      link.click()
    }
  }, [file, blobUrl])

  const handleOpenFullscreen = useCallback(() => {
    setShowFullscreen(true)
  }, [])

  const handleCloseFullscreen = useCallback(() => {
    setShowFullscreen(false)
  }, [])

  // Render no file content
  const renderNoFileContent = () => (
    <Card
      withBorder={!isModalView}
      p="xl"
      style={{
        minHeight: isModalView ? "60vh" : "400px",
        backgroundColor: "#f8f9fa"
      }}
    >
      <Center style={{ height: "100%" }}>
        <Stack align="center" gap="md">
          <IconFileOff size={64} color="gray" />
          <Text size="lg" fw={500} c="dimmed">
            No PDF File Available
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            {error === "No PDF file specified"
              ? "Please select a PDF file to view."
              : "The selected file is not a valid PDF document."}
          </Text>
          {removeFile && (
            <Button variant="outline" color="gray" onClick={removeFile}>
              Clear Selection
            </Button>
          )}
        </Stack>
      </Center>
    </Card>
  )

  // Render PDF content with iframe
  const renderPDFContent = (isModal = false) => {
    if (isModal) {
      // For modal view - iframe directly without Card wrapper

      return (
        <div
          style={{
            height: isMobile ? "calc(100vh - 80px)" : "80vh",
            minHeight: isMobile ? "calc(100vh - 80px)" : "80vh",
            overflow: "hidden",
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {loading && (
            <Center style={{ position: "absolute", inset: 0, zIndex: 10 }}>
              <Stack align="center" gap="sm">
                <Loader size="lg" />
                <Text size="sm" c="dimmed">
                  Loading PDF...
                </Text>
              </Stack>
            </Center>
          )}

          {/* Show error messages inside modal */}
          {(error || !file) && !loading && (
            <Center style={{ position: "absolute", inset: 0, zIndex: 10 }}>
              <Stack align="center" gap="sm">
                <IconAlertCircle size={48} color="red" />
                <Text size="lg" c="red" fw={500}>
                  {error || "No PDF file specified"}
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  {error === "No PDF file specified" || !file
                    ? "Please select a PDF file to view."
                    : error === "Invalid file type. Please select a PDF file"
                      ? "The selected file is not a valid PDF document."
                      : "Failed to load the PDF document."}
                </Text>
                {error === "Failed to load PDF document" && (
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                )}
              </Stack>
            </Center>
          )}

          {blobUrl && !loading && !error && file && (
            <iframe
              src={blobUrl}
              style={{
                width: "100%",
                height: "100%",
                minHeight: isMobile ? "calc(100vh - 80px)" : "80vh",
                border: "none",
                flex: 1,
                display: "block"
              }}
              title={file?.name || "PDF Document"}
              allowFullScreen
            />
          )}
        </div>
      )
    }

    // Show no file content if file is invalid for inline view
    if (
      !file ||
      error === "No PDF file specified" ||
      error === "Invalid file type. Please select a PDF file"
    ) {
      return <Stack gap="md">{renderNoFileContent()}</Stack>
    }

    // For inline view - keep Card wrapper
    return (
      <Stack gap="md">
        {/* PDF Iframe Area */}
        <Card
          withBorder={true}
          p={0}
          style={{
            minHeight: typeof height === "number" ? `${height}px` : height,
            overflow: "hidden",
            position: "relative"
          }}
        >
          {loading && (
            <Center style={{ position: "absolute", inset: 0, zIndex: 10 }}>
              <Stack align="center" gap="sm">
                <Loader size="lg" />
                <Text size="sm" c="dimmed">
                  Loading PDF...
                </Text>
              </Stack>
            </Center>
          )}

          {error &&
            error !== "No PDF file specified" &&
            error !== "Invalid file type. Please select a PDF file" && (
              <Center style={{ position: "absolute", inset: 0, zIndex: 10 }}>
                <Stack align="center" gap="sm">
                  <IconAlertCircle size={48} color="red" />
                  <Text size="lg" c="red" fw={500}>
                    {error}
                  </Text>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </Stack>
              </Center>
            )}

          {blobUrl && !loading && !error && (
            <iframe
              src={blobUrl}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                minHeight: typeof height === "number" ? `${height}px` : height
              }}
              title={file?.name || "PDF Document"}
            />
          )}
        </Card>

        {/* Action buttons - only show for inline view if needed */}
        {!isModal && blobUrl && !error && !loading && (
          <Group justify="space-between">
            <Group gap="sm">
              {removeFile && (
                <Button
                  variant="outline"
                  color="red"
                  size="sm"
                  leftSection={<IconTrash size={16} />}
                  onClick={removeFile}
                >
                  Remove
                </Button>
              )}
            </Group>
            <Group gap="sm">
              <Button
                variant="filled"
                size="sm"
                leftSection={<IconDownload size={16} />}
                onClick={handleDownload}
              >
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftSection={<IconMaximize size={16} />}
                onClick={handleOpenFullscreen}
              >
                View Fullscreen
              </Button>
            </Group>
          </Group>
        )}
      </Stack>
    )
  }

  // Modal view (external modal control)
  if (isModalView && open && close) {
    return (
      <Modal.Root
        opened={open}
        onClose={close}
        size={isMobile ? "100%" : "55%"}
        centered
        fullScreen={isMobile}
      >
        <Modal.Overlay />
        <Modal.Content
          styles={{
            content: {
              zIndex: 9000,
              height: isMobile ? "100vh" : "auto",
              maxHeight: isMobile ? "100vh" : "95vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }
          }}
        >
          <Modal.Header
            styles={{
              header: {
                padding: isMobile ? "sm" : "md",
                borderBottom: "1px solid #e9ecef",
                backgroundColor: "#f8f9fa"
              }
            }}
          >
            <Modal.Title fw={600}>
              {file ? file.name : "PDF Viewer"}
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body
            px={isMobile ? 0 : "lg"}
            py={0}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            {renderPDFContent(true)}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    )
  }

  // Inline view + optional fullscreen modal
  return (
    <>
      {renderPDFContent(false)}

      {/* Fullscreen Modal */}
      <Modal.Root
        opened={showFullscreen}
        onClose={handleCloseFullscreen}
        size={isMobile ? "100%" : "55%"}
        centered
        fullScreen={isMobile}
      >
        <Modal.Overlay />
        <Modal.Content
          styles={{
            content: {
              height: isMobile ? "100vh" : "auto",
              maxHeight: isMobile ? "100vh" : "95vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }
          }}
        >
          <Modal.Header
            styles={{
              header: {
                padding: isMobile ? "sm" : "md",
                borderBottom: "1px solid #e9ecef",
                backgroundColor: "#f8f9fa"
              }
            }}
          >
            <Modal.Title fw={600}>
              {file ? file.name : "PDF Viewer"}
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body
            px={isMobile ? 0 : "lg"}
            py={0}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            {renderPDFContent(true)}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  )
}
