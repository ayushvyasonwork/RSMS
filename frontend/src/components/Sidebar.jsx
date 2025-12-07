// src/components/Sidebar.jsx
import React, { useState } from "react";
import Icons from "./Icons";

function MenuItem({ icon: Icon, label, small }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
      {Icon && <Icon className="text-gray-600" size={18} />}
      <div>
        <div className="text-sm font-medium text-gray-800">{label}</div>
        {small && <div className="text-xs text-gray-400">{small}</div>}
      </div>
    </div>
  );
}

export default function Sidebar() {
  // dropdown toggles
  const [openServices, setOpenServices] = useState(false);
  const [openInvoices, setOpenInvoices] = useState(false);

  return (
    <aside className="bg-gray-100 border-r border-gray-200 min-h-screen p-4 w-56">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6 bg-white p-2 rounded-md">
        <div className="w-10 h-10 rounded-md bg-indigo-600 flex items-center justify-center text-white font-semibold">
          V
        </div>
        <div>
          <div className="text-sm font-semibold">Vault</div>
          <div className="text-xs text-gray-500">Anurag Yadav</div>
        </div>
      </div>

      {/* Main menu */}
      <div className="space-y-2">
        <MenuItem icon={Icons.Home} label="Dashboard" />
        <MenuItem icon={Icons.Grid} label="Nexus" />
        <MenuItem icon={Icons.User} label="Intake" />
      </div>

      {/* Services dropdown */}
      <div className="mt-6">
        <div
          onClick={() => setOpenServices(!openServices)}
          className="flex items-center justify-between cursor-pointer px-2 py-2 hover:bg-gray-200 rounded-md"
        >
          <span className="text-xs font-semibold text-gray-600">Services</span>
          <Icons.ChevronDown
            size={16}
            className={`text-gray-600 transition-transform ${
              openServices ? "rotate-180" : ""
            }`}
          />
        </div>

        {openServices && (
          <div className="mt-1 space-y-1 pl-3 border-l border-gray-300">
            <MenuItem icon={Icons.Circle} label="Pre-active" />
            <MenuItem icon={Icons.Circle} label="Active" />
            <MenuItem icon={Icons.Circle} label="Blocked" />
            <MenuItem icon={Icons.Circle} label="Closed" />
          </div>
        )}
      </div>

      {/* Invoices dropdown */}
      <div className="mt-6">
        <div
          onClick={() => setOpenInvoices(!openInvoices)}
          className="flex items-center justify-between cursor-pointer px-2 py-2 hover:bg-gray-200 rounded-md"
        >
          <span className="text-xs font-semibold text-gray-600">Invoices</span>
          <Icons.ChevronDown
            size={16}
            className={`text-gray-600 transition-transform ${
              openInvoices ? "rotate-180" : ""
            }`}
          />
        </div>

        {openInvoices && (
          <div className="mt-1 space-y-1 pl-3 border-l border-gray-300">
            <MenuItem icon={Icons.FileText} label="Proforma Invoices" />
            <MenuItem icon={Icons.FileText} label="Final Invoices" />
          </div>
        )}
      </div>
    </aside>
  );
}
