# 🎨 Visual Template Editor - User Guide

## 🎉 What's New - Drag & Drop Editor!

Your invoice generator now includes a **visual drag-and-drop editor** that lets you customize the exact layout of your invoice template!

---

## 🖱️ How to Use the Editor

### **Step 1: Enter Edit Mode**

1. Open http://localhost:5173/
2. Look at the **Invoice Template** section
3. Click the **"Edit Layout"** button (top right of template preview)

**You'll see:**
- ✅ Green "Edit Mode Active" indicator
- ✅ Grid overlay for alignment
- ✅ Instructions tooltip on the right
- ✅ Button changes to "Done Editing"

---

### **Step 2: Select & Move Fields**

**To Select a Field:**
- Click on any invoice field (Logo, Invoice Number, Bill From, etc.)
- Selected field gets a **blue border** with resize handles
- Field name appears at the bottom left

**To Move a Field:**
1. Click and hold on the field
2. Drag it to the new position
3. Release to drop
4. Position updates automatically!

**Available Fields:**
- 📷 Logo
- 🔢 Invoice Number
- 📅 Invoice Date
- 🏢 Bill From
- 👤 Bill To
- 📍 Shipping Address
- 📋 Line Items Table
- 📝 Notes
- 💰 Totals

---

### **Step 3: Fine-Tune Layout**

**Grid Alignment:**
- Toggle grid: Click "Hide/Show Grid" button
- Snap to grid lines for perfect alignment
- 20px × 20px grid squares

**Visual Indicators:**
- **Blue border** = Selected field
- **Blue dot handles** = Resize points (corners)
- **Field label** = Shows above selected field
- **Selection info** = Bottom left corner

---

### **Step 4: Save & Exit**

Click **"Done Editing"** when finished:
- ✅ Changes saved automatically to localStorage
- ✅ Layout applies to all generated invoices
- ✅ Preview returns to normal view

---

## 🎯 Editing Workflow

```
1. Click "Edit Layout"
     ↓
2. Edit Mode Activates
   • Grid appears
   • Fields become draggable
     ↓
3. Click & Drag Fields
   • Move them around
   • Position where you want
     ↓
4. Click "Done Editing"
   • Saves layout
   • Returns to preview
     ↓
5. Upload CSV
   • Generated invoices use your custom layout!
```

---

## 💡 Tips & Tricks

### **Best Practices:**

1. **Use the Grid**
   - Helps align fields perfectly
   - Toggle on/off as needed
   - 20px grid = professional spacing

2. **Start with Main Elements**
   - Position logo first
   - Then invoice number & date
   - Finally addresses and tables

3. **Leave Margins**
   - Don't place fields too close to edges
   - Keep ~2rem (32px) from page borders
   - Ensures proper PDF printing

4. **Test Before Upload**
   - Arrange fields in edit mode
   - Exit edit mode to see final result
   - Upload CSV to verify on real data

### **Field-Specific Tips:**

**Logo:**
- Best in top-left or top-center
- Leave space for invoice number (top-right)
- Upload before positioning for accurate size

**Invoice Number & Date:**
- Usually top-right corner
- Stack vertically
- Right-align text

**Bill From / Bill To:**
- Side-by-side in header
- Leave space between them
- Common: left and right columns

**Line Items Table:**
- Full width works best
- Center of invoice
- Needs height for multiple rows

**Totals:**
- Bottom-right is standard
- Near line items table
- Right-align for clarity

**Notes:**
- Bottom-left
- Opposite of totals
- Left-align for readability

---

## 🔄 Current Limitations & Planned Features

### **✅ Currently Available:**
- Drag to move fields
- Click to select fields
- Visual selection indicators
- Grid overlay for alignment
- Auto-save to localStorage

### **🚧 Coming Soon (Not Yet Implemented):**
- Resize fields by dragging handles
- Undo/Redo functionality
- Snap-to-guides (alignment helpers)
- Lock/unlock fields
- Copy field styling
- Multiple template presets
- Import/export layouts

