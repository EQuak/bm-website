import { Button, FileButton, Group, Stack } from "@repo/mantine-ui"
import type React from "react"
import { useState } from "react"

import ImageCropper from "./ImageCropper"
import ImagePreview from "./ImagePreview"

interface UploadProfileButtonProps {
  setFile: (file: File | null) => void
}

const UploadProfileButton: React.FC<UploadProfileButtonProps> = ({
  setFile
}) => {
  const [image, setImage] = useState<string | null>(null)
  const [isCropModalOpen, setCropModalOpen] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<File | null>(null)
  const handleImageUpload = async (uploadedFile: File | null) => {
    if (!uploadedFile) return
    setImage(URL.createObjectURL(uploadedFile))
    setCropModalOpen(true)
  }

  const handleRemovePreview = () => {
    setFile(null)
  }

  const handleApproveImage = () => {
    setFile(previewImage)
    setPreviewImage(null)
    setCropModalOpen(false)
    setImage(null)
  }

  return (
    <Stack>
      <Group>
        <FileButton onChange={handleImageUpload} accept="image/*">
          {(props) => (
            <Button size="compact-sm" variant="light" {...props}>
              Select new profile image
            </Button>
          )}
        </FileButton>
      </Group>
      {previewImage && (
        <ImagePreview
          image={URL.createObjectURL(previewImage)}
          onRemove={handleRemovePreview}
          onApprove={handleApproveImage}
        />
      )}
      {isCropModalOpen && image && (
        <ImageCropper
          opened={isCropModalOpen}
          setOpened={setCropModalOpen}
          image={image}
          setFile={setPreviewImage}
        />
      )}
    </Stack>
  )
}

export default UploadProfileButton
