# Data Table Alignment System

## Alinhamento Automático das Colunas Especiais

As colunas especiais (select, expand, actions) agora têm alinhamento centralizado automático:

- **Select Column**: sempre centralizada (header e células)
- **Expand Column**: sempre centralizada (header e células)  
- **Actions Column**: centralizada por padrão (configurável)

## Configurando Alinhamento na Coluna de Actions

```typescript
const extraProps: ExtraTableProps<User> = {
  actionColumn: {
    showActionColumn: true,
    position: "right",
    fixed: true,
    headerAlign: "center", // "left" | "center" | "right"
    cellAlign: "left",     // "left" | "center" | "right"
    renderActions: (row) => <ActionButtons />
  }
}
```

## Configurando Alinhamento em Colunas Regulares

Para alinhar colunas regulares, use a propriedade `meta` na definição da coluna:

```typescript
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    meta: {
      headerAlign: "center", // centraliza o header
      cellAlign: "left"      // mantém células à esquerda
    }
  },
  {
    accessorKey: "balance",
    header: "Saldo",
    meta: {
      headerAlign: "right",  // header à direita
      cellAlign: "right"     // células à direita (valores monetários)
    }
  }
]
```

## Data Attributes Disponíveis

As colunas agora possuem `data-*` attributes para estilização avançada:

```css
/* Estilizar especificamente colunas de seleção */
th[data-column-type="select"],
td[data-column-type="select"] {
  background-color: var(--muted);
}

/* Estilizar colunas de ações */
th[data-column-type="actions"],
td[data-column-type="actions"] {
  border-left: 1px solid var(--border);
}
```

## Opções de Alinhamento

- `"left"`: alinha à esquerda (padrão para texto)
- `"center"`: alinha ao centro (padrão para colunas especiais)
- `"right"`: alinha à direita (ideal para números/valores)

## Sincronização de Estados Visuais

As colunas pinned (select, expand, actions) automaticamente sincronizam com o estado visual da linha:

### Hover
Quando você faz hover em uma linha, todas as colunas pinned também ficam com a cor de hover (`bg-muted/50`).

### Seleção
Quando uma linha está selecionada, todas as colunas pinned também ficam com a cor de seleção (`bg-muted`).

### Implementação Técnica
- Usa `group` class no `<tr>` para agrupar os elementos
- Colunas pinned respondem a `group-hover:bg-muted/50` e `group-data-[state=selected]:bg-muted`
- Inclui `transition-colors` para animações suaves

Isso garante que a experiência visual seja consistente em toda a linha, independente das colunas estarem pinned ou não. 