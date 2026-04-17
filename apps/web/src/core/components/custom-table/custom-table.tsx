import { rem } from "@repo/mantine-ui"
import type {
  MRT_RowData,
  MRT_TableOptions
} from "@repo/mantine-ui/data-table/index"

import classes from "./custom-table.module.css"

export function getDefaultMRTOptions<TData extends MRT_RowData>(): Partial<
  MRT_TableOptions<TData>
> {
  return {
    positionGlobalFilter: "left",
    layoutMode: "grid",
    enableDensityToggle: false,
    displayColumnDefOptions: {
      "mrt-row-actions": {
        maxSize: 96,
        grow: true
      }
    },
    mantineTableProps: {
      striped: "odd",
      withColumnBorders: true,
      withRowBorders: true
    },
    mantineTableHeadProps: {
      className: "border-solid border-0 border-t border-mtn-default-border"
    },
    mantineTableHeadCellProps: {
      className: "[&>div]:items-center [&>div]:justify-between",
      style: {
        padding:
          "calc(0.4375rem * var(--mantine-scale)) var(--table-horizontal-spacing, var(--mantine-spacing-xs))"
      }
    },
    mantinePaginationProps: {
      pe: rem(16)
    },
    mantineTableBodyCellProps: {
      style: {
        padding:
          "calc(0.4375rem * var(--mantine-scale)) var(--table-horizontal-spacing, var(--mantine-spacing-xs))"
      }
    },
    mantinePaperProps: {
      className: classes.root,
      shadow: "none"
    },
    initialState: {
      density: "xs",
      showGlobalFilter: true,
      columnPinning: { left: ["mrt-row-actions"] }
    }
  }
}
