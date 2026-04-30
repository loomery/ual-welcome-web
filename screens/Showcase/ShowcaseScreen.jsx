'use client';

/**
 * Component showcase — 1:1 mirror of Shenese's Figma component handoff library:
 * https://www.figma.com/design/5UATNYgfuhdBbrMp9X4dEI/Component-handoff-exploration
 *
 * Every component is pulled directly from the Figma file via the Figma MCP.
 * Hex colours, pixel sizes, line-heights, and variant matrices match Figma exactly.
 *
 * Type: we use the project's `--font-main` (Helvetica Neue) instead of Figma's
 * placeholder Roboto. The metric stack is similar enough that pixel sizes
 * transfer cleanly.
 *
 * Figma → CSS token mapping (used inline here):
 *   --surface-surface-default      → #ffffff (white)
 *   --surface-surface-inverse      → #000000 (black)
 *   --surface-surface-subtle       → #f2f2f2
 *   --surface-surface-brand        → #ff5000  (matches existing --color-orange)
 *   --line-line-default            → #e5e5e5
 *   --line-line-strong             → #858585
 *   --line-line-focus              → #ff5000
 *   --color-neutral-300            → #e5e5e5
 *   --color-neutral-600            → #525252
 *   --color-neutral-700            → #262626
 *   --color-yellow-400             → #ffd022
 *   --color-green-400              → #00c73e
 *   --content-content-default      → #000000
 *   --content-content-onInverse    → #ffffff
 *   --content-content-secondary    → #525252
 *   --content-content-tertiary     → #858585
 *   --content-content-disabled     → #c2c2c2
 *
 * WCAG 2.2 AA notes:
 * - All interactive components expose a Focused variant with a 2px #ff5000 border.
 * - Touch targets exceed the 44×44 minimum (rows 56px, buttons 54px, tabs 47px).
 * - Disabled text uses #c2c2c2 — this fails 4.5:1 but is exempt under 1.4.3.
 * - Placeholder text uses #858585 — borderline AA on white (3.95:1). Flagged
 *   for review with Shenese; production version may need to bump to #767676.
 * - All decorative glyphs (✓, ›, ‹, ⌕, ×) are wrapped with aria-hidden.
 */

// ============================================================================
// LAYOUT HELPERS
// ============================================================================

function FidelityBadge() {
  return (
    <span className="inline-flex items-center text-[11px] font-medium uppercase tracking-[0.5px] px-[8px] py-[2px] rounded-full bg-black text-white">
      1:1 from Figma
    </span>
  );
}

function Section({ title, description, children }) {
  return (
    <section className="border-t border-[#e5e5e5] pt-[32px]">
      <div className="mb-[16px]">
        <div className="flex items-center gap-[12px] flex-wrap mb-[6px]">
          <h2 className="font-bold text-[24px] text-black leading-[1.2]">{title}</h2>
          <FidelityBadge />
        </div>
        {description && (
          <p className="text-[14px] text-[#525252] leading-[1.5] max-w-[640px]">{description}</p>
        )}
      </div>
      <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-[8px] p-[24px] sm:p-[32px] overflow-x-auto">
        {children}
      </div>
    </section>
  );
}

function VariantLabel({ children }) {
  return (
    <span className="block text-[11px] font-medium uppercase tracking-[0.5px] text-[#858585] mt-[8px]">
      {children}
    </span>
  );
}

function VariantGrid({ children, cols = 'auto' }) {
  const colsClass =
    cols === 5 ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
    : cols === 6 ? 'sm:grid-cols-2 md:grid-cols-3'
    : cols === 3 ? 'sm:grid-cols-2 md:grid-cols-3'
    : 'sm:grid-cols-2';
  return (
    <div className={['grid gap-[24px]', colsClass].join(' ')}>{children}</div>
  );
}

// ============================================================================
// 1. BUTTON — node 6:22
// ============================================================================

