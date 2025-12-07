// src/components/SummaryCards.jsx
import React from 'react';
import { Info } from 'lucide-react';

function formatCurrency(v) {
  if (v === undefined || v === null || v === "") return "0.00";
  return Number(v).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function SummaryCards({ meta }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-3">

      {/* Total Units Sold */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">Total units sold</div>
          <Info size={14} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
        <div className="text-xl font-semibold">{meta.totalUnits ?? 0}</div>
      </div>

      {/* Total Amount */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">Total Amount</div>
          <Info size={14} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
        <div className="text-xl font-semibold">
          ₹{formatCurrency(meta.totalAmount)}
        </div>
      </div>

      {/* Total Discount */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">Total Discount</div>
          <Info size={14} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
        <div className="text-xl font-semibold">
          ₹{formatCurrency(meta.totalDiscount)}
        </div>
      </div>

    </div>
  );
}
