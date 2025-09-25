import React from 'react';

/**
 * DropdownBase: a small, headless, Tailwind-ready dropdown primitive.
 * Extend by composition: pass items and renderers to customize.
 */
export default function DropdownBase({
  items = [],
  openKeys = [],
  onToggle = () => {},
  className = '',
  renderItem,
}) {
  const defaultRenderItem = ({ item, level, isOpen, hasChildren, onToggleKey }) => (
    <button
      type="button"
      className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 dark:hover:bg-gray-800"
      onClick={() => hasChildren && onToggleKey(item.key)}
      aria-expanded={isOpen}
    >
      <span className="flex-1 truncate" style={{ paddingLeft: Math.max(0, level - 1) * 8 }}>
        {item.label}
      </span>
      {hasChildren && (
        <svg className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.188l3.71-3.957a.75.75 0 111.08 1.04l-4.24 4.52a.75.75 0 01-1.08 0l-4.24-4.52a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );

  const renderNode = (item, level = 1) => {
    const isOpen = openKeys.includes(item.key);
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    return (
      <li key={item.key} className="w-full">
        {(renderItem || defaultRenderItem)({
          item,
          level,
          isOpen,
          hasChildren,
          onToggleKey: onToggle,
        })}
        {hasChildren && (
          <ul className={`${isOpen ? 'block' : 'hidden'} ml-2 border-l border-gray-200 pl-2 dark:border-gray-700`}>
            {item.children.map((child) => renderNode(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className={`min-w-[16rem] rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900 ${className}`} aria-label="Dropdown Menu">
      <ul className="space-y-1">
        {items.map((item) => renderNode(item, 1))}
      </ul>
    </nav>
  );
}
