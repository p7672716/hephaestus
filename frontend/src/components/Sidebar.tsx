import type { ViewId } from '../types';

const items: Array<{ id: ViewId; label: string; glyph: string }> = [
  { id: 'dashboard', label: 'Dashboard', glyph: '◫' },
  { id: 'chat', label: 'Chat', glyph: '◇' },
  { id: 'coding', label: 'Coding', glyph: '</>' },
  { id: 'notebook', label: 'Notebook', glyph: '▤' },
  { id: 'skill', label: 'Skill', glyph: '⬡' },
  { id: 'tool', label: 'Tool', glyph: '⌁' },
  { id: 'automation', label: 'Automation', glyph: '↻' },
  { id: 'knowledge', label: 'Knowledge', glyph: '≡' },
  { id: 'setting', label: 'Setting', glyph: '⚙' },
];

interface SidebarProps {
  view: ViewId;
  collapsed: boolean;
  onSelect: (view: ViewId) => void;
}

export function Sidebar({ view, collapsed, onSelect }: SidebarProps) {
  return (
    <aside className={collapsed ? 'sidebar is-collapsed' : 'sidebar'} aria-label="Main navigation">
      <nav>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={view === item.id ? 'nav-item is-active' : 'nav-item'}
            aria-current={view === item.id ? 'page' : undefined}
            title={item.label}
            onClick={() => onSelect(item.id)}
          >
            <span className="nav-glyph" aria-hidden="true">{item.glyph}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
