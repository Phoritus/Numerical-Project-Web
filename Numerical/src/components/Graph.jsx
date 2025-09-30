import React from "react";
import Plot from "react-plotly.js";

const PlotWithTailwind = ({ dataX, dataY }) => {
  return (
    <div className="flex justify-center items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Example Plotly Graph
        </h2>
        <Plot
          data={[
            {
              x: dataX,
              y: dataY,
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "red" },
              line: { color: "blue" },
            },
          ]}
          layout={{
            autosize: true,
            title: { text: "My First Plotly Graph", font: { size: 20 } },
            xaxis: { title: "X Axis" },
            yaxis: { title: "Y Axis" },
            margin: { t: 50, l: 50, r: 30, b: 50 },
          }}
          style={{ width: "100%", height: "100%" }}
          useResizeHandler={true}
        />
      </div>
    </div>
  );
};

export default PlotWithTailwind;