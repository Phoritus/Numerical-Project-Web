import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNavigatingRenderItem } from '../dropdown/renderers';
import DropdownBase from '../dropdown/DropdownBase';

// Utility: build a level map for keys so we can keep 1 open per level
const buildLevelMap = (items, level = 1, map = {}) => {
  items.forEach((it) => {
    if (it.key) map[it.key] = level;
    if (it.children) buildLevelMap(it.children, level + 1, map);
  });
  return map;
};

// Default demo items (can be overridden by extending or passing props)
const defaultItems = [
  {
    key: 'root',
    label: 'Root of Equation',
    children: [
      { key: 'graphical', label: 'Graphical Method' },
      { key: 'bisection', label: 'Bisection Method' },
      { key: 'false_position', label: 'False Position Method' },
      { key: 'one_point', label: 'One-Point Iteration Method' },
      { key: 'newton_raphson', label: 'Newton Raphson Method' },
      { key: 'secant', label: 'Secant Method' },
    ],
  },
];

export default function Dropdown({ items = defaultItems, className = '', renderItem, onItemSelect, routeMap = {} }) {
  const navigate = useNavigate();
  const levelMap = useMemo(() => buildLevelMap(items), [items]);
  const [openKeys, setOpenKeys] = useState([]);

  const onToggle = (key) => {
    setOpenKeys((prev) => {
      const level = levelMap[key];
      const withoutSameLevel = prev.filter((k) => levelMap[k] !== level);
      return prev.includes(key) ? withoutSameLevel : [...withoutSameLevel, key];
    });
  };

  const mergedClassName = `w-80 sm:w-96 ${className}`; // default wider width; user overrides by passing other w-*/min-w classes

  // Provide a default route mapping for built-in demo items; merge with user-provided routeMap
  const defaultRouteMap = { 
    graphical: '/root-of-equation/graphical',
    bisection: '/root-of-equation/bisection',
    false_position: '/root-of-equation/false-position',
    one_point: '/root-of-equation/one-point',
    newton_raphson: '/root-of-equation/newton-raphson',
    secant: '/root-of-equation/secant',    
  };
  const mergedRouteMap = useMemo(() => ({ ...defaultRouteMap, ...routeMap }), [routeMap]);

  // Reusable renderer that navigates on leaf click; also supports per-item 'to'
  const enhancedRenderItem = useMemo(
    () => createNavigatingRenderItem({ navigate, onItemSelect, routeMap: mergedRouteMap, useLink: true }),
    [navigate, onItemSelect, mergedRouteMap]
  );

  return (
    <DropdownBase
      items={items}
      openKeys={openKeys}
      onToggle={onToggle}
      className={mergedClassName}
      renderItem={renderItem ? renderItem : enhancedRenderItem}
    />
  );
}