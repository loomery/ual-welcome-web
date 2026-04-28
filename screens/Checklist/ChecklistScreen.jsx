'use client';

import { useMemo } from 'react';
import { CHECKLIST_ITEMS } from '../../data/checklist';
import { ChecklistItem } from '../../components/ChecklistItem/ChecklistItem';
import { Progress } from '../../components/Progress/Progress';
import { Button } from '../../components/Button/Button';
import { usePersistedState } from '../../hooks/usePersistedState';

const STORAGE_KEY = 'ual:checklist:v1';

/**
 * Build a quick lookup so each row can resolve its dependsOn parent's
 * title without scanning the array. Tiny list so a Map is overkill but
 * it keeps the render readable.
 */
const ITEMS_BY_ID = new Map(CHECKLIST_ITEMS.map((i) => [i.id, i]));

export function ChecklistScreen() {
  const [checked, setChecked] = usePersistedState(
    STORAGE_KEY,
    /** @type {Record<string, boolean>} */ ({}),
  );

  const grouped = useMemo(() => {
    /** @type {Map<string, import('../../data/checklist').ChecklistItem[]>} */
    const map = new Map();
    for (const item of CHECKLIST_ITEMS) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return Array.from(map.entries());
  }, []);

  const total = CHECKLIST_ITEMS.length;
  const done = CHECKLIST_ITEMS.filter((i) => checked[i.id]).length;
  const complete = done === total && total > 0;

  /** @param {string} id */
  const toggle = (id) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const resetAll = () => setChecked({});

  return (
    <article className="prose has-lead flow" data-flow="l">
      <div className="flow" data-flow="s">
        <h1>Induction checklist</h1>
        <p className="standfirst">
          The essentials for your first week at UAL. Tick things off as you
          go — your progress is saved on this device, no account needed.
        </p>
      </div>

      {complete && (
        <div className="completion-banner flow" data-flow="2xs" role="status" aria-live="polite">
          <span className="tag" data-tag-type="standard">All done</span>
          <p className="completion-banner__title">Welcome to UAL.</p>
          <p className="completion-banner__body">
            You’ve ticked everything off. Next stop — your course induction.
            See you there.
          </p>
        </div>
      )}

      <section
        className="box flow"
        data-padding="m"
        data-flow="s"
        aria-labelledby="progress-heading"
      >
        <div className="cluster" data-justify="space-between">
          <h2 id="progress-heading" style={{ fontSize: 'var(--step-1)' }}>
            {done} of {total} complete
          </h2>
          <Button ghost onClick={resetAll} disabled={done === 0}>
            Reset
          </Button>
        </div>
        <Progress value={done} max={total} label="Checklist progress" />
      </section>

      {grouped.map(([category, items]) => (
        <section key={category} aria-labelledby={`cat-${category}`} className="flow" data-flow="s">
          <h2 id={`cat-${category}`}>{category}</h2>
          <ul className="checklist-list flow" data-flow="s" role="list">
            {items.map((item) => {
              const parent = item.dependsOn ? ITEMS_BY_ID.get(item.dependsOn) : null;
              const blocked = !!(parent && !checked[parent.id]);
              return (
                <li key={item.id}>
                  <ChecklistItem
                    item={item}
                    checked={!!checked[item.id]}
                    onToggle={() => toggle(item.id)}
                    blocked={blocked}
                    dependsOnLabel={parent?.title}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </article>
  );
}