function FigmaButton({ style = 'Primary', state = 'Default', label = 'Button' }) {
  const isPrimary = style === 'Primary';

  // Container styles per Figma states matrix
  const containerMap = {
    Primary: {
      Default:  { bg: '#000000', border: 'none' },
      Hover:    { bg: '#262626', border: 'none' },
      Pressed:  { bg: '#525252', border: 'none' },
      Focused:  { bg: '#ff5000', border: '2px solid #ff5000' },
      Disabled: { bg: '#e5e5e5', border: 'none' },
    },
    Secondary: {
      Default:  { bg: '#ffffff', border: '1px solid #000000' },
      Hover:    { bg: '#f2f2f2', border: '1px solid #000000' },
      Pressed:  { bg: '#e5e5e5', border: '1px solid #000000' },
      Focused:  { bg: '#ffffff', border: '2px solid #ff5000' },
      Disabled: { bg: '#ffffff', border: '1px solid #e5e5e5' },
    },
  };

  // Text colour: Disabled is #c2c2c2; Primary non-disabled is white; Secondary non-disabled is black
  const textColor =
    state === 'Disabled'
      ? '#c2c2c2'
      : isPrimary
      ? '#ffffff'
      : '#000000';

  const { bg, border } = containerMap[style][state];
  const isDisabled = state === 'Disabled';

  return (
    <button
      type="button"
      disabled={isDisabled}
      className="inline-flex items-center justify-center w-[96px] px-[24px] py-[16px] text-[16px] font-medium leading-[1.4] disabled:cursor-not-allowed"
      style={{ background: bg, border, color: textColor }}
    >
      {label}
    </button>
  );
}

// ============================================================================
// 2. OPTION ROW — node 7:14
// ============================================================================

function OptionRow({ state = 'Default', label = 'Option label' }) {
  // Per Figma:
  //   Default:  white bg, 1px #e5e5e5 border, black text
  //   Hover:    #f2f2f2 bg, 1px #858585 border, black text
  //   Pressed:  #e5e5e5 bg, 1px #858585 border, black text
  //   Focused:  white bg, 2px #ff5000 border, black text
  //   Selected: black bg, no border, white text
  //   Disabled: white bg, 1px #e5e5e5 border, #c2c2c2 text
  const map = {
    Default:  { bg: '#ffffff', border: '1px solid #e5e5e5', color: '#000000' },
    Hover:    { bg: '#f2f2f2', border: '1px solid #858585', color: '#000000' },
    Pressed:  { bg: '#e5e5e5', border: '1px solid #858585', color: '#000000' },
    Focused:  { bg: '#ffffff', border: '2px solid #ff5000', color: '#000000' },
    Selected: { bg: '#000000', border: 'none',              color: '#ffffff' },
    Disabled: { bg: '#ffffff', border: '1px solid #e5e5e5', color: '#c2c2c2' },
  };

  const isDisabled = state === 'Disabled';
  const s = map[state];

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-pressed={state === 'Selected'}
      className="flex items-center w-[319px] max-w-full text-left px-[20px] py-[16px] text-[17px] leading-[1.5] disabled:cursor-not-allowed"
      style={{ background: s.bg, border: s.border, color: s.color, minHeight: 56 }}
    >
      {label}
    </button>
  );
}

// ============================================================================
// 3. CHECKLIST ITEM — node 9:33
// ============================================================================

