import React, { useState } from "react";
import axios from "axios";

const DataAnalysis = ({ rawData }) => {
  const [stats, setStats] = useState(null);
  const [correlations, setCorrelations] = useState(null);
  const [anomalies, setAnomalies] = useState(null);

  const analyze = async () => {
    try {
      const [statsRes, corrRes, anomRes] = await Promise.all([
        axios.post("/api/analysis/stats/", rawData),
        axios.post("/api/analysis/correlation/", rawData),
        axios.post("/api/analysis/anomalies/", rawData),
      ]);
      setStats(statsRes.data);
      setCorrelations(corrRes.data);
      setAnomalies(anomRes.data);
    } catch (err) {
      alert("Erreur d’analyse");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Analyse de données</h2>
      <button
        onClick={analyze}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Lancer l’analyse
      </button>

      {stats && (
        <div>
          <h3 className="text-lg font-bold mt-4">Statistiques</h3>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(stats, null, 2)}
          </pre>
        </div>
      )}

      {correlations && (
        <div>
          <h3 className="text-lg font-bold mt-4">Corrélations</h3>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(correlations, null, 2)}
          </pre>
        </div>
      )}

      {anomalies && (
        <div>
          <h3 className="text-lg font-bold mt-4">Anomalies détectées</h3>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(anomalies, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DataAnalysis;
