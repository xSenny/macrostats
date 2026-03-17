import { useState } from "react";
import "./App.css";
import Papa from "papaparse";
import { calculate1RepMax, maxValues } from "./lib/formulas";

function App() {
  const [uploadedCSV, setUploadedCSV] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<
    Array<{
      Date: string;
      "Workout Duration": string;
      Workout: string;
      Exercise: string;
      "Set Type": string;
      "Weight (kg)": string;
      Reps: string;
      RIR: string;
      Duration: string;
      "Distance short (m)": string;
      "Distance long (km)": string;
    }>
  >();
  const [repMaxes, setRepMaxes] = useState<
    { workoutDate: string; exercies: { name: string; repMax: number }[] }[]
  >([]);

  const handleParseCSV = () => {
    if (!uploadedCSV) return;

    Papa.parse(uploadedCSV, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const filteredData = (result.data as any[]).filter(
          (r) => r["Set Type"] !== "Warm-Up Set",
        );

        setCsvData(filteredData);

        const uniqueDates = Array.from(
          new Set(filteredData.map((r) => r.Date)),
        );

        const newRepMaxes = uniqueDates.map((date) => {
          const rowsForDate = filteredData.filter((r) => r.Date === date);

          const exerciseMap = new Map<string, number>();

          rowsForDate.forEach((r) => {
            const name = r.Exercise;
            const currentMax = calculate1RepMax({
              weight: r["Weight (kg)"],
              reps: r["Reps"],
              rir: r["RIR"],
            });

            if (!exerciseMap.has(name) || currentMax > exerciseMap.get(name)!) {
              exerciseMap.set(name, currentMax);
            }
          });

          return {
            workoutDate: date,
            exercies: Array.from(exerciseMap.entries()).map(
              ([name, repMax]) => ({
                name,
                repMax,
              }),
            ),
          };
        });

        setRepMaxes(newRepMaxes);
      },
    });
  };

  return (
    <>
      <input
        type="file"
        onChange={(e) => setUploadedCSV(e.target.files?.[0] || null)}
      />

      <button onClick={handleParseCSV}>parse csv</button>
      {JSON.stringify(repMaxes, null, 2)}
    </>
  );
}

export default App;
