export type IconName =
  | 'automation'
  | 'chat'
  | 'coding'
  | 'dashboard'
  | 'edit'
  | 'folder'
  | 'grip'
  | 'knowledge'
  | 'menu'
  | 'moon'
  | 'next'
  | 'notebook'
  | 'play'
  | 'plus'
  | 'prev'
  | 'reasoning'
  | 'requeue'
  | 'send'
  | 'setting'
  | 'skill'
  | 'stop'
  | 'sun'
  | 'tool'
  | 'trash';

const paths: Record<IconName, string[]> = {
  automation: ['M7 7h6a4 4 0 0 1 0 8H9', 'M9 11l-4 4 4 4', 'M15 13l4-4-4-4'],
  chat: ['M5 6.5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v7.2c0 1.1-.9 2-2 2h-5.8L6.5 19v-3.3H7c-1.1 0-2-.9-2-2z', 'M8.5 9.2h7', 'M8.5 12.2h4.5'],
  coding: ['M9 8l-4 4 4 4', 'M15 8l4 4-4 4', 'M13.5 5.5l-3 13'],
  dashboard: ['M4.5 5.5h6v6h-6z', 'M13.5 5.5h6v6h-6z', 'M4.5 14h6v4.5h-6z', 'M13.5 14h6v4.5h-6z'],
  edit: ['M4.5 19.5l4.4-1.1 9.8-9.8-3.3-3.3-9.8 9.8z', 'M13.8 6.9l3.3 3.3'],
  folder: ['M3.5 7.5h6l2 2h9v8h-17z', 'M3.5 7.5v10'],
  grip: ['M8 7h8', 'M8 12h8', 'M8 17h8'],
  knowledge: ['M6.5 6.5h11', 'M6.5 12h11', 'M6.5 17.5h11', 'M4 6.5h.1', 'M4 12h.1', 'M4 17.5h.1'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  moon: ['M20.4 15.3A8.7 8.7 0 0 1 8.7 3.6 8.7 8.7 0 1 0 20.4 15.3z'],
  next: ['M9 5l7 7-7 7'],
  notebook: ['M7 4.5h9.5c.8 0 1.5.7 1.5 1.5v12.5c0 .6-.4 1-1 1H7c-1.1 0-2-.9-2-2v-11c0-1.1.9-2 2-2z', 'M8.5 4.5v15', 'M11 8h4', 'M11 11h3'],
  play: ['M8 5.5l10 6.5-10 6.5z'],
  plus: ['M12 5v14', 'M5 12h14'],
  prev: ['M15 5l-7 7 7 7'],
  reasoning: ['M9 18h6', 'M10 21h4', 'M8.5 14.5a5 5 0 1 1 7 0c-.8.7-1.2 1.4-1.4 2h-4.2c-.2-.6-.6-1.3-1.4-2z'],
  requeue: ['M17.5 7.5A6 6 0 1 0 18 16', 'M17.5 7.5V4', 'M17.5 7.5H14'],
  send: ['M5 12h13', 'M13 6l6 6-6 6'],
  setting: ['M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z', 'M18.4 13.4c.1-.5.1-.9 0-1.4l1.7-1.3-1.7-3-2 .8c-.4-.3-.8-.6-1.2-.7L14.9 5h-5.8l-.3 2.8c-.4.2-.8.4-1.2.7l-2-.8-1.7 3L5.6 12c-.1.5-.1.9 0 1.4l-1.7 1.3 1.7 3 2-.8c.4.3.8.6 1.2.7l.3 2.4h5.8l.3-2.4c.4-.2.8-.4 1.2-.7l2 .8 1.7-3z'],
  skill: ['M12 4.5l6.5 3.7v7.6L12 19.5l-6.5-3.7V8.2z', 'M12 12l6.2-3.6', 'M12 12L5.8 8.4', 'M12 12v7'],
  stop: ['M7 7h10v10H7z'],
  sun: ['M12 4v1.5', 'M12 18.5V20', 'M4 12h1.5', 'M18.5 12H20', 'M6.3 6.3l1.1 1.1', 'M16.6 16.6l1.1 1.1', 'M17.7 6.3l-1.1 1.1', 'M7.4 16.6l-1.1 1.1', 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z'],
  tool: ['M14.5 5.5l4 4-9 9H5.5v-4z', 'M13 7l4 4', 'M5 5.5h5', 'M5 9h3'],
  trash: ['M5.5 7h13', 'M9 7V5.5h6V7', 'M8 9l.6 10h6.8L16 9', 'M10.5 11.5v5', 'M13.5 11.5v5'],
};

export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths[name].map((path) => <path key={path} d={path} />)}
    </svg>
  );
}
