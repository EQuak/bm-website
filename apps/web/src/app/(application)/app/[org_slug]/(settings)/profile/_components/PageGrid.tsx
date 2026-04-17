"use client"

import { Grid } from "@repo/mantine-ui"

import { CardGrid } from "./CardGrid"
import { TabsGrid } from "./tabs-grid/TabsGrid"

export function PageGrid() {
  return (
    <Grid>
      <CardGrid />
      <TabsGrid />
    </Grid>
  )
}
