import type { DropzoneProps } from "@repo/mantine-ui"
import { Dropzone, Group, IMAGE_MIME_TYPE, rem, Text } from "@repo/mantine-ui"
import { IconPhoto, IconUpload, IconX } from "@repo/mantine-ui/icons/index"

export type DropZoneProps = Partial<DropzoneProps> & {
  onDrop: DropzoneProps["onDrop"]
  label?: string
  description?: string
  onlyImage?: boolean
  maxSizeMB?: number
  minHeight?: number
}

export function DropZoneComponent(props: DropZoneProps) {
  const { maxSizeMB, minHeight, ...rest } = props
  return (
    <Dropzone
      {...rest}
      maxSize={
        maxSizeMB
          ? maxSizeMB * 1024 * 1024
          : props.maxSize
            ? props.maxSize
            : 1024 * 1024 * 2 // default 2mb
      }
      accept={props.onlyImage ? IMAGE_MIME_TYPE : props.accept}
    >
      <Group
        justify="center"
        gap="xl"
        mih={minHeight ?? 220}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            style={{
              width: rem(40),
              height: rem(40),
              color: "var(--mantine-color-blue-6)"
            }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{
              width: rem(40),
              height: rem(40),
              color: "var(--mantine-color-red-6)"
            }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            style={{
              width: rem(40),
              height: rem(40),
              color: "var(--mantine-color-dimmed)"
            }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="lg" inline>
            {props.label ?? "Drag files here or click to select files"}
          </Text>
          {props.description && (
            <Text size="sm" c="dimmed" inline mt={7}>
              {props.description}
            </Text>
          )}
        </div>
      </Group>
    </Dropzone>
  )
}
