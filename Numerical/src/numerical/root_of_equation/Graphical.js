import { create, all } from 'mathjs';
const math = create(all, { implicit: 'show' });

export default class Graphical {
    constructor(start, end, equation) {
        this.start = start;
        this.end = end;
        this.equation = equation;
        this.node = math.parse(this.equation);
    }

    f(x) {
        return this.node.evaluate({ x });
    }

    calculate(step = 0.001) {
        const samples = [];
        for (let x = this.start; x <= this.end; x = Number((x + step).toFixed(12))) {
            samples.push({ x, y: this.f(x) });
        }

        const history = [];
        let error = null;
        for (let i = 0; i < samples.length - 1; i++) {
            const xm = (samples[i].x + samples[i + 1].x) / 2;
            const fxm = this.f(xm);
            if (i > 0) {
                const prevXm = history[history.length - 1].xm;
                if (xm !== 0) {
                    error = Math.abs((xm - prevXm) / xm) * 100; // relative percent
                } else {
                    error = null;
                }
            }
            history.push({ iteration: i, xm, fxm, errorPercent: error });

            const y1 = samples[i].y;
            const y2 = samples[i + 1].y;
            const hasRoot = (y1 >= 0 && y2 <= 0) || (y1 <= 0 && y2 >= 0);
            if (hasRoot) {
                return {
                    root: xm,
                    iterations: i + 1,
                    fxm,
                    history,
                    converged: true,
                    method: 'graphical'
                };
            }
        }
        return {
            root: null,
            iterations: history.length,
            fxm: null,
            history,
            converged: false,
            message: 'Root not found in the given interval.'
        };
    }
}
