# Adding Editable Section Components Guide

This guide provides a step-by-step process for creating new editable section components that can be added to pages through the PageControls sidebar.

## Overview

The editable section system consists of several interconnected parts:
1. **Section Component** - The view/display component
2. **Edit Component** - The editing interface component  
3. **Type Definitions** - TypeScript interfaces for the section data
4. **Page Integration** - How pages import and render the section
5. **Media Integration** - How media selection works

## Step 1: Create the Section Component

Create a new file in `app/custom_pages/components/sections/` with your section name.

### Example: `MyCustomSection.tsx`

```typescript
import React from "react";
import Image from "next/image";

// Define the props interface
export type MyCustomSectionProps = {
  title: string;
  description: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  theme?: {
    backgroundColor: string;
    textColor: string;
  };
  // Add other props as needed
};

// Create the view component
export const MyCustomSection: React.FC<MyCustomSectionProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  buttonUrl,
  theme = {
    backgroundColor: "bg-blue-500",
    textColor: "text-white"
  }
}) => {
  return (
    <section className={`${theme.backgroundColor} ${theme.textColor} py-12`}>
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg mb-6">{description}</p>
          
          {imageUrl && (
            <div className="mb-6">
              <Image
                src={imageUrl}
                alt={title}
                width={400}
                height={300}
                className="mx-auto rounded-lg"
              />
            </div>
          )}
          
          {buttonText && buttonUrl && (
            <a
              href={buttonUrl}
              className="inline-block bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
```

## Step 2: Create the Edit Component

Create the editing interface component in the same directory.

### Example: `EditMyCustomSection.tsx`

```typescript
import React from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import { MyCustomSectionProps } from "./MyCustomSection";

interface EditMyCustomSectionProps {
  data: MyCustomSectionProps;
  onChange: (updated: Partial<MyCustomSectionProps>) => void;
  onMediaSelect?: () => void;
}

export const EditMyCustomSection: React.FC<EditMyCustomSectionProps> = ({
  data,
  onChange,
  onMediaSelect,
}) => {
  const updateField = <K extends keyof MyCustomSectionProps>(
    key: K, 
    value: MyCustomSectionProps[K]
  ) => {
    onChange({ [key]: value });
  };

  const updateTheme = (key: keyof MyCustomSectionProps["theme"], value: string) => {
    onChange({
      theme: {
        ...data.theme,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold text-lg mb-4">Edit My Custom Section</h3>
      
      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          className="w-full p-2 border rounded"
          value={data.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Enter title"
        />
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          className="w-full p-2 border rounded"
          rows={3}
          value={data.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Enter description"
        />
      </div>

      {/* Image Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Image</label>
        <div className="flex items-center gap-3">
          {data.imageUrl && (
            <div className="relative w-16 h-16 rounded overflow-hidden border-2 border-gray-300">
              <img
                src={data.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Set global variables for media selection
              (window as any).__mediaDialogCardId = 'section-image';
              (window as any).__mediaDialogIsThumbnail = false;
              onMediaSelect?.();
            }}
            className="flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            {data.imageUrl ? "Change Image" : "Add Image"}
          </Button>
        </div>
      </div>

      {/* Button Settings */}
      <div>
        <label className="block text-sm font-medium mb-2">Button Text</label>
        <input
          className="w-full p-2 border rounded"
          value={data.buttonText || ""}
          onChange={(e) => updateField("buttonText", e.target.value)}
          placeholder="Enter button text"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Button URL</label>
        <input
          className="w-full p-2 border rounded"
          value={data.buttonUrl || ""}
          onChange={(e) => updateField("buttonUrl", e.target.value)}
          placeholder="Enter button URL"
        />
      </div>

      {/* Theme Customization */}
      <div className="pt-4">
        <label className="block text-sm font-medium mb-2">Background Color</label>
        <input
          className="w-full p-2 border rounded"
          value={data.theme?.backgroundColor || ""}
          onChange={(e) => updateTheme("backgroundColor", e.target.value)}
          placeholder="e.g., bg-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Text Color</label>
        <input
          className="w-full p-2 border rounded"
          value={data.theme?.textColor || ""}
          onChange={(e) => updateTheme("textColor", e.target.value)}
          placeholder="e.g., text-white"
        />
      </div>
    </div>
  );
};
```

## Step 3: Add Type Definitions

