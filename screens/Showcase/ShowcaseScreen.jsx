'use client';

import { useState } from 'react';
import {
  FigmaButton,
  FigmaOptionRow,
  FigmaChecklistItem,
  FigmaBottomTabNav,
  FigmaAppHeader,
  FigmaBackBar,
  FigmaTitleBlock,
  FigmaQuickActionTile,
  FigmaDateBadge,
  FigmaEventCard,
  FigmaGetSetupCard,
  FigmaProgressBar,
  FigmaSearchBar,
} from '../../components/figma';

/**
 * Component showcase — gallery of the standalone Figma components in
 * components/figma/. Each component is rendered with real props (no
 * synthetic `state="hover"` etc.) — visual states like hover, focus,
 * pressed are exercised by the user interacting with the component.
 *
 * Where a component has a true two-way state (selected, checked,
 * active tab), the showcase renders a controlled instance with
 * useState so the component is genuinely usable in this page.
 *
 * Layout helpers (Section, VariantGrid, VariantLabel, FidelityBadge)
 * are local because they're showcase chrome — not part of the
 * exported library.
 */

// ============================================================================
// LAYOUT HELPERS — local to the showcase
// ============================================================================

function FidelityBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-black px-2 py-0.5 text-[11px] font-medium tracking-[0.5px] text-white uppercase">
      Standalone component
    </span>
  );
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {import('react').ReactNode} props.children
 */
function Section({ title, description, children }) {
  return (
    <section className="border-t border-[#e5e5e5] pt-8">
      <div className="mb-4">
        <div className="mb-1.5 flex flex-wrap items-center gap-3">
          <h2 className="text-[24px] leading-[1.2] font-bold text-black">{title}</h2>
          <FidelityBadge />
        </div>
        {description && (
          <p className="max-w-160 text-sm/normal text-[#525252]">{description}</p>
        )}
      </div>
      <div className="overflow-x-auto rounded-lg border border-[#e5e5e5] bg-[#fafafa] p-6 sm:p-8">
        {children}
      </div>
    </section>
  );
}

/**
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
function VariantLabel({ children }) {
  return (
    <span className="mt-2 block text-[11px] font-medium tracking-[0.5px] text-[#858585] uppercase">
      {children}
    </span>
  );
}

/**
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
function VariantGrid({ children }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">{children}</div>
  );
}

/**
 * Hint shown alongside interactive variants so a reviewer knows the
 * component is alive — keyboard tab to see focus, hover with a mouse,
 * etc.
 */
function InteractiveHint() {
  return (
    <p className="mb-4 text-[12px] leading-[1.4] text-[#858585] italic">
      Hover, click, or tab into the components below to see hover / pressed / focus states.
    </p>
  );
}

// ============================================================================
// MAIN SCREEN
// ============================================================================

