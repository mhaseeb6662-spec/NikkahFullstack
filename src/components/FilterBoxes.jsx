"use client";

import { Search } from "lucide-react";
import { Field, Select, Input } from "./FormFields";

export default function FilterBoxes({
  castesList,
  cities,
  educationLevels,
  caste,
  setCaste,
  ageMin,
  setAgeMin,
  ageMax,
  setAgeMax,
  city,
  setCity,
  education,
  setEducation,
  onSubmit,
  submitLabel = "Search Profiles",
  className = "",
}) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 ${className}`}>
      <Field label="Caste">
        <Select value={caste} onChange={(e) => setCaste(e.target.value)}>
          <option value="">Any Caste</option>
          {castesList.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </Field>

      <Field label="Age">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="18"
            max="70"
            placeholder="Min"
            value={ageMin}
            onChange={(e) => setAgeMin(e.target.value)}
            className="w-full min-w-0"
          />
          <span className="text-ink-400 text-xs shrink-0">to</span>
          <Input
            type="number"
            min="18"
            max="70"
            placeholder="Max"
            value={ageMax}
            onChange={(e) => setAgeMax(e.target.value)}
            className="w-full min-w-0"
          />
        </div>
      </Field>

      <Field label="City">
        <Select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Any City</option>
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </Field>

      <Field label="Education">
        <Select value={education} onChange={(e) => setEducation(e.target.value)}>
          <option value="">Any Education</option>
          {educationLevels.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </Select>
      </Field>

      <div>
        <span className="block text-sm font-semibold mb-1.5 opacity-0 select-none" aria-hidden="true">
          Search
        </span>
        <button
          type="button"
          onClick={onSubmit}
          className="w-full h-[42px] rounded-xl bg-maroon-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-maroon-600 transition-colors"
        >
          <Search size={16} /> {submitLabel}
        </button>
      </div>
    </div>
  );
}
