import { create, all } from 'mathjs';
const math = create(all, { implicit: 'show' });
import NewtonRaphson from './NewtonRaphson.js';

export default class Graphical {
    constructor(start, end, epsilon, equation) {
        this.start = start;
        this.end = end;
        this.epsilon = epsilon;
        this.equation = equation;
        this.node = math.parse(this.equation).compile();
    }

    f(x) {
        return this.node.evaluate({ x: Number(x) });
    }

    calculate() {
        const history = [];
        let h = 1.0;
        const reduction_factor = 10;
        const exact_root = new NewtonRaphson(this.start, this.equation, this.epsilon).calculate().x1;

        let x = this.start;
        let fx = this.f(x);
        let bracket_left = this.start;
        let bracket_right = this.end;

        history.push({
            iterations: 0,
            x,
            fx,
            errorPercent: Math.abs((x - exact_root) / exact_root) * 100,
        });

        let iterations = 0;

        while (h > this.epsilon && iterations < 1000) {
            iterations++;
            let nextX = x + h;
            if (nextX > bracket_right) break;

            let nextFX = this.f(nextX);
            const errorPercent = Math.abs((nextX - exact_root) / exact_root) * 100;

            history.push({ iterations, x: nextX, fx: nextFX, errorPercent });

            // Check for sign change
            if (fx * nextFX < 0) {
                bracket_left = x;
                bracket_right = nextX;
                h /= reduction_factor;
                fx = this.f(bracket_left);
                x = bracket_left;
                continue;
            }

            x = nextX;
            fx = nextFX;

            if (bracket_right - bracket_left < this.epsilon) break;
        }

        const root = (bracket_left + bracket_right) / 2;
        const fxm = this.f(root);

        return { root, fxm, iterations, history };
    }
}

// let test = new Graphical(2, 4, 1e-6, 'x ^ 12 - 1265256');
// let result = test.calculate();
// console.log(result.history)