'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/Button/Button';
import { ArrowRightIcon, ChevronDownIcon } from '../../components/Icon/NavIcons';
import { useOnboardingProfile } from '../../hooks/useOnboardingProfile';
import {
  COLLEGE_OPTIONS,
  STUDENT_STATUS_OPTIONS,
  STUDENT_TYPE_OPTIONS,
  INTEREST_OPTIONS,
} from '../../data/onboardingOptions';

/**
 * Profile-edit page ("Your profile"). Lets a student change the details they
 * gave during onboarding: status, college, student type and interests.
 * Chrome-light layout (see isFocusedRoute). Gates on hydration so the form
 * seeds from the persisted profile.
 */
export function ProfileScreen() {
  const { profile, patch, hydrated } = useOnboardingProfile();

  if (!hydrated) return null;

  return <ProfileForm profile={profile} patch={patch} />;
}

/**
 * @param {Object} props
 * @param {Partial<import('../../hooks/useOnboardingProfile').OnboardingProfile>} props.profile
 * @param {(next: Object) => void} props.patch
 */
function ProfileForm({ profile, patch }) {
  const router = useRouter();

  const [form, setForm] = useState({
    studentStatus: profile.studentStatus ?? STUDENT_STATUS_OPTIONS[0].id,
    collegeId: profile.collegeId ?? COLLEGE_OPTIONS[0].id,
    studentType: profile.studentType ?? STUDENT_TYPE_OPTIONS[0].id,
    interests: profile.interests ?? [],
  });

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleInterest(id) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(id)
        ? f.interests.filter((i) => i !== id)
        : [...f.interests, id],
    }));
  }

  function save() {
    patch(form);
    router.push('/');
  }

  return (
    <article className="mx-auto w-full max-w-[57.6rem]">
      <header className="mb-8 flex flex-col gap-3">
        <h1>Your profile</h1>
        <p className="text-step-1 text-ual-medium">Update the details you provided</p>
      </header>

      <div className="flex flex-col gap-8 bg-ual-light p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField
            label="Student status"
            value={form.studentStatus}
            onChange={(v) => set('studentStatus', v)}
            options={STUDENT_STATUS_OPTIONS}
          />
          <SelectField
            label="College"
            value={form.collegeId}
            onChange={(v) => set('collegeId', v)}
            options={COLLEGE_OPTIONS.map((c) => ({ id: c.id, label: c.name }))}
          />
          <SelectField
            label="Student type"
            value={form.studentType}
            onChange={(v) => set('studentType', v)}
            options={STUDENT_TYPE_OPTIONS}
          />
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-step-d1 text-ual-medium">Your interests</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {INTEREST_OPTIONS.map((opt) => (
              <InterestCheckbox
                key={opt.id}
                label={opt.label}
                checked={form.interests.includes(opt.id)}
                onChange={() => toggleInterest(opt.id)}
              />
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-8 flex flex-col gap-4 md:flex-row">
        <Button
          weight="normal"
          className="w-full justify-between whitespace-nowrap md:w-auto md:min-w-[18rem]"
          onClick={save}
        >
          Save and go to your home page
          <ArrowRightIcon aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          weight="normal"
          className="w-full md:w-auto"
          onClick={() => router.push('/')}
        >
          Cancel
        </Button>
      </div>
    </article>
  );
}

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {Array<{ id: string, label: string }>} props.options
 */
function SelectField({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-step-d1 text-ual-medium">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-ual-dark-90 bg-ual-light py-3 pr-11 pl-4 text-step-0 text-ual-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          width={20}
          height={20}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ual-dark"
        />
      </div>
    </label>
  );
}

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {boolean} props.checked
 * @param {() => void} props.onChange
 */
function InterestCheckbox({ label, checked, onChange }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={[
        'flex items-center gap-3 border px-4 py-3 text-start text-step-0 transition-[border-color,background-color,color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange',
        checked
          ? 'border-ual-dark bg-ual-dark text-ual-light'
          : 'border-ual-dark-90 bg-ual-light text-ual-dark hover:border-ual-dark',
      ].join(' ')}
    >
      <span
        className={[
          'inline-flex size-5 shrink-0 items-center justify-center border',
          checked ? 'border-ual-orange bg-ual-orange text-ual-light' : 'border-ual-dark-50',
        ].join(' ')}
        aria-hidden="true"
      >
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" className="block size-3">
            <path
              d="M2.5 6 5 8.5 9.5 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </button>
  );
}
