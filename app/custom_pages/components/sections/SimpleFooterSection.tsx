import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useFooter } from '@/contexts/footer-context';

interface SimpleFooterColumn {
  title: string;
  content: string;
}

interface SimpleFooterSection {
  id: string;
  type: 'simple-footer';
  columns: SimpleFooterColumn[];
  backgroundColor?: string;
  textColor?: string;
  width?: string;
}

interface SimpleFooterSectionProps {
  section: SimpleFooterSection;
  isEditMode: boolean;
  onSectionChange: (section: SimpleFooterSection) => void;
  speakText: (text: string) => void;
}

export const SimpleFooterSection: React.FC<SimpleFooterSectionProps> = ({
  section,
  isEditMode,
  onSectionChange,
  speakText,
}) => {
  const { setHasCustomFooter } = useFooter();

  // Notify the footer context that a custom footer is present
  useEffect(() => {
    setHasCustomFooter(true);
    return () => {
      setHasCustomFooter(false);
    };
  }, [setHasCustomFooter]);

  const updateColumn = (index: number, field: keyof SimpleFooterColumn, value: string) => {
    const newColumns = [...section.columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    onSectionChange({ ...section, columns: newColumns });
  };

  const addColumn = () => {
    const newColumns = [...section.columns, { title: 'New Column', content: '<p>Add your content here</p>' }];
    onSectionChange({ ...section, columns: newColumns });
  };

  const removeColumn = (index: number) => {
    const newColumns = section.columns.filter((_, i) => i !== index);
    onSectionChange({ ...section, columns: newColumns });
  };

  const updateSectionStyle = (field: 'backgroundColor' | 'textColor' | 'width', value: string) => {
    onSectionChange({ ...section, [field]: value });
  };

  if (isEditMode) {
    return (
      <div
        className="w-full bg-gray-900 text-white"
        style={{
          backgroundColor: section.backgroundColor || '#111827',
          color: section.textColor || '#ffffff',
        }}
      >
        <div className="w-full px-6 py-8 md:px-8 lg:px-12 max-w-7xl mx-auto">
          {/* Edit Mode Controls */}
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Footer Settings</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Width</label>
                <select
                  value={section.width === '100vw' ? '100vw' : '100%'}
                  onChange={(e) => updateSectionStyle('width', e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                >
                  <option value="100%">Container Width</option>
                  <option value="100vw">Full Viewport Width</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Background Color</label>
                <input
                  type="color"
                  value={section.backgroundColor || '#111827'}
                  onChange={(e) => updateSectionStyle('backgroundColor', e.target.value)}
                  className="w-full h-10 rounded border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Text Color</label>
                <input
                  type="color"
                  value={section.textColor || '#ffffff'}
                  onChange={(e) => updateSectionStyle('textColor', e.target.value)}
                  className="w-full h-10 rounded border"
                />
              </div>
            </div>
            <Button onClick={addColumn} className="mb-4">
              Add Column
            </Button>
          </div>

          {/* Columns - matching global footer layout */}
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(section.columns.length, 4)} gap-6`}>
            {section.columns.map((column, index) => (
              <div key={index} className="space-y-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div>
                  <label className="block text-sm font-medium mb-2">Column Title</label>
                  <input
                    type="text"
                    value={column.title}
                    onChange={(e) => updateColumn(index, 'title', e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    placeholder="Column title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content (HTML)</label>
                  <textarea
                    value={column.content}
                    onChange={(e) => updateColumn(index, 'content', e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 h-32"
                    placeholder="Add HTML content with links..."
                  />
                </div>
                <Button
                  onClick={() => removeColumn(index)}
                  variant="destructive"
                  size="sm"
                >
                  Remove Column
                </Button>
              </div>
            ))}
          </div>

          {/* Preview of copyright section */}
          <div className="border-t border-gray-800 mt-6 pt-4 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Fluxedita. All rights reserved. Made with ❤️ in West Yorkshire, UK</p>
          </div>
        </div>
      </div>
    );
  }

  // View Mode - Matching global footer design (width handled by section wrapper)
  return (
    <footer
      className="w-full bg-gray-900 text-white"
      style={{
        backgroundColor: section.backgroundColor || '#111827',
        color: section.textColor || '#ffffff',
        marginBottom: 0,
        paddingBottom: 0,
      }}
    >
      <div className="w-full px-6 py-8 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(section.columns.length, 4)} gap-6`}>
          {section.columns.map((column, index) => (
            <div key={index}>
              {column.title && (
                <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
              )}
              <div
                dangerouslySetInnerHTML={{ __html: column.content }}
                style={{
                  // Ensure links are styled and clickable
                  color: 'inherit',
                }}
              />
            </div>
          ))}
        </div>

        {/* Copyright section matching global footer */}
        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Fluxedita. All rights reserved. Made with ❤️ in West Yorkshire, UK</p>
        </div>
      </div>
    </footer>
  );
};

// Default section creator - matching global footer
export const createSimpleFooterSection = (): SimpleFooterSection => ({
  id: `simple-footer-${Date.now()}`,
  type: 'simple-footer',
  columns: [
    {
      title: 'Fluxedita',
      content: `
        <p class="text-gray-400 text-sm mb-3">Fluxedita's, MultiPage Website Package.</p>
        <div class="flex space-x-2">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
          </a>
          <a href="mailto:jamescroanin@gmail.com"
             class="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </a>
        </div>
      `
    },
    {
      title: 'Quick Links',
      content: `
        <ul class="space-y-2" style="list-style: none; padding: 0; margin: 0;">
          <li><a href="/products" class="text-gray-400 hover:text-white transition-colors">Products</a></li>
          <li><a href="/about" class="text-gray-400 hover:text-white transition-colors">About</a></li>
          <li><a href="/auth/login" class="text-gray-400 hover:text-white transition-colors">Login</a></li>
        </ul>
      `
    },
    {
      title: 'Legal',
      content: `
        <ul class="space-y-2" style="list-style: none; padding: 0; margin: 0;">
          <li><a href="/terms" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
          <li><a href="/privacy" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
          <li><a href="/cookies" class="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
        </ul>
      `
    }
  ],
  backgroundColor: '#111827',
  textColor: '#ffffff',
  width: '100%'
});