function ChecklistItem({ state = 'Unchecked', label = 'Checklist item label' }) {
  // Per Figma: container fills the same as Option Row but indicator + chevron are added.
  const containerMap = {
    Unchecked: { bg: '#ffffff', border: 'none' },
    Checked:   { bg: '#ffffff', border: 'none' },
    Hover:     { bg: '#f2f2f2', border: 'none' },
    Pressed:   { bg: '#e5e5e5', border: 'none' },
    Focused:   { bg: '#ffffff', border: '2px solid #ff5000' },
    Disabled:  { bg: '#ffffff', border: 'none' },
  };

  const isChecked = state === 'Checked';
  const isDisabled = state === 'Disabled';
  const labelColor = isDisabled ? '#c2c2c2' : isChecked ? '#525252' : '#000000';
  const chevColor = isDisabled ? '#c2c2c2' : '#525252';
  const c = containerMap[state];

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-checked={isChecked}
      role="checkbox"
      className="flex items-center gap-[12px] w-[335px] max-w-full p-[16px] disabled:cursor-not-allowed"
      style={{ background: c.bg, border: c.border, minHeight: 56 }}
    >
      {/* Indicator: empty circle / filled black with check */}
      <span
        aria-hidden="true"
        className="relative flex-shrink-0 size-[22px] rounded-full flex items-center justify-center"
        style={{
          background: isChecked ? '#000000' : 'transparent',
          border: isChecked ? 'none' : `1.5px solid ${isDisabled ? '#e5e5e5' : '#000000'}`,
        }}
      >
        {isChecked && (
          <span className="text-white text-[13px] font-bold leading-none">✓</span>
        )}
      </span>

      {/* Label */}
      <span
        className="flex-1 text-left text-[17px] leading-[1.5]"
        style={{
          color: labelColor,
          textDecoration: isChecked ? 'line-through' : 'none',
        }}
      >
        {label}
      </span>

      {/* Trailing chevron */}
      <span
        aria-hidden="true"
        className="flex-shrink-0 text-[20px] leading-none"
        style={{ color: chevColor }}
      >
        ›
      </span>
    </button>
  );
}

// ============================================================================
// 4. BOTTOM TAB NAV — node 10:54
// ============================================================================

const TABS = ['Hub', 'Checklist', 'Events', 'Map'];

