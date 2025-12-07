// src/components/SalesTable.jsx
import React, { useState, useRef, useEffect } from "react";
import { CopyIcon } from "lucide-react";

function formatAmount(v) {
  if (v === undefined || v === null || v === "") return "-";
  return "₹" + Number(v).toFixed(2);
}

export default function SalesTable({ data = [], onRowClick }) {
  const [copiedPhone, setCopiedPhone] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleCopy(text) {
    if (!text || text === "-") return;

    navigator.clipboard.writeText(String(text));

    setCopiedPhone(String(text));

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setCopiedPhone(null);
      timeoutRef.current = null;
    }, 5000);
  }

  const cols = [
    { key: "transactionId", label: "Transaction ID", w: "w-40" },
    { key: "date", label: "Date", w: "w-36" },
    { key: "customerId", label: "Customer ID", w: "w-36" },
    { key: "customerName", label: "Customer name", w: "w-48" },
    { key: "phoneNumber", label: "Phone Number", w: "w-40" },
    { key: "gender", label: "Gender", w: "w-24" },
    { key: "age", label: "Age", w: "w-20" },
    { key: "productCategory", label: "Product Category", w: "w-40" },
    { key: "quantity", label: "Quantity", w: "w-24" },
    { key: "pricePerUnit", label: "Price/unit", w: "w-28" },
    { key: "discountPercentage", label: "Discount %", w: "w-28" },
    { key: "totalAmount", label: "Total Amount", w: "w-36" },
    { key: "finalAmount", label: "Final Amount", w: "w-36" },
    { key: "paymentMethod", label: "Payment Method", w: "w-36" },
    { key: "orderStatus", label: "Order Status", w: "w-32" },
    { key: "deliveryType", label: "Delivery Type", w: "w-32" },
    { key: "storeLocation", label: "Store Location", w: "w-36" },
    { key: "employeeName", label: "Employee name", w: "w-40" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-md h-full overflow-auto">
      <table className="min-w-max w-full table-auto">
        <thead>
          <tr>
            {cols.map((c) => (
              <th
                key={c.key}
                className={`text-left text-xs text-gray-600 px-4 py-3 ${c.w} sticky top-0 z-20 bg-gray-100`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={cols.length}
                className="p-6 text-center text-sm text-gray-500"
              >
                No results
              </td>
            </tr>
          )}

          {data.map((r, idx) => (
            <tr
              key={r._id || idx}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick && onRowClick(r)}
            >
              {cols.map((c) => {
                const raw = r[c.key];
                const val =
                  c.key === "date"
                    ? raw
                      ? new Date(raw).toLocaleDateString()
                      : "-"
                    : ["totalAmount", "finalAmount", "pricePerUnit"].includes(c.key)
                    ? formatAmount(raw)
                    : raw ?? "-";

                // 📌 PHONE NUMBER CELL
                if (c.key === "phoneNumber") {
                  const phoneText = raw ?? "-";
                  const isHidden = copiedPhone === String(phoneText);

                  return (
                    <td
                      key={c.key}
                      className={`px-4 py-3 text-sm text-gray-800 ${c.w}`}
                    >
                      <div className="flex items-center gap-3">
                        <span>{phoneText}</span>

                        {/* Hide icon while copied */}
                        {!isHidden && (
                          <CopyIcon
                            size={16}
                            className="text-gray-600 hover:text-black cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(phoneText);
                            }}
                          />
                        )}
                      </div>
                    </td>
                  );
                }

                // Normal cell
                return (
                  <td
                    key={c.key}
                    className={`px-4 py-3 text-sm text-gray-800 ${c.w}`}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
