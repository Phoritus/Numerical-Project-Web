import MatrixComponent from '../../components/matrixComponent';
import GaussEliminationSolver from '../../numerical/linear_algebra/GaussElimination.js';
import GaussEliminationLatexResult from '../../components/latex_result/linear_algebra/GaussEliminationLatexResult.jsx';
import { gaussEliminationExample } from '../../numerical/examples/linearAlgebra_api.js';

const GaussElimination = () => (
  <MatrixComponent
    solverClass={GaussEliminationSolver}
    LatexResultComponent={GaussEliminationLatexResult}
    title="Gaussian Elimination"
    exampleApiFunction={gaussEliminationExample}
  />
);

export default GaussElimination;
