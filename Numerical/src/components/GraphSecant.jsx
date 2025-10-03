import PlotTangent from './GraphTangent';

class PlotSecant extends PlotTangent {
  getPlotData() {
    const { dataX, dataY, secantData} = this.props;
    return [
      {
        x: dataX,
        y: dataY,
        type: 'scatter',
        mode: 'lines',
        name: 'f(x)',
        line: { color: '#4285F4', width: 3 },
      },
      // Points of Secant
      ...(secantData.map((p, i) => ({
        x: [p.x0, p.x1],
        y: [p.fx0, p.fx1],
        type: 'scatter',
        mode: 'lines+markers',
        name: `f'(x${i})`,
        line: { color: 'red', width: 2 },
        marker: { color: 'black', size: 6 },
      }))) || []
    ];
  }

}

export default PlotSecant;