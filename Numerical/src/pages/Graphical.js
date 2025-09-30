import { create, all, parse, re } from 'mathjs';
const math = create(all, {
    implicit: 'show'
});

export class Graphical {

    constructor(start, end, error, equation) {
        this.start = start;
        this.end = end;
        this.error = error;

        this.equation = equation;
        this.node = math.parse(this.equation);
    }

    f(x) {
        return this.node.evaluate({ x });
    }

    calculate() {
        let fXm, xM;
        let result = [];
        let final = [];

        for (let i = this.start; i <= this.end; i += 0.001) {
            let y = this.f(i);
            result.push({ x: i, y });
        }

        for (let i = 0; i < result.length - 1; i++) {
            xM = (result[i].x + result[i + 1].x) / 2;
            fXm = this.f(xM);
            final.push({ x: xM, y: fXm });
            if (result[i].y >= 0 && result[i + 1].y <= 0 || result[i].y <= 0 && result[i + 1].y >= 0) {
                return { root: xM, iterations: i + 1, history: final };
            }
        }
    }
}

let test = new Graphical(0, 7, 0.000001, "43x - 1");
console.log(test.calculate());