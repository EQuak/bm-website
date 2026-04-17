---
name: data-table-patterns
description: Implementação de tabelas com TanStack Table v8 usando compound components. Use quando criar tabelas de dados, implementar paginação, seleção de linhas, colunas de ações, ou expansão de linhas.
---

# Data Table System - TanStack Table v8

## Overview

Sistema de data table usando TanStack Table v8 com arquitetura de compound components. Suporta colunas especiais (select, expand, actions), pinning, alinhamento e sincronização de estados visuais.

## Basic Usage

```typescript
import {
  DataTableProvider,
  Table,
  TableRoot,
  Toolbar,
  Pagination,
  useDataTable,
  type ColumnDef
} from "@repo/mantine-ui/compound-data-table"

function MyTablePage({ data }: { data: MyData[] }) {
  const { table } = useDataTable<MyData>({
    data,
    columns,
    initialPageSize: 50,
    extraProps: {
      // configurações especiais
    }
  })

  return (
    <DataTableProvider table={table}>
      <Toolbar />
      <TableRoot>
        <Table<MyData> />
      </TableRoot>
      <Pagination />
    </DataTableProvider>
  )
}
```

## Column Definitions

### Basic Column

```typescript
const columns: ColumnDef<DataType>[] = [
  {
    header: "Nome",
    accessorKey: "name",
    size: 200,
    minSize: 150,
    maxSize: 300,
    enableSorting: true,
    meta: {
      headerAlign: "left",
      cellAlign: "left"
    }
  }
]
```

### Numeric/Currency Column

```typescript
{
  header: "Valor",
  accessorKey: "amount",
  size: 120,
  enableSorting: true,
  meta: {
    headerAlign: "right",
    cellAlign: "right"
  },
  cell: ({ getValue }) => {
    const value = getValue() as number
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }
}
```

### Badge/Status Column

```typescript
{
  header: "Status",
  accessorKey: "status",
  size: 100,
  meta: {
    headerAlign: "center",
    cellAlign: "center"
  },
  cell: ({ getValue }) => {
    const status = getValue() as string
    const color = status === "ativo" ? "green" : "red"
    return <Badge color={color}>{status}</Badge>
  }
}
```

## Special Columns

### Select Column (Row Selection)

```typescript
extraProps: {
  selectColumn: {
    showSelectColumn: true
  }
}
```

- Posição: sempre à esquerda
- Sempre pinned/fixed
- Alinhamento: centralizado automático

### Expand Column (Row Expansion)

```typescript
extraProps: {
  expandColumn: {
    showExpandColumn: true,
    renderExpandedContent: (row) => (
      <div className="rounded bg-muted/50 p-4">
        <h4 className="mb-2 font-semibold">Detalhes</h4>
        <p>{row.original.description}</p>
      </div>
    )
  }
}
```

- Posição: à esquerda (após select)
- Sempre pinned/fixed
- Chevron com rotação 0° → 90°

### Actions Column

```typescript
extraProps: {
  actionColumn: {
    showActionColumn: true,
    position: "right",
    fixed: true,
    headerAlign: "center",
    cellAlign: "center",
    renderActions: (row) => (
      <Group gap="xs">
        <ActionIcon variant="subtle" onClick={() => handleEdit(row.original)}>
          <IconEdit size={16} />
        </ActionIcon>
        <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(row.original)}>
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
    )
  }
}
```

## Alignment System

### Automatic Alignment

| Column Type | Alignment |
|-------------|-----------|
| Select | center |
| Expand | center |
| Actions | center (configurável) |
| Regular | left (default) |

### Custom Alignment

```typescript
meta: {
  headerAlign: "center",
  cellAlign: "right"
}
```

## Complete Example

