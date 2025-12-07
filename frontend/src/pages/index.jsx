// src/pages/index.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import SummaryCards from "../components/SummaryCards";
import SalesTable from "../components/SalesTable";
import Pagination from "../components/Pagination";
import { getSales, getFilters } from "../services/api";
import useDebounce from "../hooks/useDebounce";
import { buildQuery } from "../utils/query";
import { Search } from "lucide-react";
import {
  setSearch,
  setPage,
  selectSearch,
  selectFilters,
  selectSorting,
  selectPagination,
} from "../store/slices/filtersSlice";

export default function Home() {
  // Redux state and dispatch
  const dispatch = useDispatch();
  const search = useSelector(selectSearch);
  const values = useSelector(selectFilters);
  const { sortBy, sortOrder } = useSelector(selectSorting);
  const { page } = useSelector(selectPagination);
  
  const debounced = useDebounce(search, 350);

  const [topFilters, setTopFilters] = useState({});
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFilters()
      .then((res) => setTopFilters(res.data))
      .catch(() => {});
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildQuery({
        search: debounced || undefined,
        region: values.regions.length ? values.regions.join(",") : undefined,
        gender: values.genders.length ? values.genders.join(",") : undefined,
        ageMin: values.ageMin || undefined,
        ageMax: values.ageMax || undefined,
        category: values.categories.length
          ? values.categories.join(",")
          : undefined,
        tags: values.tags.length ? values.tags.join(",") : undefined,
        payment: values.payment.length ? values.payment.join(",") : undefined,
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
        sortBy,
        sortOrder,
        page,
        limit: 10,
      });

      const res = await getSales(params);
      const body = res.data;
      setData(body.data || []);
      setTotalPages(body.totalPages || 1);

      // computed meta for current page
      const totalUnits = (body.data || []).reduce(
        (s, x) => s + (Number(x.quantity) || 0),
        0
      );
      const totalAmount = (body.data || []).reduce(
        (s, x) => s + (Number(x.totalAmount) || 0),
        0
      );
      const totalDiscount = (body.data || []).reduce(
        (s, x) =>
          s + ((Number(x.totalAmount) || 0) - (Number(x.finalAmount) || 0)),
        0
      );
      setMeta({ totalUnits, totalAmount, totalDiscount });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debounced, values, page, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData, page]);

  return (
    <div className="flex w-screen">
      <Sidebar className="w-1/4" />
      <div className="flex-1 p-6 w-3/4 h-screen overflow-hidden flex flex-col bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Sales Management System</h2>
          {/* Search bar */}
          <div className="w-80 relative">
            <Search
              size={18}
              color="gray"
              strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              placeholder="Name, Phone no."
              className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm 
               focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-gray-100"
            />
          </div>
        </div>

        <TopBar
          topFilters={topFilters}
          filterValues={values}
        />

        <div className="w-1/2">
          <SummaryCards meta={meta} className="w-1/2" />
        </div>

        <div className="flex-1 overflow-auto mt-3">
          {loading ? (
            <div className="bg-white border border-gray-200 rounded p-6 text-center">
              Loading...
            </div>
          ) : (
            <SalesTable data={data} />
          )}
        </div>

        <div className="mt-3">
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => dispatch(setPage(p))}
          />
        </div>
      </div>
    </div>
  );
}
