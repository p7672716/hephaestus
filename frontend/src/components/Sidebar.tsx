import type { ViewId } from '../types';
import { Icon, type IconName } from './Icon';

const items: Array<{ id: ViewId; label: string; icon: IconName }> = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'chat', label: 'Chat', icon: 'chat' },
  { id: 'coding', label: 'Coding', icon: 'coding' },
  { id: 'notebook', label: 'Notebook', icon: 'notebook' },
  { id: 'skill', label: 'Skill', icon: 'skill' },
  { id: 'tool', label: 'Tool', icon: 'tool' },
  { id: 'automation', label: 'Automation', icon: 'automation' },
  { id: 'knowledge', label: 'Knowledge', icon: 'knowledge' },
  { id: 'setting', label: 'Setting', icon: 'setting' },
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
            <span className="nav-icon"><Icon name={item.icon} /></span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
