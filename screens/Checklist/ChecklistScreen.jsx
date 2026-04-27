'use client';

import { useMemo } from 'react';
import { CHECKLIST_ITEMS } from '../../data/checklist';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Progress } from '../../components/Progress/Progress';
import { Button } from '../../components/Button/Button';
import { usePersistedState } from '../../hooks/usePersistedState';

const STORAGE_KEY = 'ual:checklist:v1';

export function ChecklistScreen() {
  const [checked, setChecked] = usePersistedState(STORAGE_KEY, /** @type {Record<string, boolean>} */ ({}));

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
          A short list to help you hit the ground running. Your progress is saved
          on this device — no account needed.
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
          <ul className="flow" data-flow="2xs" role="list">
            {items.map((item) => (
              <li key={item.id}>
                <Checkbox
                  checked={!!checked[item.id]}
                  onChange={() => toggle(item.id)}
                  label={item.title}
                  hint={item.hint}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
