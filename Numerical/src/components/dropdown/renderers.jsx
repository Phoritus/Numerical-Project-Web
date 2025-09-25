import React from 'react';
import { Link } from 'react-router-dom';

// Tailwind classes shared by button/link items
export const baseItemClass =
  'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 dark:hover:bg-gray-800';


export function createNavigatingRenderItem({ navigate, onItemSelect, routeMap = {}, useLink = true } = {}) {
  return function renderItem(args) {
    const { item, level, isOpen, hasChildren, onToggleKey } = args;
    const paddingLeft = Math.max(0, level - 1) * 8 + 12;
    const dest = item.to || routeMap[item.key];

    if (hasChildren) {
      return (
        <button
          type="button"
          className={baseItemClass}
          style={{ paddingLeft }}
          onClick={() => onToggleKey(item.key)}
          aria-expanded={isOpen}
        >
          <span className="flex-1 truncate">{item.label}</span>
          <svg className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.188l3.71-3.957a.75.75 0 111.08 1.04l-4.24 4.52a.75.75 0 01-1.08 0l-4.24-4.52a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      );
    }

    const handleClick = () => {
      if (onItemSelect) onItemSelect(item);

      if (!dest && navigate) return; // nothing to do
      if (navigate && !useLink) navigate(dest);
    };

    if (useLink && dest) {
      return (
        <Link to={dest} className={baseItemClass} style={{ paddingLeft }} onClick={() => onItemSelect && onItemSelect(item)}>
          <span className="flex-1 truncate">{item.label}</span>
        </Link>
      );
    }

    return (
      <button type="button" className={baseItemClass} style={{ paddingLeft }} onClick={handleClick}>
        <span className="flex-1 truncate">{item.label}</span>
      </button>
    );
  };
}
