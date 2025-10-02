import Plot from "react-plotly.js";

const PlotWithTailwind = ({ dataX, dataY, graphName }) => {
  return (
    <div className="flex justify-center items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {graphName}
        </h2>
        <Plot
          data={[
            {
              x: dataX,
              y: dataY,
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "red" , size: 6},
              line: { color: "blue", width: 1},
            },
          ]}
          layout={{
            xaxis: { title: "X Axis" },
            yaxis: { title: "Y Axis" },
            margin: { t: 50, l: 50, r: 30, b: 50 },
            height: 400,
          }}
          style={{ width: "100%", height: "100%" }}
          config={
            {
              responsive: true,
              scrollZoom: true,
            }
          }
        />
      </div>
    </div>
  );
};

export default PlotWithTailwind;