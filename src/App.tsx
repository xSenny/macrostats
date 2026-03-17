import { useState } from "react";
import "./App.css";
import Papa from 'papaparse'

function App() {
  const [uploadedCSV, setUploadedCSV] = useState<File | null>(null);
  const [csvData, setCsvData] = useState(null)
  const handleParseCSV = () => {
    if (uploadedCSV === null) return;

    const filePath = URL.createObjectURL(uploadedCSV);
    Papa.parse(uploadedCSV, {
      complete: (result) => {
        setCsvData(result.data);
      },
      header: true,
    });
  };

  return (
    <>
      <input
        type="file"
        onChange={(e) => setUploadedCSV(e.target.files?.[0] || null)}
      />

      {JSON.stringify(csvData, null, 2)}

      <button onClick={handleParseCSV}>parse csv</button>
    </>
  );
}

export default App;
