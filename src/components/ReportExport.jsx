import React from "react";
import axios from "axios";

const ReportExport = ({ data, summary }) => {
  const download = async (endpoint, filename, type) => {
    const response = await axios.post(
      endpoint,
      type === "blob" ? data : summary,
      {
        responseType: "blob",
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl mt-6">
      <h2 className="text-xl font-semibold mb-4">Rapports & Export</h2>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => download("/api/report/pdf/", "rapport.pdf", "summary")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Télécharger rapport PDF
        </button>
        <button
          onClick={() => download("/api/export/csv/", "data.csv", "blob")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
        <button
          onClick={() => download("/api/export/xlsx/", "data.xlsx", "blob")}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>
      </div>
    </div>
  );
};

export default ReportExport;
