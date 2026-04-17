## Default Page Layout Style Prompt Guide

The App Layout is a sidebar left and main content right.

We have desktop view, tablet view, where the sidebar reduce from 280 to 80 px, and mobile view, where the sidebar is hidden and the main content take all the space.

This prompt is only for the page inside of the main, we will not modify the app layout.

Context:

- Modes:
  - This pages normally will have 2-3 modes:
    - Create, Edit and View.
  - Concept layout:
    A grid view: 4-8 cols:
  - 4 cols:
    - Individual view of the item, with actions.
      - Top to Bottom:
        - Image
        - Title
        - Description (fields)
        - More fields (maybe expandable if is too long)
        - Actions Buttons
          - 2 or 1 button and a dropdown with more actions
      - If mode is Edit or View, this card will be a preview of the item form, so the user will have a realtime preview of the item he is add/edit.
        - With this, we have a global component where will be always view on all modes.
  - 8 cols:
    - This col will be dinamic depend on actions:
      - Create/Edit:
        - A form 1 col top to bottom with form fields.
        - Actions buttons will be always bottom and at the 4 cols grid.
      - View:
        - With a view mode, we will have a tab view, and each tab will trigger a view.
          - Example:
            - Item Page:
              - 4 cols:
                - Image
                - Title
                - Description (fields)
                - More fields (maybe expandable if is too long)
                - Actions Buttons
                  - 2 or 1 button and a dropdown with more actions
              - 8 cols (view mode):
                - Tabs:
                  - Stock Level
                  - Transactions
                  - Update History
            - Profile Page:
              - 4 cols:
                - Image
                - Title
                - Description (fields)
                - More fields (maybe expandable if is too long)
                - Actions Buttons
                  - 2 or 1 button and a dropdown with more actions
              - 8 cols (view mode):
                - Tabs:
                  - Profile
                  - Security
                  - General Settings
- UI Components:
  - Grid (Grid and Grid.Cols) col={{base: 12, md: 4}} and col={{base: 12, md: 8}}
  - Card withBorder, no shadow, rounded default
  - TextInput
  - Text
  - Title
  - Image (next/image)
  - Button
  - Tabs
