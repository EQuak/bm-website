import { Button, Flex, Group, Stack, Text } from "@repo/mantine-ui"
import Image from "next/image"
import type React from "react"

interface ImagePreviewProps {
  image: string | null
  onRemove: () => void
  onApprove: () => void
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  onRemove,
  onApprove
}) => {
  if (!image) return null

  return (
    <Flex direction="column" gap={8}>
      <Text>Preview's</Text>
      <Group>
        <Stack gap={0}>
          <Text fz={12} c={"dimmed"}>
            4/3 Aspect Ratio
          </Text>
          <Image
            src={image}
            alt="Cropped Preview"
            width={160}
            height={120}
            className="rounded-md object-cover"
          />
        </Stack>
        <Stack gap={0}>
          <Text fz={12} c={"dimmed"}>
            Square
          </Text>
          <Image
            src={image}
            alt="Cropped Preview"
            width={120}
            height={120}
            className="rounded-md object-cover"
          />
        </Stack>
        <Stack gap={0}>
          <Text fz={12} c={"dimmed"}>
            Circle
          </Text>
          <Image
            src={image}
            alt="Cropped Preview"
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
        </Stack>
      </Group>
      <Group>
        <Button variant="light" onClick={onRemove}>
          Discard
        </Button>
        <Button variant="light" color="green" onClick={onApprove}>
          Approve
        </Button>
      </Group>
    </Flex>
  )
}

export default ImagePreview