Add your section type to `app/custom_pages/types/sections.ts`.

### 3.1 Add to SectionType union

```typescript
export type SectionType = 
  | 'hero'
  | 'hero-responsive'
  | 'my-custom-section'  // Add your new type here
  // ... other existing types
```

### 3.2 Create the interface

```typescript
export interface MyCustomSectionType extends BaseSection {
  type: 'my-custom-section';
  title: string;
  description: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  theme?: {
    backgroundColor: string;
    textColor: string;
  };
}
```

### 3.3 Add to Section union type

```typescript
export type Section = 
  | HeroSection
  | HeroSectionResponsiveType
  | MyCustomSectionType  // Add your new interface here
  // ... other existing interfaces
```

## Step 4: Update the Barrel Export

Add your components to `app/custom_pages/components/sections/index.ts`:

```typescript
export { MyCustomSection } from './MyCustomSection';
export { EditMyCustomSection } from './EditMyCustomSection';
```

## Step 5: Update Page Integration

### 5.1 Update HomePageClient.tsx (or your target page)

### 5.2 Update CustomPageClient.tsx (for custom pages)

If you want your section to be available on **all custom pages** (pages created through the custom page system), you need to integrate it into `app/custom_pages/[slug]/CustomPageClient.tsx`:

#### Add to imports:
```typescript
import { YourSection, EditYourSection } from '../components/sections/YourSection';
```

#### Add to createDefaultSection function:
```typescript
case 'your-section-type':
  return {
    ...baseSection,
    type: 'your-section-type',
    // Add your default properties here
    title: 'Your Section Title',
    description: 'Your section description',
    // ... other properties
  };
```

#### Add to renderSection switch statement:
```typescript
case 'your-section-type':
  sectionComponent = (
    <div className="relative group w-full">
      {isEditMode ? (
        <EditYourSection
          data={{
            // Map section properties to your component props
            title: (section as any).title || 'Default Title',
            description: (section as any).description || 'Default Description',
            // ... other properties
          }}
          onChange={(updated) => {
            handleSectionChange({ ...section, ...updated });
          }}
          onMediaSelect={(mediaType = 'default-media') => {
            setMediaDialogIdx(idx);
            (window as any).__mediaDialogCardId = mediaType;
          }}
        />
      ) : (
        <YourSection
          title={(section as any).title || 'Default Title'}
          description={(section as any).description || 'Default Description'}
          // ... other properties
        />
      )}
      {isEditMode && (
        <div className="absolute top-2 right-2 z-10">
          {renderSectionControls(section.id)}
        </div>
      )}
    </div>
  );
  break;
```

#### Add to MediaLibrary onSelectAction handler:
```typescript
} else if (section.type === 'your-section-type') {
  const cardId = (window as any).__mediaDialogCardId;
  if (cardId === 'your-media-id') {
    newSections[mediaDialogIdx] = {
      ...section,
      yourMediaField: url,
    };
  }
}
```

#### Add to HomeSectionType:
```typescript
type HomeSectionType = {
  type: 
    | 'hero' 
    | 'cta' 
    | 'my-custom-section'  // Add your new type
    // ... other types
}
```

#### Add to DEFAULT_SECTIONS:
```typescript
const DEFAULT_SECTIONS: HomeSectionType[] = [
  { type: 'hero' },
  { type: 'my-custom-section' },  // Add your new type
  // ... other sections
];
```

#### Add to handleAddSection function:
```typescript
const handleAddSection = (type: string, afterIdx?: number) => {
  const id = `section-${Date.now()}`;
  let newSection: Section;

  switch (type) {
    // ... existing cases
    case 'my-custom-section': {
      newSection = {
        id,
        type: 'my-custom-section',
        title: 'My Custom Section',
        description: 'This is a custom section description.',
        imageUrl: '',
        buttonText: 'Learn More',
        buttonUrl: '#',
        theme: {
          backgroundColor: 'bg-blue-500',
          textColor: 'text-white'
        },
        visible: true,
        enableSpeech: false,
      };
      break;
    }
    // ... other cases
  }
  // ... rest of function
};
```