```typescript
const columns: ColumnDef<User>[] = [
  {
    header: "ID",
    accessorKey: "id",
    size: 80,
    enableSorting: true,
    meta: { headerAlign: "center", cellAlign: "center" }
  },
  {
    header: "Nome",
    accessorKey: "name",
    size: 200,
    enableSorting: true
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 250,
  },
  {
    header: "Saldo",
    accessorKey: "balance",
    size: 120,
    enableSorting: true,
    meta: { headerAlign: "right", cellAlign: "right" },
    cell: ({ getValue }) => formatCurrency(getValue() as number)
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 100,
    meta: { headerAlign: "center", cellAlign: "center" },
    cell: ({ getValue }) => (
      <Badge color={getValue() === "ativo" ? "green" : "red"}>
        {getValue() as string}
      </Badge>
    )
  }
]

const { table } = useDataTable<User>({
  data: users,
  columns,
  initialPageSize: 25,
  extraProps: {
    selectColumn: { showSelectColumn: true },
    expandColumn: {
      showExpandColumn: true,
      renderExpandedContent: (row) => <UserDetails user={row.original} />
    },
    actionColumn: {
      showActionColumn: true,
      position: "right",
      fixed: true,
      renderActions: (row) => <UserActions user={row.original} />
    }
  }
})
```

## Accessing Table State

```typescript
// Row selection
const selectedRows = table.getSelectedRowModel().rows
const selectedIds = Object.keys(table.getState().rowSelection)

// Check if any selected
const hasSelection = selectedRows.length > 0

// Pagination
const pagination = table.getState().pagination
const totalPages = table.getPageCount()
const currentPage = pagination.pageIndex + 1

// Filters
const globalFilter = table.getState().globalFilter
const columnFilters = table.getState().columnFilters

// Sorting
const sorting = table.getState().sorting
```

## Component Architecture

### Compound Components

```tsx
<DataTableProvider table={table}>
  {/* Toolbar com busca e toggle de colunas */}
  <Toolbar />

  {/* Container da tabela */}
  <TableRoot>
    <Table<DataType> />
  </TableRoot>

  {/* Paginação */}
  <Pagination />
</DataTableProvider>
```

### Using Context

```typescript
import { useDataTableContext } from "@repo/mantine-ui/compound-data-table"

function CustomToolbar() {
  const { table } = useDataTableContext<DataType>()

  const selectedCount = table.getSelectedRowModel().rows.length

  return (
    <Group>
      <Text>{selectedCount} selecionados</Text>
      <Button onClick={() => table.resetRowSelection()}>
        Limpar seleção
      </Button>
    </Group>
  )
}
```

## Data Attributes for Styling

```css
/* Por tipo de coluna */
th[data-column-type="select"] { }
td[data-column-type="expand"] { }
td[data-column-type="actions"] { }

/* Por pinning */
th[data-pinned], td[data-pinned] { }

/* Por posição */
th[data-last-col="left"], td[data-last-col="left"] { }
th[data-last-col="right"], td[data-last-col="right"] { }
```

## Visual State Sync

Colunas pinned sincronizam automaticamente com estado da linha:

```css
/* Hover */
.group-hover:bg-muted/50

/* Seleção */
.group-data-[state=selected]:bg-muted
```

## Best Practices

### Portuguese Localization

- Todos os textos em português
- Labels e placeholders localizados
- ARIA labels em português

### Performance

- Use `initialPageSize` apropriado (10-50)
- Evite renderização excessiva em `renderActions`
- Optimize `renderExpandedContent` para dados grandes

### Sizing Guidelines

| Column Type | Size |
|-------------|------|
| Select/Expand | 44px fixo |
| ID/Short | 60-80px |
| Name/Text | 150-250px |
| Email | 200-300px |
| Currency | 100-150px |
| Status/Badge | 80-120px |
| Actions | 100-200px |

### Error Handling

```typescript
// Empty state
if (!data.length) return <EmptyState message="Nenhum registro encontrado" />

// Loading state
if (isLoading) return <TableSkeleton rows={10} columns={5} />
```
