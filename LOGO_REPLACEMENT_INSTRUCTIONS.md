# Logo Replacement Instructions

## Steps to Replace the Logo

The new logo image you provided needs to be saved in two locations:

### 1. Save the logo image as:
- `client/src/assets/logo.png` (for use in components)
- `client/public/logo.png` (for public access)

### 2. Image Requirements:
- Format: PNG with transparent background
- Recommended size: 512x512px or larger (will be scaled down as needed)
- The logo will be displayed at various sizes:
  - Sidebar: 40x40px (w-10 h-10)
  - Navbar: 48x48px (w-12 h-12) on desktop, 32x32px (w-8 h-8) on mobile

### 3. Current Logo Usage Locations:
The logo is currently used in:
- `client/src/components/layout/ModernSidebar.jsx` - Dashboard sidebar
- `client/src/components/ui/Navbar.jsx` - Landing page navbar
- `client/src/components/layout/DashboardNavbar.jsx` - Dashboard navbar (if needed)

### 4. How to Replace:
1. Save your new logo image (the purple triangles design) as `logo.png`
2. Replace the existing files:
   - Copy to: `client/src/assets/logo.png`
   - Copy to: `client/public/logo.png`
3. Refresh your browser - the new logo should appear automatically

### 5. Verify the Logo:
After replacement, check these pages:
- Landing page navbar (top)
- Dashboard sidebar (left side)
- All role dashboards (admin, student, university, partner, finance)

## Note:
The code has already been updated to use the logo image. You just need to replace the physical image files with your new purple triangles logo design.
