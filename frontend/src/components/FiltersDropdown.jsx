// src/components/FiltersDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import Icons from './Icons';

/**
 * Props:
 * - label
 * - options (array)
 * - selected (array)
 * - onToggle(option)  // for checkboxes
 * - dateMode (bool) - if true renders date inputs
 * - selectedDateRange - object holding startDate/endDate
 * - onChangeDate(key, value)
 */
export default function FiltersDropdown({
  label,
  options = [],
  selected = [],
  onToggle,
  dateMode = false,
  selectedDateRange = {},
  onChangeDate,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handler(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm hover:shadow-sm"
      >
        <span className="text-sm text-gray-700">{label}</span>
        <Icons.ChevronDown size={14} className="text-gray-500" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-3">
          {dateMode ? (
            <div className="space-y-2">
              <div className="text-xs text-gray-500">Start Date</div>
              <input
                type="date"
                value={selectedDateRange.startDate || ''}
                onChange={(e) => onChangeDate('startDate', e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
              <div className="text-xs text-gray-500">End Date</div>
              <input
                type="date"
                value={selectedDateRange.endDate || ''}
                onChange={(e) => onChangeDate('endDate', e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
          ) : (
            <div className="max-h-56 overflow-auto">
              {options.length === 0 && <div className="text-sm text-gray-500">No options</div>}
              {options.map((opt) => {
                const isChecked = selected.includes(opt);
                return (
                  <label key={opt} className="flex items-center gap-2 p-1 rounded hover:bg-gray-50 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggle(opt)}
                      className="accent-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{opt}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
