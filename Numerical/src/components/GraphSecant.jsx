import PlotTangent from './GraphTangent';

class PlotSecant extends PlotTangent {
  getPlotData() {
    const { dataX, dataY, secantData } = this.props;
    
    return [
      {
        x: dataX,
        y: dataY,
        type: 'scatter',
        mode: 'lines',
        name: 'f(x)',
        line: { color: '#4285F4', width: 3 },
      },
      ...(secantData.map((p, i) => {
        const { x0, x1, fx0, fx1 } = p;
        
        let xIntercept = null;
        if (fx1 - fx0 !== 0) {
          xIntercept = x1 - (fx1 * (x1 - x0)) / (fx1 - fx0);
        }
        
        const xPoints = xIntercept !== null ? [x0, x1, xIntercept] : [x0, x1];
        const yPoints = xIntercept !== null ? [fx0, fx1, 0] : [fx0, fx1];
        
        return {
          x: xPoints,
          y: yPoints,
          type: 'scatter',
          mode: 'lines+markers',
          name: `f'(x${i})`,
          line: { color: 'red', width: 2 },
          marker: { color: 'black', size: 6 },
        };
      }))
    ];
  }
}

export default PlotSecant;