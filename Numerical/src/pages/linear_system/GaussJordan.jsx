import MatrixComponent from "../../components/matrixComponent";
import GaussJordanSolver from '../../numerical/linear_algebra/GaussJordan.js';
import GaussJordanLatexResult from '../../components/latex_result/linear_algebra/GaussJordanLatexResult.jsx';

const GaussJordan = () => (
  <MatrixComponent
    solverClass={GaussJordanSolver}
    LatexResultComponent={GaussJordanLatexResult}
    title="Gauss-Jordan Elimination"
  />
);

export default GaussJordan;