#### Add to the rendering switch statement:
```typescript
switch (section.type as any) {
  // ... existing cases
  case 'my-custom-section': {
    const myCustomSection = section as any;
    renderedSection = (
      <div className="relative group">
        {isEditMode ? (
          <EditMyCustomSection
            data={myCustomSection}
            onChange={updated => {
              const newSections = [...sections];
              newSections[idx] = { ...myCustomSection, ...updated };
              setSections(newSections);
              setIsDirty(true);
            }}
            onMediaSelect={() => {
              setMediaDialogIdx(idx);
              // Only set cardId if it hasn't been set by the component
              if (!(window as any).__mediaDialogCardId) {
                (window as any).__mediaDialogCardId = 'section-image';
              }
              (window as any).__mediaDialogIsThumbnail = false;
            }}
          />
        ) : (
          <MyCustomSection {...myCustomSection} />
        )}
      </div>
    );
    break;
  }
  // ... other cases
}
```

#### Add to MediaLibrary onSelectAction handler:
```typescript
onSelectAction={(url, type) => {
  setSections(prev => {
    const newSections = [...prev];
    const section = newSections[mediaDialogIdx];
    
    if (section) {
      // ... existing section types
      if (section.type === 'my-custom-section') {
        const cardId = (window as any).__mediaDialogCardId;
        if (cardId === 'section-image') {
          newSections[mediaDialogIdx] = {
            ...section,
            imageUrl: url,
          };
        }
      }
    }
    return newSections;
  });
  // ... rest of handler
}}
```

#### ⚠️ Important: Dialog Wrapper Required

**Problem**: MediaLibrary dialog doesn't open or is not visible.

**Cause**: MediaLibrary component needs to be wrapped in a proper dialog with backdrop and styling.

**Solution**: Wrap the MediaLibrary in a dialog container:

```typescript
{/* MediaLibrary dialog for Media/Text sections */}
{mediaDialogIdx !== null && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Select Media</h2>
        <button 
          onClick={() => {
            setMediaDialogIdx(null);
            (window as any).__mediaDialogCardId = null;
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <MediaLibrary
          isDialog
          type="all"
          onCloseAction={() => {
            setMediaDialogIdx(null);
            (window as any).__mediaDialogCardId = null;
          }}
          onSelectAction={(url, type) => {
            // ... your media selection logic
          }}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setMediaDialogIdx(null);
            (window as any).__mediaDialogCardId = null;
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
)}
```

## Step 6: Test Your Integration

