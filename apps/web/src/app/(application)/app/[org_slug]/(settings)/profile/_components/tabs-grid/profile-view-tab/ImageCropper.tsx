import { Box, Button, Modal, Slider, Stack, Title } from "@repo/mantine-ui"
import type React from "react"
import { useCallback, useState } from "react"
import Cropper from "react-easy-crop"

import { getCroppedImg } from "#/utils/cropImage" // Ensure this path is correct

interface ImageCropperProps {
  opened: boolean
  setOpened: (opened: boolean) => void
  image: string
  setFile: (file: File) => void
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  opened,
  setOpened,
  image,
  setFile
}) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState<number>(1)
  const [rotation, _setRotation] = useState<number>(0)
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix this
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const onCropChange = useCallback((newCrop: { x: number; y: number }) => {
    setCrop(newCrop)
  }, [])

  const onCropComplete = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix this
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      )
      console.log("croppedImage", croppedImage)
      if (!croppedImage) {
        return
      }
      const file = new File([croppedImage], "cropped-image.webp", {
        type: "image/webp"
      })
      setFile(file)
      setOpened(false) // Close the modal after cropping
    } catch (error) {
      console.error("Error cropping image:", error)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Crop Image"
      size="lg"
    >
      <Stack>
        <Title order={4}>Crop Image</Title>
        <Box style={{ position: "relative", height: "400px" }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={onCropChange}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </Box>
        <Slider
          value={zoom}
          onChange={setZoom}
          min={1}
          max={3}
          step={0.1}
          label={(value) => `${value.toFixed(1)}`}
        />
        <Button onClick={handleCrop}>Crop Image</Button>
      </Stack>
    </Modal>
  )
}

export default ImageCropper