---

## 🎨 Complete Customization Checklist

- ✅ **Colors** (Styles Tab)
  - Primary, Secondary, Accent
  - Background color

- ✅ **Typography** (Styles Tab)
  - Font family
  - Font sizes (per field)

- ✅ **Logo** (Logo Tab)
  - Upload company logo
  - Auto-positions in edit mode

- ✅ **Field Visibility** (Fields Tab)
  - Show/hide any field
  - Organized by section

- ✅ **Layout** (Edit Layout Button)
  - Drag & drop positioning
  - Custom field placement

---

## 🐛 Troubleshooting

### **Field Won't Move:**
- Make sure you're in Edit Mode
- Check that "Edit Layout" button shows "Done Editing"
- Try clicking the field first to select it

### **Changes Not Saving:**
- Verify localStorage is enabled in browser
- Try hard refresh (Ctrl+F5)
- Check browser console for errors

### **Grid Not Showing:**
- Click "Show Grid" button in edit mode
- Grid only visible when editing

### **Can't Exit Edit Mode:**
- Click "Done Editing" button
- Or refresh page (changes are saved)

---

## 📊 Example Layouts

### **Layout 1: Classic Professional**
```
[Logo]                    [Invoice #]
                         [Date]

[Bill From]              [Bill To]

        [Line Items Table]

[Notes]                  [Totals]
```

### **Layout 2: Modern Centered**
```
        [Logo]

[Invoice #]              [Date]

[Bill From]              [Bill To]

        [Line Items Table]

        [Totals]
        [Notes]
```

### **Layout 3: Compact**
```
[Logo]  [Invoice #]  [Date]

[Bill From]  [Bill To]  [Ship To]

[Line Items Table]

[Notes]              [Totals]
```

---

## 🎓 Video Tutorial Equivalent

**Step-by-Step:**

1. **Launch App** → http://localhost:5173/
2. **Customize Styles** → Change colors, upload logo
3. **Enter Edit Mode** → Click "Edit Layout"
4. **Drag Logo** → Move to top-left
5. **Drag Invoice#** → Move to top-right
6. **Drag Bill From** → Position left side
7. **Drag Bill To** → Position right side
8. **Drag Table** → Center, full width
9. **Drag Totals** → Bottom-right
10. **Drag Notes** → Bottom-left
11. **Exit Edit Mode** → Click "Done Editing"
12. **Upload CSV** → See your custom layout!

---

## 💾 Data Persistence

**What Gets Saved:**
- ✅ Field positions (x, y coordinates)
- ✅ Field sizes (width, height)
- ✅ Field visibility (show/hide)
- ✅ Colors & fonts
- ✅ Logo (as base64)

**Where It's Saved:**
- Browser localStorage
- Key: `invoice-template-config`
- Automatic on every change

**Survives:**
- ✅ Page refresh
- ✅ Browser close/reopen
- ✅ Computer restart
- ❌ Different browser/device
- ❌ Incognito/private mode

---

## 🚀 Quick Start

**Fastest way to customize:**

```bash
# 1. Start editing
Click "Edit Layout" button

# 2. Rearrange (30 seconds)
- Drag logo to top-left
- Drag invoice# to top-right
- Drag addresses side-by-side
- Drag table to center
- Drag totals to bottom-right

# 3. Done!
Click "Done Editing"
```

**That's it!** Your custom layout is now saved and will be used for all generated invoices.

---

## 🎉 You're Ready!

The visual editor makes it easy to create professional invoices with your exact branding and layout preferences.

**Try it now:**
1. Click "Edit Layout"
2. Drag some fields around
3. Click "Done Editing"
4. Upload `sample_invoices.csv`
5. See your custom layout on real invoices!

---

**Questions or Issues?**
- Check browser console for errors
- Verify Edit Mode is active (green indicator)
- Try refreshing the page
- Check that fields are visible (Fields tab)

**Enjoy your drag-and-drop invoice editor!** 🎊