function BottomTabNav({ activeTab = 'Hub' }) {
  return (
    <nav
      aria-label="Primary"
      className="flex items-center w-[375px] max-w-full h-[58px] px-[16px] pt-[6px] pb-[5px] bg-white border-t border-[#e5e5e5]"
    >
      {TABS.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            className="flex flex-col items-center justify-center flex-1 h-[47px] gap-[4px] px-[4px] py-[8px] overflow-hidden"
            style={{ background: isActive ? '#000000' : 'transparent' }}
          >
            <span
              aria-hidden="true"
              className="size-[8px] rounded-full"
              style={{ background: isActive ? '#ffffff' : '#525252' }}
            />
            <span
              className="text-[13px] leading-[1.4] whitespace-nowrap"
              style={{ color: isActive ? '#ffffff' : '#525252' }}
            >
              {tab}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ============================================================================
// 5. APP HEADER — node 11:2
// ============================================================================

function AppHeader({ title = 'UAL Student Hub' }) {
  return (
    <header className="flex items-center w-[375px] max-w-full px-[24px] bg-white" style={{ minHeight: 44 }}>
      <h2 className="flex-1 text-[17px] font-bold leading-[1.5] text-black">
        {title}
      </h2>
    </header>
  );
}

// ============================================================================
// 6. BACK BAR — node 11:10
// ============================================================================

function BackBar({ label = 'Back' }) {
  return (
    <div className="flex items-center gap-[10px] w-[375px] max-w-full px-[24px] bg-white" style={{ minHeight: 44 }}>
      <span aria-hidden="true" className="text-[22px] leading-none text-black flex-shrink-0">‹</span>
      <span className="flex-1 text-[16px] leading-[1.4] text-black">{label}</span>
    </div>
  );
}

// ============================================================================
// 7. TITLE BLOCK — node 11:13
// ============================================================================

function TitleBlock({
  eyebrow = 'Question 1 of 3',
  headline = 'Section heading',
  showEyebrow = true,
}) {
  return (
    <div className="flex flex-col items-start gap-[6px] w-[319px] max-w-full">
      {showEyebrow && (
        <p className="text-[13px] font-medium leading-[1.2] tracking-[1.2px] uppercase text-[#525252] w-full">
          {eyebrow}
        </p>
      )}
      <p className="text-[32px] font-bold leading-[1.1] text-black w-full">
        {headline}
      </p>
    </div>
  );
}

// ============================================================================
// 8. QUICK ACTION TILE — node 12:25
// ============================================================================

const ACCENT_COLOR = {
  Inverse: '#000000',
  Yellow:  '#ffd022',
  Green:   '#00c73e',
};

function QuickActionTile({ accent = 'Inverse', title = 'Action', sublabel = 'Sublabel' }) {
  return (
    <button
      type="button"
      className="flex flex-col items-start gap-[4px] w-[106px] h-[76px] pt-[16px] pl-[16px] pr-[12px] pb-[12px] bg-[#f2f2f2] text-left"
    >
      <span className="text-[16px] font-medium leading-[1.4] text-black whitespace-nowrap">
        {title}
      </span>
      <span className="text-[14px] leading-[1.4] text-[#525252] whitespace-nowrap">
        {sublabel}
      </span>
      <span
        aria-hidden="true"
        className="block w-[40px] h-[3px] mt-auto"
        style={{ background: ACCENT_COLOR[accent] }}
      />
    </button>
  );
}

// ============================================================================
// 9. DATE BADGE — node 12:26
// ============================================================================

function DateBadge({ day = '23', month = 'SEP', fill = '#ffd022' }) {
  return (
    <span
      className="inline-flex flex-col items-center justify-center size-[48px] rounded-[4px] text-black"
      style={{ background: fill }}
    >
      <span className="text-[17px] font-bold leading-[1.1]">{day}</span>
      <span className="text-[11px] font-bold tracking-[0.5px] leading-none">{month}</span>
    </span>
  );
}

// ============================================================================
// 10. EVENT CARD — node 13:2
// ============================================================================

function EventCard({ cardTitle = 'Events this week' }) {
  return (
    <article className="flex flex-col gap-[16px] w-[327px] max-w-full p-[16px] bg-[#f2f2f2] rounded-[8px]">
      <header className="flex items-center justify-between">
        <h3 className="text-[20px] font-bold leading-[1.2] text-black">{cardTitle}</h3>
        <a href="#" className="text-[13px] leading-[1.4] text-[#525252] hover:underline">
          See all →
        </a>
      </header>

      <div className="flex items-start gap-[12px]">
        <DateBadge day="23" month="SEP" fill="#ffd022" />
        <div className="flex-1 flex flex-col gap-[2px] min-w-0">
          <p className="text-[16px] font-medium leading-[1.4] text-black">CSM Welcome</p>
          <p className="text-[13px] leading-[1.4] text-[#525252]">10:00 · Granary Building</p>
          <p className="text-[13px] leading-[1.4] text-[#858585]">Filtered to your college</p>
        </div>
      </div>

      <div className="flex items-start gap-[12px]">
        <DateBadge day="25" month="SEP" fill="#00c73e" />
        <div className="flex-1 flex flex-col gap-[2px] min-w-0">
          <p className="text-[16px] font-medium leading-[1.4] text-black">Freshers fair</p>
          <p className="text-[13px] leading-[1.4] text-[#525252]">11:00 · King&rsquo;s Cross</p>
        </div>
      </div>
    </article>
  );
}

// ============================================================================
// 11. GET SETUP CARD — node 13:21
// ============================================================================

function GetSetupCheckRow({ checked = true, label }) {
  return (
    <div className="flex items-center gap-[8px] w-full">
      <span
        aria-hidden="true"
        className="relative flex-shrink-0 size-[16px] rounded-full flex items-center justify-center"
        style={{
          background: checked ? '#000000' : 'transparent',
          border: checked ? 'none' : '1.5px solid #000000',
        }}
      >
        {checked && (
          <span className="text-white text-[10px] font-bold leading-none">✓</span>
        )}
      </span>
      <span
        className="flex-1 text-[16px] leading-[1.4]"
        style={{
          color: checked ? '#525252' : '#000000',
          textDecoration: checked ? 'line-through' : 'none',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function GetSetupCard({ cardTitle = 'Get setup', counter = '2 of 8 complete', progress = 0.25 }) {
  return (
    <article className="flex flex-col justify-between w-[327px] max-w-full h-[249px] p-[16px] bg-[#f2f2f2] rounded-[8px]">
      <div className="flex flex-col gap-[12px]">
        <h3 className="text-[20px] font-bold leading-[1.2] text-black whitespace-nowrap">
          {cardTitle}
        </h3>
        <p className="text-[13px] leading-[1.4] text-[#525252] whitespace-nowrap">
          {counter}
        </p>

        {/* Inline progress bar — track + fill */}
        <div
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="relative h-[6px] w-full rounded-full bg-[#e5e5e5] overflow-hidden"
        >
          <div
            className="absolute left-0 top-0 h-[6px] bg-black rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <GetSetupCheckRow checked label="Complete online enrolment" />
        <GetSetupCheckRow checked label="Collect your student ID" />
        <GetSetupCheckRow checked={false} label="Setup your IT account & email" />
      </div>

      <a href="#" className="text-[13px] leading-[1.4] text-[#525252] hover:underline">
        See all →
      </a>
    </article>
  );
}

// ============================================================================
// 12. PROGRESS BAR — node 19:23
// ============================================================================

function ProgressBar({ progress = 0 }) {
  // Figma defines 5 discrete variants (0, 25, 50, 75, 100) at 295px track width.
  // Track bg is #f2f2f2 in Figma; fill is black.
  const pct = progress;
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className="relative h-[6px] w-[295px] max-w-full rounded-full bg-[#f2f2f2] overflow-hidden"
    >
      <div
        className="absolute left-0 top-0 h-[6px] bg-black rounded-full"
        style={{ width: `${pct}%`, minWidth: pct === 0 ? '1px' : undefined }}
      />
    </div>
  );
}

// ============================================================================
// 13. SEARCH BAR — node 26:33
// ============================================================================

function SearchBar({ state = 'Default', hasText = false, value = 'Search the hub' }) {
  // Container styles per Figma (state × hasText)
  const isFocused = state === 'Focused';
  const isHover = state === 'Hover';
  const isDisabled = state === 'Disabled';

  const border = isFocused
    ? '2px solid #ff5000'
    : isHover
    ? '1px solid #858585'
    : '1px solid #e5e5e5';
  const bg = isHover ? '#f2f2f2' : '#ffffff';

  // Text colour rules:
  //   - hasText + (Default|Focused) → #000000 (with × clear button)
  //   - !hasText + Disabled → #c2c2c2 (placeholder, but disabled-styled)
  //   - !hasText + others → #858585 placeholder
  const textColor = isDisabled
    ? '#c2c2c2'
    : hasText
    ? '#000000'
    : '#858585';

  return (
    <div
      className="flex items-center gap-[12px] w-[343px] max-w-full px-[16px] py-[14px]"
      style={{ background: bg, border, opacity: isDisabled ? 0.7 : 1 }}
      aria-disabled={isDisabled}
    >
      <span
        aria-hidden="true"
        className="text-[20px] leading-none flex-shrink-0"
        style={{ color: '#525252' }}
      >
        ⌕
      </span>
      <input
        type="search"
        defaultValue={hasText ? value : ''}
        placeholder={hasText ? undefined : value}
        disabled={isDisabled}
        readOnly={!isFocused}
        className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[17px] leading-[1.5] disabled:cursor-not-allowed"
        style={{ color: textColor }}
      />
      {hasText && !isDisabled && (
        <button
          type="button"
          aria-label="Clear search"
          className="flex-shrink-0 text-[18px] font-bold leading-none text-[#525252]"
        >
          ×
        </button>
      )}
    </div>
  );
}

// ============================================================================
// MAIN SCREEN
// ============================================================================

export function ShowcaseScreen() {
  return (
    <article className="flow" data-flow="l" style={{ fontFamily: 'var(--font-main)' }}>
      {/* Header */}
      <header className="flow" data-flow="s">
        <p className="text-[13px] font-medium uppercase tracking-[1.2px] text-[#ff5000]">
          Component handoff exploration
        </p>
        <h1 className="text-[32px] font-bold leading-[1.1] text-black">Component showcase</h1>
        <p className="text-[17px] leading-[1.5] text-[#525252] max-w-[640px]">
          A live render of every component in Shenese&rsquo;s Figma library, pulled
          via the Figma MCP and rebuilt in the codebase. Hex colours, pixel sizes
          and variant matrices match Figma 1:1. Components use the project font
          (Helvetica Neue) instead of Figma&rsquo;s placeholder Roboto.
        </p>
      </header>

      {/* 1. Button — uses flex-wrap instead of VariantGrid because the
          buttons themselves are small (w-[96px]) and a 5-col grid leaves
          huge horizontal gaps. flex-wrap packs each variant tightly, with
          consistent gap-x/gap-y, and wraps as the viewport narrows. */}
      <Section
        title="Button"
        description="UAL Button. Style: Primary (filled inverse) / Secondary (outline). State: Default / Hover / Pressed / Focused / Disabled."
      >
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-[13px] font-medium uppercase tracking-[0.5px] text-[#525252] mb-[16px]">Primary</h3>
            <div className="flex flex-wrap gap-x-10 gap-y-6">
              {['Default', 'Hover', 'Pressed', 'Focused', 'Disabled'].map((s) => (
                <div key={s} className="flex flex-col">
                  <FigmaButton style="Primary" state={s} />
                  <VariantLabel>{s}</VariantLabel>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[13px] font-medium uppercase tracking-[0.5px] text-[#525252] mb-[16px]">Secondary</h3>
            <div className="flex flex-wrap gap-x-[40px] gap-y-[24px]">
              {['Default', 'Hover', 'Pressed', 'Focused', 'Disabled'].map((s) => (
                <div key={s} className="flex flex-col">
                  <FigmaButton style="Secondary" state={s} />
                  <VariantLabel>{s}</VariantLabel>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 2. Option Row */}
      <Section
        title="Option Row"
        description="UAL Option Row — survey single-select list item. 56px height meets 44px touch target. Six states."
      >
        <VariantGrid cols={3}>
          {['Default', 'Hover', 'Pressed', 'Focused', 'Selected', 'Disabled'].map((s) => (
            <div key={s}>
              <OptionRow state={s} label="Option label" />
              <VariantLabel>{s}</VariantLabel>
            </div>
          ))}
        </VariantGrid>
      </Section>

      {/* 3. Checklist Item */}
      <Section
        title="Checklist Item"
        description="UAL Checklist Item. Checked = filled circle + ✓ + struck-through label. Trailing chevron = tappable detail. 56px height."
      >
        <VariantGrid cols={3}>
          {['Unchecked', 'Checked', 'Hover', 'Pressed', 'Focused', 'Disabled'].map((s) => (
            <div key={s}>
              <ChecklistItem state={s} label="Checklist item label" />
              <VariantLabel>{s}</VariantLabel>
            </div>
          ))}
        </VariantGrid>
      </Section>

      {/* 4. Bottom Tab Nav */}
      <Section
        title="Bottom Tab Nav"
        description="Active tab fills with surface-inverse, inactive uses content-secondary. Icons are placeholder dots — swap when icon library is built."
      >
        <div className="flex flex-col gap-[16px]">
          {TABS.map((tab) => (
            <div key={tab}>
              <BottomTabNav activeTab={tab} />
              <VariantLabel>Active: {tab}</VariantLabel>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. App Header */}
      <Section
        title="App Header"
        description="UAL Student Hub app header. Set Title to override."
      >
        <div className="border border-dashed border-[#e5e5e5]">
          <AppHeader />
        </div>
      </Section>

      {/* 6. Back Bar */}
      <Section
        title="Back Bar"
        description="Back bar with leading chevron + tappable label. Default label “Back” — override per screen context."
      >
        <div className="flex flex-col gap-[16px]">
          <div className="border border-dashed border-[#e5e5e5]">
            <BackBar label="Back" />
          </div>
          <div className="border border-dashed border-[#e5e5e5]">
            <BackBar label="Checklist" />
          </div>
        </div>
      </Section>

      {/* 7. Title Block */}
      <Section
        title="Title Block"
        description="UAL Title Block. Eyebrow + headline pattern used on survey, welcome, and detail screens. Toggle Show Eyebrow."
      >
        <div className="flex flex-col gap-[32px]">
          <div>
            <TitleBlock eyebrow="Question 1 of 3" headline="Section heading" showEyebrow />
            <VariantLabel>With eyebrow</VariantLabel>
          </div>
          <div>
            <TitleBlock headline="Section heading" showEyebrow={false} />
            <VariantLabel>Without eyebrow</VariantLabel>
          </div>
        </div>
      </Section>

      {/* 8. Quick Action Tile */}
      <Section
        title="Quick Action Tile"
        description="Used in Feed grid. 106×76 fixed. Title + Sublabel + accent underline. Use Accent to swap underline colour."
      >
        <VariantGrid cols={3}>
          {['Inverse', 'Yellow', 'Green'].map((a) => (
            <div key={a}>
              <QuickActionTile accent={a} title="Action" sublabel="Sublabel" />
              <VariantLabel>{a}</VariantLabel>
            </div>
          ))}
        </VariantGrid>
      </Section>

      {/* 9. Date Badge */}
      <Section
        title="Date Badge"
        description="Day + month abbreviation. Used in Event Card and listings. Change fill to indicate priority (yellow = featured)."
      >
        <div className="flex items-center gap-[16px] flex-wrap">
          <div>
            <DateBadge day="23" month="SEP" fill="#ffd022" />
            <VariantLabel>Yellow</VariantLabel>
          </div>
          <div>
            <DateBadge day="25" month="SEP" fill="#00c73e" />
            <VariantLabel>Green</VariantLabel>
          </div>
          <div>
            <DateBadge day="01" month="OCT" fill="#f2f2f2" />
            <VariantLabel>Subtle</VariantLabel>
          </div>
        </div>
      </Section>

      {/* 10. Event Card */}
      <Section
        title="Event Card"
        description="Title row + see-all link + event rows. Each row has Date Badge + title + meta. Edit row text inline; replace badge fill for category coding."
      >
        <EventCard />
      </Section>

      {/* 11. Get Setup Card */}
      <Section
        title="Get Setup Card"
        description="Title + counter + progress bar + 3 preview rows. “See all →” pinned to bottom-left via SPACE_BETWEEN auto-layout."
      >
        <GetSetupCard />
      </Section>

      {/* 12. Progress Bar */}
      <Section
        title="Progress Bar"
        description="Auto-layout track. Place instance in container; set Fill child width to a % of the track to render any progress value."
      >
        <div className="flex flex-col gap-[16px]">
          {[0, 25, 50, 75, 100].map((p) => (
            <div key={p}>
              <ProgressBar progress={p} />
              <VariantLabel>{p}%</VariantLabel>
            </div>
          ))}
        </div>
      </Section>

      {/* 13. Search Bar */}
      <Section
        title="Search Bar"
        description="State: Default / Hover / Focused / Disabled. HasText: true (shows clear ×) / false (placeholder). 343px default width — FILL parent in real layout."
      >
        <VariantGrid cols={3}>
          <div>
            <SearchBar state="Default" hasText={false} />
            <VariantLabel>Default · placeholder</VariantLabel>
          </div>
          <div>
            <SearchBar state="Default" hasText value="UAL libraries" />
            <VariantLabel>Default · with text</VariantLabel>
          </div>
          <div>
            <SearchBar state="Hover" hasText={false} />
            <VariantLabel>Hover · placeholder</VariantLabel>
          </div>
          <div>
            <SearchBar state="Focused" hasText={false} />
            <VariantLabel>Focused · placeholder</VariantLabel>
          </div>
          <div>
            <SearchBar state="Focused" hasText value="UAL libraries" />
            <VariantLabel>Focused · with text</VariantLabel>
          </div>
          <div>
            <SearchBar state="Disabled" hasText={false} />
            <VariantLabel>Disabled</VariantLabel>
          </div>
        </VariantGrid>
      </Section>
    </article>
  );
}
