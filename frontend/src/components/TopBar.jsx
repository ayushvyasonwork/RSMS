import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FiltersDropdown from "./FiltersDropdown";
import { RotateCcw } from "lucide-react";
import {
  toggleFilter,
  setMultipleFilters,
  setSorting,
  resetAllFilters,
  selectSorting,
} from "../store/slices/filtersSlice";

export default function TopBar({ topFilters, filterValues }) {
  const dispatch = useDispatch();
  const { sortBy, sortOrder } = useSelector(selectSorting);

  const handleToggleFilter = (key, value) => {
    // if value is a string, it's a single filter toggle
    if (typeof value === "string") {
      dispatch(toggleFilter({ key, value }));
    } else {
      // if value is an object (like date range), use setMultipleFilters
      dispatch(setMultipleFilters(value));
    }
  };

  const handleSortChange = (field, order) => {
    dispatch(setSorting({ sortBy: field, sortOrder: order }));
  };

  const handleReset = () => {
    dispatch(resetAllFilters());
  };
  return (
    <div className="flex items-center justify-between mb-4">
      {/* LEFT SIDE — Reset + Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* RESET BUTTON */}
        <button
          onClick={handleReset}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 
             hover:bg-gray-200 border border-gray-200 text-gray-700"
        >
          <RotateCcw size={18} className="text-gray-600" />
        </button>

        {/* Filters */}
        <FiltersDropdown
          label="Customer Region"
          options={topFilters.regions || []}
          selected={filterValues.regions || []}
          onToggle={(v) => handleToggleFilter("regions", v)}
        />
        <FiltersDropdown
          label="Gender"
          options={topFilters.genders || []}
          selected={filterValues.genders || []}
          onToggle={(v) => handleToggleFilter("genders", v)}
        />
        <FiltersDropdown
          label="Age Range"
          options={["<20", "20-30", "30-40", "40+"]}
          selected={filterValues.ageRange || []}
          onToggle={(v) => handleToggleFilter("ageRange", v)}
        />
        <FiltersDropdown
          label="Product Category"
          options={topFilters.categories || []}
          selected={filterValues.categories || []}
          onToggle={(v) => handleToggleFilter("categories", v)}
        />
        <FiltersDropdown
          label="Tags"
          options={topFilters.tags || []}
          selected={filterValues.tags || []}
          onToggle={(v) => handleToggleFilter("tags", v)}
        />
        <FiltersDropdown
          label="Payment Method"
          options={topFilters.paymentMethods || []}
          selected={filterValues.payment || []}
          onToggle={(v) => handleToggleFilter("payment", v)}
        />
        <FiltersDropdown
          label="Date"
          dateMode
          selectedDateRange={filterValues}
          onChangeDate={(k, v) => handleToggleFilter(k, v)}
        />
      </div>

      {/* RIGHT SIDE — Sort Dropdown */}
      {/* RIGHT SIDE — Sort Dropdown */}
      {/* SORT BOX */}
      {/* SORT BOX */}
      <div className="flex items-center">
        <div
          className="flex items-center bg-gray-100 border border-gray-200 
                  rounded-lg px-3 py-2 text-sm text-gray-700"
        >
          <span className="mr-2 whitespace-nowrap">Sort By:</span>

          <select
            value={`${sortBy}_${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("_");
              handleSortChange(field, order);
            }}
            className="bg-gray-100 outline-none text-gray-800"
          >
            <option value="date_desc">Date — Newest First</option>
            <option value="date_asc">Date — Oldest First</option>

            <option value="quantity_desc">Quantity — High to Low</option>
            <option value="quantity_asc">Quantity — Low to High</option>

            <option value="customerName_asc">Customer Name — A → Z</option>
            <option value="customerName_desc">Customer Name — Z → A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
