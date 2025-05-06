import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { useTable } from "react-table";

const DataImporter = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let parsedData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      // Nettoyage basique : suppression des lignes entièrement vides
      parsedData = parsedData.filter((row) =>
        Object.values(row).some((value) => value !== "")
      );

      setData(parsedData);

      const cols = Object.keys(parsedData[0] || {}).map((key) => ({
        Header: key,
        accessor: key,
      }));
      setColumns(cols);
    };

    reader.readAsBinaryString(file);
  };

  const sendToBackend = async () => {
    try {
      await axios.post("/api/data/upload/", { data });
      alert("Données envoyées avec succès.");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'envoi des données.");
    }
  };

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="p-4 rounded-xl shadow-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Importation de données</h2>
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
      />
      {data.length > 0 && (
        <>
          <div className="mt-6 overflow-x-auto max-h-[400px] border rounded">
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
                        <td
                          {...cell.getCellProps()}
                          className="px-3 py-1 border-t"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button
            onClick={sendToBackend}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enregistrer dans la base
          </button>
        </>
      )}
    </div>
  );
};

export default DataImporter;
