// src/components/Pagination.jsx
import React from 'react';

export default function Pagination({ page = 1, totalPages = 1, onChange }) {
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-3 py-1 rounded border bg-white text-sm"
      >
        Prev
      </button>

      {start > 1 && (
        <button onClick={() => onChange(1)} className="px-2 py-1 rounded border text-sm">
          1
        </button>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 rounded text-sm border ${p === page ? 'bg-gray-800 text-white' : 'bg-white'}`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <button onClick={() => onChange(totalPages)} className="px-2 py-1 rounded border text-sm">
          {totalPages}
        </button>
      )}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="px-3 py-1 rounded border bg-white text-sm"
      >
        Next
      </button>
    </div>
  );
}
