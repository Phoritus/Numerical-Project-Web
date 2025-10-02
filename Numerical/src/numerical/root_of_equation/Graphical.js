import { create, all } from 'mathjs';
const math = create(all, { implicit: 'show' });

export default class Graphical {
    constructor(start, end, equation) {
        this.start = start;
        this.end = end;
        this.equation = equation;
        this.node = math.parse(this.equation).compile();

    }

    f(x) {
        return this.node.evaluate({ x: Number(x) });
    }

    calculate(step = 0.000001) {
        let history = [];
        let y = null, iteration = 0, errorPercent = null;
        for (let x = this.start; x <= this.end; x++) {
            y = this.f(x);

            if (x > 0) {
                let prevY = this.f(x - 1);
                if (prevY * y <= 0) {
                    this.start = x - 1;
                    this.end = x;
                    break;
                }
            }
        }

        let bestXm = null;
        let prevY = null;
        for (let x = this.start; x <= this.end; x += step) {
            y = this.f(x);
            if (iteration > 0) {
                prevY = this.f(x - step);
                errorPercent = Math.abs((y - prevY) / y) * 100;
            }

            if (iteration >= 1000) break;

            if (Math.abs(prevY - y) < 1e-6) {
                bestXm = x;
                break;
            }
            iteration++;
            history.push({ iteration, xm: x, fxm: y, errorPercent });
        }

        return {
            root: bestXm === null ? history.at(-1).xm : bestXm,
            iterations: iteration,
            fxm: this.f(bestXm),
            history,
        };
    }
}

// let test = new Graphical(3.22489, 4, 'x ^ 12 - 1265256');
// let result = test.calculate();
// console.log(result.root, result.fxm);