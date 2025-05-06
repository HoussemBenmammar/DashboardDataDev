import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTable } from "react-table";
import dayjs from "dayjs";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a9a9a9"];

const DataVisualizer = ({ rawData }) => {
  const [category, setCategory] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // Apply filters
  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      const inCategory = category ? item.category === category : true;
      const inDateRange =
        dateRange.from && dateRange.to
          ? dayjs(item.date).isAfter(dayjs(dateRange.from)) &&
            dayjs(item.date).isBefore(dayjs(dateRange.to))
          : true;
      return inCategory && inDateRange;
    });
  }, [rawData, category, dateRange]);

  // Dynamic columns for table
  const columns = useMemo(
    () =>
      Object.keys(rawData[0] || {}).map((key) => ({
        Header: key,
        accessor: key,
      })),
    [rawData]
  );

  const tableInstance = useTable({ columns, data: filteredData });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Visualisation des données</h2>

      {/* Filtres */}
      <div className="flex gap-4 mb-4">
        <select
          className="border rounded px-2 py-1"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {[...new Set(rawData.map((d) => d.category))].map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="date"
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, from: e.target.value }))
          }
          className="border rounded px-2 py-1"
        />
        <input
          type="date"
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, to: e.target.value }))
          }
          className="border rounded px-2 py-1"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="value" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={filteredData}
              dataKey="value"
              nameKey="category"
              outerRadius={100}
              label
            >
              {filteredData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto max-h-[400px] border rounded">
        <table
          {...getTableProps()}
          className="min-w-full table-auto text-sm text-left"
        >
          <thead className="bg-gray-100">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-3 py-2 font-medium"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-50">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="px-3 py-1 border-t">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataVisualizer;
