export interface Person {
  id: string;
  name: string;
}

export type KeyMode = 'index' | 'id';

export const INITIAL_ROSTER: Person[] = [
  { id: 'p1', name: 'Aisha' },
  { id: 'p2', name: 'Priya' },
  { id: 'p3', name: 'Rahul' },
  { id: 'p4', name: 'Sam' },
];

export function removeAt(list: Person[], index: number): Person[] {
  return list.filter((_, i) => i !== index);
}

export function moveFirstToEnd(list: Person[]): Person[] {
  if (list.length < 2) return [...list];
  return [...list.slice(1), list[0]];
}

export function jsxSnippet(mode: KeyMode): string {
  if (mode === 'index') {
    return [
      '{roster.map((p, i) => (',
      '  <Row key={i} person={p} />',
      '))}',
      '',
      '// key = POSITION in the list',
    ].join('\n');
  }
  return [
    '{roster.map((p) => (',
    '  <Row key={p.id} person={p} />',
    '))}',
    '',
    '// key = stable IDENTITY',
  ].join('\n');
}

export function explain(mode: KeyMode, action: 'remove' | 'move' | null): string {
  if (!action) {
    return 'Tick a checkbox, then mutate the list — watch where the tick ends up under each key strategy.';
  }
  if (mode === 'index') {
    return action === 'remove'
      ? 'Rows below the removed one shifted UP into old keys. React matched by key, reused those component instances — the checkbox state stayed at its old position, but a different person is standing there now.'
      : 'The people moved but the keys did not: position 0 is still key=0. React kept every instance in place and only swapped the names — any ticked box stayed at its position instead of following its person.';
  }
  return action === 'remove'
    ? 'Keys are identities here: the removed row’s component instance (and its state) was destroyed with it, and everyone else’s state traveled with their own row.'
    : 'The keys moved WITH the people, so React moved the component instances too. State follows the person — exactly what you want.';
}
