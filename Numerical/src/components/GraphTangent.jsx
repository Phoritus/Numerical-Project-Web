import Plot from "react-plotly.js";
import React from "react";

class PlotTangent extends React.Component {

  getPlotData() {
    const { dataX, dataY, resultX, resultY, tangentLineData } = this.props;
    return [
      // Function Line
      {
        x: dataX,
        y: dataY,
        type: "scatter",
        mode: "lines",
        name: 'f(x)',
        line: { color: "#4285F4", width: 3 },
      },

      // Point of Tangent
      {
        x: resultX,
        y: resultY,
        type: "scatter",
        mode: "markers",
        marker: { color: "green", size: 6 },
      },

      // Tangent Line
      ...tangentLineData?.history.map((p, i) => ({
        x: [p.xCurrent, p.nextX],
        y: [p.fxCurrent, 0],
        type: "scatter",
        mode: "lines+markers",
        name: `f'(x${i})`,
        line: { color: "red", width: 2 },
        marker: { color: "black", size: 6 },
      })) || []
    ]


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
              dragmode: 'pan'
            }}
            style={{ width: "100%", height: "100%" }}
            config={
              {
                responsive: true,
                scrollZoom: true,
                modeBarButtonsToRemove: ['zoom2d'],
                
              }
            }
          />
        </div>
      </div>
    );
  }
}

export default PlotTangent;