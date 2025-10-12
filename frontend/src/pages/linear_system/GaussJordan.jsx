import MatrixComponent from "../../components/matrixComponent";
import GaussJordanSolver from '../../numerical/linear_algebra/GaussJordan.js';
import GaussJordanLatexResult from '../../components/latex_result/linear_algebra/GaussJordanLatexResult.jsx';
import { gaussJordanExample } from '../../numerical/examples/linearAlgebra_api.js';

const GaussJordan = () => (
  <MatrixComponent
    solverClass={GaussJordanSolver}
    LatexResultComponent={GaussJordanLatexResult}
    title="Gauss-Jordan Elimination"
    exampleApiFunction={gaussJordanExample}
  />
);

export default GaussJordan;