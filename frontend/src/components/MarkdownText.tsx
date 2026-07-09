import { Fragment, type ReactNode } from 'react';

function renderInline(text: string): ReactNode[] {
  const pattern = /(`[^`]+`|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_)/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${match.index}-${token}`;
    if (token.startsWith('`')) nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    else if (token.startsWith('***')) nodes.push(<strong key={key}><em>{token.slice(3, -3)}</em></strong>);
    else if (token.startsWith('**') || token.startsWith('__')) nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    else nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    last = pattern.lastIndex;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function MarkdownText({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, index) => (
        <Fragment key={index}>
          {index > 0 && <br />}
          {renderInline(line)}
        </Fragment>
      ))}
    </>
  );
}