export function ShowcaseScreen() {
  // Controlled state for the option group + checklist + tabs + setup demo.
  const [selectedOption, setSelectedOption] = useState('option-2');
  const [checked, setChecked] = useState({
    'item-1': true,
    'item-2': false,
    'item-3': false,
  });
  const [activeTab, setActiveTab] = useState('Hub');

  return (
    <article className="flex flex-col gap-10 font-main">
      <header className="flex flex-col gap-2">
        <p className="text-[13px] font-medium tracking-[1.2px] text-[#ff5000] uppercase">
          Component handoff exploration
        </p>
        <h1 className="text-[32px] leading-[1.1] font-bold text-black">Component showcase</h1>
        <p className="max-w-160 text-[17px] leading-normal text-[#525252]">
          A live gallery of the standalone Figma components in <code className="rounded bg-[#f2f2f2] px-1 py-px text-[14px] text-black">components/figma/</code>.
          Each is a real, interactive React component — hover and focus
          states come from the live DOM, not from synthetic <code className="rounded bg-[#f2f2f2] px-1 py-px text-[14px] text-black">state</code> props.
          Hex colours and pixel sizes match Figma 1:1.
        </p>
      </header>

      {/* 1. Button — Primary + Secondary, with disabled variants. Hover,
          pressed, focused are all DOM-driven. */}
      <Section
        title="Button"
        description="Primary (filled inverse) / Secondary (outline). Disabled is a real prop. Hover with mouse, click for pressed, tab for focus."
      >
        <InteractiveHint />
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="mb-4 text-[13px] font-medium tracking-[0.5px] text-[#525252] uppercase">Primary</h3>
            <div className="flex flex-wrap gap-x-10 gap-y-6">
              <div className="flex flex-col">
                <FigmaButton variant="primary">Button</FigmaButton>
                <VariantLabel>Default</VariantLabel>
              </div>
              <div className="flex flex-col">
                <FigmaButton variant="primary" disabled>
                  Button
                </FigmaButton>
                <VariantLabel>Disabled</VariantLabel>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-[13px] font-medium tracking-[0.5px] text-[#525252] uppercase">Secondary</h3>
            <div className="flex flex-wrap gap-x-10 gap-y-6">
              <div className="flex flex-col">
                <FigmaButton variant="secondary">Button</FigmaButton>
                <VariantLabel>Default</VariantLabel>
              </div>
              <div className="flex flex-col">
                <FigmaButton variant="secondary" disabled>
                  Button
                </FigmaButton>
                <VariantLabel>Disabled</VariantLabel>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 2. Option Row — radio-group behaviour. Selected state shown via
          aria-pressed + Tailwind's aria-pressed: variant. */}
      <Section
        title="Option Row"
        description="Survey single-select list item. 56px height meets WCAG 2.5.8. Click to select; hover/focus/pressed are live."
      >
        <InteractiveHint />
        <VariantGrid>
          {[
            { value: 'option-1', label: 'Option label A' },
            { value: 'option-2', label: 'Option label B' },
            { value: 'option-3', label: 'Option label C' },
          ].map((o) => (
            <div key={o.value}>
              <FigmaOptionRow
                selected={selectedOption === o.value}
                onClick={() => setSelectedOption(o.value)}
              >
                {o.label}
              </FigmaOptionRow>
              <VariantLabel>
                {selectedOption === o.value ? 'Selected' : 'Default'}
              </VariantLabel>
            </div>
          ))}
          <div>
            <FigmaOptionRow disabled>Option label (disabled)</FigmaOptionRow>
            <VariantLabel>Disabled</VariantLabel>
          </div>
        </VariantGrid>
      </Section>

      {/* 3. Checklist Item — independent toggles, controlled checked state. */}
      <Section
        title="Checklist Item"
        description="Toggle item. Checked = filled circle + ✓ + struck-through label. Click to toggle; aria-checked mirrors the live state."
      >
        <InteractiveHint />
        <VariantGrid>
          <div>
            <FigmaChecklistItem
              checked={checked['item-1']}
              onClick={() =>
                setChecked((c) => ({ ...c, 'item-1': !c['item-1'] }))
              }
            >
              Complete online enrolment
            </FigmaChecklistItem>
            <VariantLabel>{checked['item-1'] ? 'Checked' : 'Unchecked'}</VariantLabel>
          </div>
          <div>
            <FigmaChecklistItem
              checked={checked['item-2']}
              onClick={() =>
                setChecked((c) => ({ ...c, 'item-2': !c['item-2'] }))
              }
            >
              Collect your student ID
            </FigmaChecklistItem>
            <VariantLabel>{checked['item-2'] ? 'Checked' : 'Unchecked'}</VariantLabel>
          </div>
          <div>
            <FigmaChecklistItem disabled>Setup IT account (disabled)</FigmaChecklistItem>
            <VariantLabel>Disabled</VariantLabel>
          </div>
        </VariantGrid>
      </Section>

      {/* 4. Bottom Tab Nav — controlled active tab, click to switch. */}
      <Section
        title="Bottom Tab Nav"
        description="Active tab fills with surface-inverse. Click any tab to switch; aria-current=page drives the active styling."
      >
        <InteractiveHint />
        <FigmaBottomTabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </Section>

      {/* 5. App Header */}
      <Section
        title="App Header"
        description="Top-of-screen title. Pass onClick for a tappable variant (rare — useful for refresh)."
      >
        <div className="flex flex-col gap-4">
          <div className="border border-dashed border-[#e5e5e5]">
            <FigmaAppHeader title="UAL Student Hub" />
          </div>
          <div className="border border-dashed border-[#e5e5e5]">
            <FigmaAppHeader title="Tap me" onClick={() => undefined} />
          </div>
        </div>
      </Section>

      {/* 6. Back Bar */}
      <Section
        title="Back Bar"
        description="Whole bar is the click target. Hover/focus highlight the entire surface."
      >
        <InteractiveHint />
        <div className="flex flex-col gap-4">
          <div className="border border-dashed border-[#e5e5e5]">
            <FigmaBackBar label="Back" />
          </div>
          <div className="border border-dashed border-[#e5e5e5]">
            <FigmaBackBar label="Checklist" />
          </div>
        </div>
      </Section>

      {/* 7. Title Block */}
      <Section
        title="Title Block"
        description="Eyebrow + headline pattern. Pass eyebrow=undefined to omit."
      >
        <div className="flex flex-col gap-8">
          <div>
            <FigmaTitleBlock eyebrow="Question 1 of 3" headline="Section heading" />
            <VariantLabel>With eyebrow</VariantLabel>
          </div>
          <div>
            <FigmaTitleBlock headline="Section heading" />
            <VariantLabel>Without eyebrow</VariantLabel>
          </div>
        </div>
      </Section>

      {/* 8. Quick Action Tile */}
      <Section
        title="Quick Action Tile"
        description="106×76 fixed. Three accent colours via the `accent` prop (Tailwind-only lookup, no inline style)."
      >
        <InteractiveHint />
        <VariantGrid>
          {[
            { accent: 'inverse', label: 'Inverse' },
            { accent: 'yellow', label: 'Yellow' },
            { accent: 'green', label: 'Green' },
          ].map((v) => (
            <div key={v.accent}>
              <FigmaQuickActionTile accent={v.accent} title="Action" sublabel="Sublabel" />
              <VariantLabel>{v.label}</VariantLabel>
            </div>
          ))}
        </VariantGrid>
      </Section>

      {/* 9. Date Badge */}
      <Section
        title="Date Badge"
        description="Day + 3-letter month. `tone` picks fill colour; use yellow for featured, green for confirmed, subtle for past."
      >
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <FigmaDateBadge day="23" month="SEP" tone="yellow" />
            <VariantLabel>Yellow</VariantLabel>
          </div>
          <div>
            <FigmaDateBadge day="25" month="SEP" tone="green" />
            <VariantLabel>Green</VariantLabel>
          </div>
          <div>
            <FigmaDateBadge day="01" month="OCT" tone="subtle" />
            <VariantLabel>Subtle</VariantLabel>
          </div>
        </div>
      </Section>

      {/* 10. Event Card — composes Date Badge, takes events array */}
      <Section
        title="Event Card"
        description="Composes Date Badge for each row. Event rows are real anchors — hover lifts the row to white, tab focuses with the orange ring."
      >
        <InteractiveHint />
        <FigmaEventCard
          title="Events this week"
          events={[
            {
              day: '23',
              month: 'SEP',
              tone: 'yellow',
              title: 'CSM Welcome',
              time: '10:00 · Granary Building',
              meta: 'Filtered to your college',
            },
            {
              day: '25',
              month: 'SEP',
              tone: 'green',
              title: 'Freshers fair',
              time: '11:00 · King’s Cross',
            },
          ]}
        />
      </Section>

      {/* 11. Get Setup Card — composes Progress Bar */}
      <Section
        title="Get Setup Card"
        description="Composes Progress Bar. Items array drives the preview rows."
      >
        <FigmaGetSetupCard
          counter="2 of 8 complete"
          progress={25}
          items={[
            { done: true, label: 'Complete online enrolment' },
            { done: true, label: 'Collect your student ID' },
            { done: false, label: 'Setup your IT account & email' },
          ]}
        />
      </Section>

      {/* 12. Progress Bar — pure values 0..100 */}
      <Section
        title="Progress Bar"
        description="Accessible track + fill. Drives the fill width with a runtime style — the only inline style allowed because Tailwind utilities can't express a continuous numeric variable."
      >
        <div className="flex flex-col gap-4">
          {[0, 25, 50, 75, 100].map((p) => (
            <div key={p}>
              <FigmaProgressBar value={p} />
              <VariantLabel>{p}%</VariantLabel>
            </div>
          ))}
        </div>
      </Section>

      {/* 13. Search Bar — uncontrolled input by default, type into it */}
      <Section
        title="Search Bar"
        description="Real <input>. Hover, focus, type — it works. Clear (×) appears when the input has content. Pass `value` + `onChange` for controlled usage."
      >
        <InteractiveHint />
        <VariantGrid>
          <div>
            <FigmaSearchBar />
            <VariantLabel>Default · type to interact</VariantLabel>
          </div>
          <div>
            <FigmaSearchBar value="UAL libraries" onChange={() => undefined} />
            <VariantLabel>Controlled · with text</VariantLabel>
          </div>
          <div>
            <FigmaSearchBar disabled />
            <VariantLabel>Disabled</VariantLabel>
          </div>
        </VariantGrid>
      </Section>
    </article>
  );
}
