import Plotly from 'plotly.js-dist-min'
import React from "react";
import { create, all } from "mathjs";

const math = create(all);

class PlotOnePoint extends React.Component {
  plotRef = React.createRef();

  componentDidMount() {
    this.renderPlot();
  }

  componentDidUpdate() {
    this.renderPlot();
  }

  getPlotData() {
    const { result, equation } = this.props;

    if (!result || !result.iterationPath || result.iterationPath.length === 0) {
      return [];
    }

    const pathX = result.iterationPath.map(p => p.x);
    const pathY = result.iterationPath.map(p => p.y);

    const minX = Math.min(...pathX);
    const maxX = Math.max(...pathX);
    const minY = Math.min(...pathY);
    const maxY = Math.max(...pathY);

    const paddingY = (maxY - minY) * 0.3 || 1;
    const paddingX = (maxX - minX) * 0.3 || 1;


    const xRange = [];
    const step = (maxX - minX + 2 * paddingX) / 100;
    for (let x = minX - paddingX; x <= maxX + paddingX; x += step) {
      xRange.push(x);
    }

    let gxValues = [];
    try {
      const node = math.parse(equation);
      const compiled = node.compile();
      gxValues = xRange.map(x => {
        const val = compiled.evaluate({ x });

        if (val < minY - paddingY || val > maxY + paddingY) {
          return null; // Skip extreme values
        }
        return val;
      });
    } catch {
      gxValues = xRange.map(() => null);
    }

    const traces = [
      // Line y = x
      {
        x: [minX - paddingX, maxX + paddingX],
        y: [minX - paddingX, maxX + paddingX],
        type: 'scatter',
        mode: 'lines',
        name: 'y = x',
        line: { color: '#4285F4', width: 2 },
      },

      // Line y = g(x)
      {
        x: xRange,
        y: gxValues,
        type: 'scatter',
        mode: 'lines',
        name: 'g(x)',
        line: { color: '#34A853', width: 2 },
      },

      // Iteration path
      {
        x: pathX,
        y: pathY,
        type: 'scatter',
        mode: 'lines',
        name: 'One-Point',
        line: { color: 'red', width: 2 },
      }
    ];

    return traces;
  }

  renderPlot() {
    if (this.plotRef.current) {
      const { result } = this.props;

      // Guard against null or missing iterationPath
      if (!result || !result.iterationPath || result.iterationPath.length === 0) {
        // Clear plot if no data
        Plotly.purge(this.plotRef.current);
        return;
      }

      // Dynamically set y-axis range based on iteration path
      const pathY = result.iterationPath.map(p => p.y);
      const minY = Math.min(...pathY);
      const maxY = Math.max(...pathY);
      const paddingY = (maxY - minY) * 0.3 || 1;

      Plotly.newPlot(
        this.plotRef.current,
        this.getPlotData(),
        {
          xaxis: { title: "x" },
          yaxis: {
            title: "y",
            range: [minY - paddingY, maxY + paddingY] // Dynamic range
          },
          margin: { t: 50, l: 50, r: 30, b: 50 },
          height: 500,
          dragmode: 'pan'
        },
        {
          responsive: true,
          scrollZoom: true,
          modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d'],
          displaylogo: false
        }
      );
    }
  }

  render() {
    const { result } = this.props;

    return (
      <div className="flex justify-center items-center p-6">
        <div className="w-full bg-white shadow-lg rounded-2xl p-4">
          {!result || !result.iterationPath || result.iterationPath.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-lg">
              No data to display. Please calculate first.
            </div>
          ) : (
            <div ref={this.plotRef} style={{ width: "100%", height: "100%" }} />
          )}
        </div>
      </div>
    );
  }
}

export default PlotOnePoint;