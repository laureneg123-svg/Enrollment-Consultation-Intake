# Enrollment Consultation Request Form

A web-based form for Waystar's "Request for short term Enrollment Consultant" that generates a downloadable PDF.

## Features

✅ **Clean, professional design** matching Waystar branding  
✅ **Responsive layout** - works on desktop, tablet, and mobile  
✅ **Real-time validation** - ensures all required fields are completed  
✅ **Conditional fields** - shows/hides fields based on user selections  
✅ **PDF generation** - creates a formatted PDF with all form data  
✅ **No backend required** - runs entirely in the browser  
✅ **GitHub Pages ready** - deploy in minutes  

## Live Demo

Once deployed, your form will be accessible at:
```
https://[your-username].github.io/enrollment-form/
```

## Quick Start - Deploy to GitHub Pages

### Option 1: Upload via GitHub Website (Easiest)

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it `enrollment-form` (or any name you prefer)
   - Make it Public
   - Don't initialize with README (we have our own)
   - Click "Create repository"

2. **Upload files:**
   - Click "uploading an existing file"
   - Drag and drop all 4 files from this folder:
     - `index.html`
     - `styles.css`
     - `script.js`
     - `README.md`
   - Click "Commit changes"

3. **Enable GitHub Pages:**
   - Go to your repository's Settings
   - Scroll down to "Pages" in the left sidebar
   - Under "Source", select "main" branch
   - Click "Save"
   - Wait 1-2 minutes

4. **Access your form:**
   - Your form will be live at: `https://[your-username].github.io/enrollment-form/`

### Option 2: Using Git Command Line

If you're comfortable with Git:

```bash
# Clone this directory or create a new repository
git init
git add .
git commit -m "Initial commit: Enrollment consultation form"

# Add your GitHub repository as remote
git remote add origin https://github.com/[your-username]/enrollment-form.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then enable GitHub Pages in repository settings (Step 3 above).

### Option 3: Using GitHub Desktop

1. Open GitHub Desktop
2. File → Add Local Repository
3. Select this folder
4. Publish repository to GitHub
5. Enable GitHub Pages in repository settings

## File Structure

```
enrollment-form/
├── index.html      # Main form structure
├── styles.css      # Waystar-branded styling
├── script.js       # Form logic and PDF generation
└── README.md       # This file
```

## How It Works

1. **User fills out the form** - All fields validate in real-time
2. **Conditional logic** - Certain fields appear/disappear based on selections
3. **Click "Generate PDF"** - JavaScript processes the form data
4. **PDF downloads automatically** - Formatted document ready to submit
5. **No data stored** - Everything happens in the browser

## Customization

### Change Colors

Edit `styles.css`:
- **Teal headers:** Look for `#6AAFB0`
- **Orange accents:** Look for `#FF6B35`
- **Text colors:** Look for `#2c3e50`

### Add/Remove Fields

1. Edit `index.html` to add/remove form fields
2. Update `script.js` `getFormData()` function to include new fields
3. Update `generatePDF()` function to display new fields in the PDF

### Change PDF Layout

Edit the `generatePDF()` function in `script.js`:
- Adjust spacing with `y` and `lineHeight` variables
- Modify section headers with `addSectionHeader()`
- Change fonts/colors with `doc.setFont()` and `doc.setTextColor()`

## Browser Compatibility

✅ Chrome/Edge (recommended)  
✅ Firefox  
✅ Safari  
✅ Mobile browsers  

## Technical Details

- **No backend required** - Pure frontend solution
- **PDF Library:** jsPDF v2.5.1 (loaded via CDN)
- **Form validation:** HTML5 + custom JavaScript
- **Responsive:** CSS Grid + Flexbox
- **File size:** < 50KB total

## Troubleshooting

### Form won't submit
- Check browser console (F12) for errors
- Ensure all required fields are filled

### PDF generation fails
- Disable browser ad blockers
- Check internet connection (jsPDF loads from CDN)
- Try a different browser

### GitHub Pages shows 404
- Wait 2-3 minutes after enabling Pages
- Check that repository is Public
- Verify branch is set to "main"

## Form Fields Included

### Account Information
- Account Name (required)
- Customer ID (required)
- Applications checkboxes (required)
- EOB Conversion (Y/N)
- Rebatcher (Y/N + conditional CustIDs field)
- Domain/child accounts specification

### Client Contact Information
- Full Name, Phone, Email, Title (all required)
- Same as Enrollment Contact (Y/N/Not Sure)
- Alternative enrollment contact details

### Additional Consultation Information
- Type of consultation (required)
- Project length estimation (required)
- Preferred start date (required)
- MRR/Billing NPIs
- Priority payers
- Additional information

### Waystar Representatives
- CSM, SSA, Sales Rep (optional)

## Support

For issues with:
- **The form itself:** Check this README or inspect browser console
- **GitHub Pages:** See [GitHub Pages documentation](https://docs.github.com/en/pages)
- **PDF generation:** See [jsPDF documentation](https://github.com/parallax/jsPDF)

## License

This form is created for Waystar internal use. Modify as needed for your organization.

## Version History

- **v1.0** - Initial release with full form functionality and PDF generation

---

**Created:** February 2026  
**Technology:** HTML5, CSS3, JavaScript, jsPDF  
**Deployment:** GitHub Pages
