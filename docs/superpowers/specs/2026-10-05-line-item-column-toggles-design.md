# Line Item Column Toggles (Qty / Unit Price)

**Date:** 2026-10-05
**Status:** Implemented

## Problem

The line items table is a fixed four columns — Description, Qty, Unit Price,
Total — hardcoded in each renderer. Invoices for a single item, or for a service
priced as a lump sum, need only a description and an amount.

## Scope

Template-wide, not per-invoice. Column layout is a document-design choice, and a
batch whose invoices had differently shaped tables would look inconsistent.

## Design

### Config

A new section on `TemplateConfig`, deliberately *not* modelled as `FieldType`
entries: Qty and Unit Price are columns inside the `lineItems` field, not
independently positionable fields, so giving them `FieldType` entries would
wrongly enrol them in the drag/position system.

```ts
lineItemColumns: {
  showQuantity: boolean;
  showUnitPrice: boolean;
}
```

Defaults to both `true`, matching the table every existing template renders.

### Invariant: showQuantity implies showUnitPrice

A visible Qty column beside a hidden Unit Price column leaves the row total
unexplained — `Qty 3` next to `Total $300` with no unit price reads as an
arithmetic error on the invoice.

The invariant is enforced inside `templateStore.updateLineItemColumn` rather
than in the panel, so no caller can reach the invalid pair:

- showing Qty also restores Unit Price
- hiding Unit Price also hides Qty
- hiding Qty leaves Unit Price untouched, merely unlocking it

The panel additionally disables the Unit Price toggle while Qty is visible, so
the dependency is visible rather than surprising.

### Display toggles never move money

Hiding a column never rewrites a stored `quantity`. Silently turning `3` into
`1` would change the invoice total as a side effect of a display setting.
`item.total` stays `quantity * unitPrice` throughout.

### Header wording

With neither Qty nor Unit Price shown, the final column header becomes
**Amount** instead of **Total**, since it is no longer the product of two
visible numbers.

### The editor must remain an input surface

`item.total` is computed and has never been editable — only description, qty and
unitPrice carry `contentEditable`. With both columns hidden the live editor would
have no money input at all, breaking exactly the service-invoice case this
feature exists for.

So when Unit Price is hidden, the Amount cell becomes editable and writes
`{ unitPrice: <typed>, quantity: 1 }`. The store invariant guarantees Qty is
also hidden in that state, so pinning quantity to 1 is invisible and makes the
typed amount exactly the line total. This is an explicit user edit, not a side
effect of toggling, so it does not violate the rule above.

## Files touched

`template.types.ts` (+ `LineItemColumn` export), `defaultTemplate.ts`,
`templateStore.ts` (action + `version: 4` migration),
`FieldVisibilityPanel.tsx`, `InvoiceRenderer.tsx`,
`EditableContentRenderer.tsx`.

## Not touched

`EditableInvoiceRenderer.tsx` is dead code — nothing imports it, and its table
already diverges from the other two (it carries an extra `VAT %` column). It was
left unmodified rather than maintained as an unused divergent copy.

## Verification

- `npm run build` (`tsc -b`, strict + `noUnusedLocals`) passes
- All 12 toggle transitions preserve the invariant, and the invalid state
  self-repairs (checked by direct simulation of the reducer)
- `pdfService` runs `html2canvas` over the hidden `InvoiceRenderer` DOM, so the
  PDF output follows the same conditionals as the on-screen table; no separate
  jspdf-autotable table exists
- No `colSpan` anywhere in the codebase, so no layout assumed four columns
