import MatrixComponent from '../../components/matrixComponent';
import GaussEliminationSolver from '../../numerical/linear_algebra/GaussElimination.js';
import GaussEliminationLatexResult from '../../components/latex_result/linear_algebra/GaussEliminationLatexResult.jsx';

const GaussElimination = () => (
  <MatrixComponent
    solverClass={GaussEliminationSolver}
    LatexResultComponent={GaussEliminationLatexResult}
    title="Gaussian Elimination"
  />
);

export default GaussElimination;
