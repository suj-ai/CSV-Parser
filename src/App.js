import { useState } from "react";
import Papa from "papaparse";
import GeoJson from "./assets/geoJson.json";
import "./App.css";

function App() {
  const [parsedFile, setParsedFile] = useState([]);
  const handleFile = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setParsedFile(result.data);
      },
    });
  };

  console.log("Papa.parse() called", parsedFile);

  const handleDownload = () => {
    const finalArray = [];
    if (parsedFile) {
      parsedFile?.map((el) =>
        GeoJson.features.map((temp) => {
          if (temp?.properties?.FIELD_ID === el.clientReference) {
            finalArray.push({
              ...el,
              ["field.boundary.fileName"]: temp?.geometry?.coordinates,
            });
          }
        })
      );
    }

    var csvData = new Blob([Papa.unparse(finalArray)], {
      type: "text/csv;charset=utf-8;",
    });
    var csvURL = window.URL.createObjectURL(csvData);
    var tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", "AgriCapture.csv");
    tempLink.click();
  };

  return (
    <>
      <input type="file" onChange={handleFile} />
      <button onClick={handleDownload}>Download CSV</button>
    </>
  );
}

export default App;
