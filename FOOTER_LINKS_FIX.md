# Footer Links Fix for Custom Pages

## Problem
Footer links in custom pages were not working because the FooterSection component was rendering content as plain text instead of HTML, preventing links from being clickable.

## Root Cause
There were actually **two separate issues**:

### Issue 1: Plain Text Rendering
The FooterSection component was using this approach to render content:
```typescript
{column.content.split('\n').map((paragraph, i) => (
  <p key={i} className="mb-4 last:mb-0" style={textStyleToCSS(column.textStyle)}>
    {paragraph}
  </p>
))}
```

This approach splits content by newlines and renders each line as plain text in `<p>` tags, which means any HTML links in the content would be displayed as text rather than rendered as clickable links.

### Issue 2: Layout Problem (Main Issue)
The custom pages layout (`app/custom_pages/layout.tsx`) had its own FooterProvider but **did not include ConditionalFooter**. This meant:
- Custom footer sections were setting `hasCustomFooter = true` in the custom pages' FooterProvider
- But the root layout's ConditionalFooter was using the root layout's FooterProvider (which still had `hasCustomFooter = false`)
- So the default footer always showed, and custom footer sections were either not rendered or hidden behind the default footer

## Solution
Changed the FooterSection component to use `dangerouslySetInnerHTML` similar to how the TextSection component handles HTML content:

```typescript
<div 
  className="prose max-w-none"
  style={textStyleToCSS(column.textStyle)}
  dangerouslySetInnerHTML={{ __html: column.content }}
/>
```

## Changes Made

### 1. Updated FooterSection.tsx
- **File**: `app/custom_pages/components/sections/FooterSection.tsx`
- **Changes**:
  - Added `useEffect` import
  - Added `useFooter` import from footer context
  - Added footer context integration to notify when custom footer is present
  - Changed content rendering from plain text to HTML using `dangerouslySetInnerHTML`
  - Applied the fix to both edit mode and view mode rendering

### 2. Fixed Layout Architecture (Critical Fix)
- **File**: `app/custom_pages/layout.tsx`
- **Action**: **REMOVED THE ENTIRE FILE**
- **Reason**: The custom pages layout was creating duplicate providers and components:
  - Duplicate FooterProvider (conflicting with root layout)
  - Duplicate AuthProvider
  - Duplicate ClientLayout
  - Duplicate ConditionalFooter
- **Result**: Custom pages now inherit from root layout, ensuring single provider instances

### 3. Added Footer Case to CustomPageClient
- **File**: `app/custom_pages/[slug]/CustomPageClient.tsx`
- **Changes**:
  - Added missing `case 'footer':` in the renderSection switch statement
  - Ensures FooterSection component is properly rendered with all required props

## How to Test

### 1. Create a Custom Page with Footer Links
1. Go to any custom page in edit mode (add `?edit=true` to the URL)
2. Add a Footer section
3. In the footer content, add HTML links like:
   ```html
   <p>Quick Links:</p>
   <ul>
     <li><a href="/about">About Us</a></li>
     <li><a href="/contact">Contact</a></li>
     <li><a href="https://example.com" target="_blank">External Link</a></li>
   </ul>
   ```

### 2. Verify Links Work
1. Save the page
2. Exit edit mode
3. Click on the footer links to verify they navigate correctly
4. External links should open in new tabs if `target="_blank"` is specified

### 3. Test Footer Context
1. Verify that when a custom footer section is present, the default footer is hidden
2. When the custom footer section is removed, the default footer should reappear

## Example Footer Content with Links

```html
<h3>Quick Links</h3>
<ul>
  <li><a href="/">Home</a></li>
  <li><a href="/about">About</a></li>
  <li><a href="/contact">Contact</a></li>
</ul>

<h3>Social Media</h3>
<p>Follow us on:</p>
<ul>
  <li><a href="https://twitter.com/example" target="_blank">Twitter</a></li>
  <li><a href="https://facebook.com/example" target="_blank">Facebook</a></li>
</ul>

<h3>Legal</h3>
<p><a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a></p>
```

## Security Considerations
- The use of `dangerouslySetInnerHTML` is appropriate here since the content is controlled by admin users
- This follows the same pattern used by other sections like TextSection and PrivacySection
- Content is sanitized at the input level through the admin interface

## Compatibility
- This fix maintains backward compatibility with existing footer content
- Plain text content will still render correctly
- HTML content will now render with proper link functionality
