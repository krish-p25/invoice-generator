# Per-Invoice Shipping Address Toggle

**Date:** 2026-10-05
**Status:** Approved for implementation

## Problem

A template-wide shipping-address toggle already exists: `shippingAddress` is a
registered `FieldType` in `layout.bodyFields`, so `FieldVisibilityPanel`
auto-generates a switch for it, and all three renderers honor
`fields.shippingAddress.visible`.

What is missing is **per-invoice** control. A CSV batch is all-or-nothing today:
either every invoice shows its shipping address or none do.

## Design

### Data model

One new required field on `Invoice`:

```ts
showShippingAddress: boolean;
```

It joins the existing family of per-invoice visibility flags (`showVAT`,
`showDiscount`, `showShipping`) and follows their idiom exactly.

`CSVRow` gains `showShippingAddress: string` to carry the raw CSV text, which is
coerced to a boolean during grouping.

### Default: derived, not hardcoded

When the CSV column is absent or blank, the default is:

```
shippingAddress.trim() !== ''
```

The renderers already require a non-empty address, so every existing CSV and
saved template produces byte-identical output. No visual change for existing
users.

`invoiceStore` is not persisted, so it needs no migration. `previewStore` *is*
persisted via zustand `persist`, so a returning user's stored invoice will have
`showShippingAddress === undefined`. That is treated as "derive from data", not
`false` — otherwise their shipping address would silently disappear on upgrade.

### Precedence: three-way AND

```ts
fields.shippingAddress.visible   // template master switch (existing)
  && invoice.showShippingAddress  // per-invoice (new)
  && invoice.shippingAddress      // non-empty data (existing)
```

The template toggle remains the global kill-switch; the per-invoice flag narrows
within it. Switching the template field off still hides the address everywhere,
which is what the Fields tab already promises.

### CSV

New **optional** column `show shipping address`, accepting `yes/no`,
`true/false`, `1/0`, `y/n`, case-insensitively. Blank or unrecognized values
fall back to the derived default rather than raising an error.

Papaparse ignores unknown columns and `csvParser` builds `CSVRow` from explicit
`row['...'] || ''` lookups, so older CSVs are unaffected. The grouper reads the
value from the first row of each customer group, matching how `showVAT` already
takes the first VAT rate per customer via `customerVATMap`.

### UI: two surfaces, each following its local idiom

- **CSV batch** — a `Toggle` on each `InvoiceCard`, below the totals summary.
  Requires a new `toggleShippingAddress(id)` action on `invoiceStore`, which
  currently has no per-invoice update path at all.
- **Live editor** — an inline hover control on the shipping-address block in
  `EditableContentRenderer`, mirroring how `toggleVAT` / `toggleDiscount` /
  `toggleShipping` already appear as inline add/remove buttons in the totals
  box. `previewStore.toggleShippingAddress()` is simpler than `toggleShipping`
  because an address does not affect totals and needs no recalculation.

## Files touched

`invoice.types.ts`, `csv.types.ts`, `csvTemplate.ts`, `csvParser.ts`,
`csvGenerator.ts`, `invoiceGrouper.ts`, `sampleData.ts`, `invoiceStore.ts`,
`previewStore.ts`, `InvoiceCard.tsx`, `InvoiceRenderer.tsx`,
`EditableInvoiceRenderer.tsx`, `EditableContentRenderer.tsx`, `App.tsx`.

## Verification

The project has no test runner (no vitest/jest in `package.json`), so
verification is `npm run build` plus a browser pass.

Declaring `showShippingAddress` as **required** rather than optional makes
`tsc -b` fail at every `Invoice` construction site until each is handled, which
is what guarantees no construction site is missed. An optional field would
compile silently and leave the flag `undefined`, where `undefined && ...` hides
the address.

## Known adjacent fragility (not fixed here)

`csvGenerator.generateCSVTemplate()` joins `CSV_COLUMNS` for the header but
hand-maintains a separate `sampleRow` array. The two are aligned only by array
index, and nothing type-checks that. Adding a column to one without the other
silently shifts every downloaded template by one column.
