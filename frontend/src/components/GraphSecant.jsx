import PlotTangent from './GraphTangent';
import { create, all } from 'mathjs';
const math = create(all, {});

class PlotSecant extends PlotTangent {
  getPlotData() {
    const { equation, secantData = [] } = this.props;

    if (!equation || equation.trim() === '' || secantData.length === 0) {
      return [];
    }

    const node = math.parse(equation);
    const compiled = node.compile();

    const step = 0.05;
    const range = 10;
    const dataX = Array.from({ length: 400 }, (_, i) => -range + i * step);
    const dataY = dataX.map(x => compiled.evaluate({ x }));

    return [
      {
        x: dataX,
        y: dataY,
        type: 'scatter',
        mode: 'lines',
        name: 'f(x)',
        line: { color: '#4285F4', width: 3 },
      },

      ...secantData.map((p, i) => {
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
          name: `Secant ${i}`,
          line: { color: 'red', width: 2 },
          marker: { color: 'black', size: 6 },
        };
      }),
    ];
  }
}

export default PlotSecant;
