import React from "react";
import Plot from "react-plotly.js";
import { create, all } from "mathjs";

const math = create(all, {});

class PlotTangent extends React.Component {
  getPlotData() {
    const { equation, x0, result } = this.props;

    // If no equation or result, return empty data
    if (!equation || !result || !result.history) return [];

    const history = result.history;
    const xs = history.map((p) => p.xCurrent);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    // Create gaps around x0 for better visualization
    const padding = Math.max(1, Math.min(3, 5 / (Math.abs(x0) + 1)));
    const step = 0.05;
    const functionX = Array.from(
      { length: Math.ceil(((maxX - minX) + 2 * padding) / step) + 1 },
      (_, i) => (minX - padding) + i * step
    );

    // Calculate functionY values
    let functionY = [];
    try {
      const node = math.parse(equation);
      const compiled = node.compile();
      functionY = functionX.map((x) => compiled.evaluate({ x }));
    } catch {
      functionY = functionX.map(() => null);
    }

    // Return data for plot
    return [
      // Main function line
      {
        x: functionX,
        y: functionY,
        type: "scatter",
        mode: "lines",
        name: "f(x)",
        line: { color: "#4285F4", width: 3 },
      },
      // Points for each iteration of Newton-Raphson
      {
        x: history.map((p) => p.xCurrent),
        y: history.map((p) => p.fxCurrent),
        type: "scatter",
        mode: "markers+text",
        name: "Iterations",
        marker: { color: "black", size: 5 },
        text: history.map((p, i) => `x${i}`),
        textposition: "top center",
      },
      // Tangent lines for each iteration
      ...history.map((p, i) => ({
        x: [p.xCurrent, p.nextX],
        y: [p.fxCurrent, 0],
        type: "scatter",
        mode: "lines+markers",
        name: `Tangent ${i}`,
        line: { color: "red", width: 2 },
        marker: { color: "black", size: 5 },
      })),
    ];
  }

  render() {
    const { graphName } = this.props;

    return (
      <div className="flex justify-center items-center p-6">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {graphName}
          </h2>
          <Plot
            data={this.getPlotData()}
            layout={{
              xaxis: { title: "X Axis" },
              yaxis: { title: "Y Axis" },
              margin: { t: 50, l: 50, r: 30, b: 50 },
              height: 500,
              dragmode: "pan",
              plot_bgcolor: "#f9fafb",
              paper_bgcolor: "#f9fafb",
              
            }}
            style={{ width: "100%", height: "100%" }}
            config={{
              responsive: true,
              scrollZoom: true,
              displaylogo: false,
              modeBarButtonsToRemove: ["zoom2d", "lasso2d"],
            }}
          />
        </div>
      </div>
    );
  }
}

export default PlotTangent;