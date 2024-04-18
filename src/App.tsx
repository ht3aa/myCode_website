import { useEffect, useRef, useState } from "react";
import { FunctionsDataType } from "./lib/types";
import hljs from "highlight.js/lib/core";
import typeScript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/xt256.css";

hljs.registerLanguage("typescript", typeScript);

function App() {
  const [data, setData]: [Array<FunctionsDataType>, any] = useState([]);
  const [selectedFunc, setSelectedFunc]: [string, any] = useState("");
  const funcCode = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    const response = await fetch("http://localhost:3000/api");
    const data = await response.json();
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (funcCode.current && data.length > 0) {
      setSelectedFunc(data[0].body);
      funcCode.current.innerHTML = hljs.highlight(selectedFunc, { language: "typescript" }).value;
    }
  }, [data]);

  useEffect(() => {
    if (funcCode.current) {
      funcCode.current.innerHTML = hljs.highlight(selectedFunc, { language: "typescript" }).value;
    }
  }, [selectedFunc]);

  return (
    <div>
      <select
        onChange={(e) =>
          setSelectedFunc(e.target.value)
        }
      >
        {data.map((func: any) => (
          <option key={func.id} value={func.body}>
            {func.name}
          </option>
        ))}
      </select>

      <div className="h-[60vh] overflow-x-scroll">
        <pre>
          <code className="typescript" ref={funcCode}></code>
        </pre>
      </div>
     <button onClick={() => navigator.clipboard.writeText(selectedFunc)}>Copy</button> 
    </div>
  );
}

export default App;
