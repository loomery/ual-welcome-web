'use client';

import clsx from 'clsx';
import { useState } from 'react';

/**
 * FigmaSearchBar — text-input search field with leading magnifier and
 * trailing clear button (node 26:33).
 *
 * Truly interactive: real `<input>` reacts to focus/hover/disabled
 * via Tailwind variants. Clear button appears when the input has
 * content and clears it. Uncontrolled by default (manages own state)
 * but accepts `value` + `onChange` for controlled usage.
 *
 * @param {Object} props
 * @param {string} [props.value]         controlled value
 * @param {(v: string) => void} [props.onChange]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.disabled]
 * @param {string} [props.aria-label]
 */
export function FigmaSearchBar({
  value: controlledValue,
  onChange,
  placeholder = 'Search the hub',
  disabled = false,
  ...rest
}) {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = (next) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <div
      className={clsx(
        'flex w-85.75 max-w-full items-center gap-3 border border-[#e5e5e5] bg-white px-4 py-3.5 focus-within:border-2 focus-within:border-[#ff5000] focus-within:bg-white focus-within:px-3.75 focus-within:py-3.25 hover:border-[#858585] hover:bg-[#f2f2f2]',
        disabled && 'opacity-70 hover:border-[#e5e5e5] hover:bg-white',
      )}
      aria-disabled={disabled || undefined}
    >
      <span aria-hidden="true" className="shrink-0 text-[20px] leading-none text-[#525252]">
        ⌕
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={rest['aria-label'] || placeholder}
        className="min-w-0 flex-1 border-0 bg-transparent text-[17px] leading-normal text-black outline-none placeholder:text-[#858585] disabled:cursor-not-allowed disabled:placeholder:text-[#c2c2c2]"
      />
      {value && !disabled && (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label="Clear search"
          className="shrink-0 rounded-xs px-0.5 text-[18px] leading-none font-bold text-[#525252] hover:text-black focus:outline-none focus-visible:outline-2 focus-visible:outline-[#ff5000]"
        >
          ×
        </button>
      )}
    </div>
  );
}
