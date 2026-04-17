"use client"

import { ActionIcon, Text, Tooltip } from "@repo/mantine-ui"
import { IconHelpCircle } from "@repo/mantine-ui/icons"

export function FieldLabel({ text, hint }: { text: string; hint: string }) {
  return (
    <div className="flex items-center gap-1 whitespace-nowrap">
      <Text fz={"sm"} fw={500}>
        {text}
      </Text>
      <Tooltip label={hint} withArrow position="top-start">
        <ActionIcon variant="subtle" size="sm" aria-label={`${text} help`}>
          <IconHelpCircle size={16} />
        </ActionIcon>
      </Tooltip>
    </div>
  )
}