1. **Start your development server**
2. **Navigate to your page** (e.g., `/`)
3. **Enter edit mode** (if you're an admin)
4. **Open PageControls sidebar**
5. **Click "Add Section"**
6. **Select your new section type**
7. **Test editing functionality**
8. **Test media selection** (if applicable)
9. **Test save functionality**

## Common Patterns and Best Practices

### Media Selection Pattern

For sections with media, follow this pattern:

1. **In Edit Component**: Set global variables before calling `onMediaSelect`
```typescript
onClick={() => {
  (window as any).__mediaDialogCardId = 'your-unique-id';
  (window as any).__mediaDialogIsThumbnail = false;
  onMediaSelect?.();
}}
```

2. **In Page Component**: Handle media selection in `onSelectAction`
```typescript
if (section.type === 'your-section-type') {
  const cardId = (window as any).__mediaDialogCardId;
  if (cardId === 'your-unique-id') {
    newSections[mediaDialogIdx] = {
      ...section,
      yourMediaField: url,
    };
  }
}
```

### Theme/Configuration Pattern

For sections with theme options:

1. **Define theme interface** in your props
2. **Provide default theme** in component
3. **Use updateTheme helper** in edit component
4. **Apply theme classes** in view component

### Validation and Error Handling

1. **Add prop validation** using TypeScript
2. **Provide sensible defaults** for all optional props
3. **Handle missing data gracefully** in view component
4. **Add loading states** for media components

## Troubleshooting Common Issues

### Issue: Section Shows as Default Text Instead of Custom Section

**Problem**: When adding a new section to a page, you get a default text section instead of your custom section.

**Cause**: Missing the `case 'your-section-type':` in the `handleAddSection` function.

**Solution**: Always ensure you add the case to both:
1. The `handleAddSection` function (creates new sections)
2. The rendering switch statement (displays existing sections)

**Example**: The `/about` page was missing the `case 'hero-promo-split':` in `handleAddSection`, causing it to fall through to the `default` case and create a text section instead.

**Checklist for each page**:
- [ ] Import statement added
- [ ] `handleAddSection` case added
- [ ] Rendering switch case added  
- [ ] Media dialog handling added (if needed)

### Issue: Media Selection Not Working

**Problem**: Clicking media selection buttons doesn't open the media dialog or doesn't update the correct field.

**Cause**: Incorrect media dialog handling or missing `cardId` logic.

**Solution**: 
1. Ensure `onMediaSelect` prop is properly configured
2. Check that `__mediaDialogCardId` is set correctly
3. Verify media dialog handling in `onSelectAction`

### Issue: TypeScript Errors

**Problem**: TypeScript compilation errors related to section types.

**Cause**: Missing type definitions or incorrect union types.

**Solution**:
1. Add section interface to `sections.ts`
2. Update `Section` union type
3. Ensure proper type casting in page components

## Troubleshooting

### Section Not Appearing in Add Section Menu
- Check that you added the type to `HomeSectionType`
- Verify the type is included in `DEFAULT_SECTIONS`
- Ensure the `handleAddSection` function has a case for your type

### Edit Mode Not Working
- Verify your Edit component is properly exported
- Check that the rendering switch statement includes your case
- Ensure the `onChange` callback is properly wired

### Media Selection Not Working
- Verify the `cardId` is unique and consistent
- Check that the `onSelectAction` handler includes your section type
- Ensure the media field name matches between edit and view components

### TypeScript Errors
- Check that your interface extends `BaseSection`
- Verify your type is added to the `Section` union
- Ensure all required props are defined in your interface

## Example Complete Integration

Here's a minimal example of a complete section integration:

### 1. Section Component (`SimpleTextSection.tsx`)
```typescript
import React from "react";

export type SimpleTextSectionProps = {
  title: string;
  content: string;
  backgroundColor?: string;
};

export const SimpleTextSection: React.FC<SimpleTextSectionProps> = ({
  title,
  content,
  backgroundColor = "bg-gray-100"
}) => {
  return (
    <section className={`${backgroundColor} py-8`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700">{content}</p>
      </div>
    </section>
  );
};
```

### 2. Edit Component (`EditSimpleTextSection.tsx`)
```typescript
import React from "react";
import { SimpleTextSectionProps } from "./SimpleTextSection";

interface EditSimpleTextSectionProps {
  data: SimpleTextSectionProps;
  onChange: (updated: Partial<SimpleTextSectionProps>) => void;
}

export const EditSimpleTextSection: React.FC<EditSimpleTextSectionProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold">Edit Simple Text Section</h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          className="w-full p-2 border rounded"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={data.content}
          onChange={(e) => onChange({ content: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Background Color</label>
        <input
          className="w-full p-2 border rounded"
          value={data.backgroundColor || ""}
          onChange={(e) => onChange({ backgroundColor: e.target.value })}
          placeholder="e.g., bg-blue-100"
        />
      </div>
    </div>
  );
};
```

### 3. Type Definition
```typescript
// In sections.ts
export interface SimpleTextSectionType extends BaseSection {
  type: 'simple-text';
  title: string;
  content: string;
  backgroundColor?: string;
}

// Add to Section union
export type Section = 
  | HeroSection
  | SimpleTextSectionType  // Add this
  // ... other types
```

### 4. Page Integration
```typescript
// In HomePageClient.tsx
type HomeSectionType = {
  type: 
    | 'hero' 
    | 'simple-text'  // Add this
    // ... other types
}

// Add to handleAddSection
case 'simple-text': {
  newSection = {
    id,
    type: 'simple-text',
    title: 'Simple Text Section',
    content: 'This is a simple text section.',
    backgroundColor: 'bg-gray-100',
    visible: true,
    enableSpeech: false,
  };
  break;
}

// Add to rendering switch
case 'simple-text': {
  const simpleTextSection = section as any;
  renderedSection = (
    <div className="relative group">
      {isEditMode ? (
        <EditSimpleTextSection
          data={simpleTextSection}
          onChange={updated => {
            const newSections = [...sections];
            newSections[idx] = { ...simpleTextSection, ...updated };
            setSections(newSections);
            setIsDirty(true);
          }}
        />
      ) : (
        <SimpleTextSection {...simpleTextSection} />
      )}
    </div>
  );
  break;
}
```

This guide should help you successfully integrate new editable section components into your application! 