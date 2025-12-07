import React from 'react';

export default function Filters({filters, values, setValues}) {
  // For simplicity, use multi-select via checkboxes inside dropdown-like card
  const toggle = (key, val) => {
    const arr = values[key] || [];
    const next = arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val];
    setValues({...values, [key]: next});
  };

  return (
    <div className="card mb-4">
      <div className="filter-row">
        {['customerRegion','genders','categories','tags','paymentMethods'].map((k)=>(
          <div key={k} className="pill small-muted">
            {k}
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500">Use the left filters panel for detailed filtering.</div>
    </div>
  )
}