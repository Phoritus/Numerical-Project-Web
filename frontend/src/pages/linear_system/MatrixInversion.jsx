import MatrixComponent from "../../components/matrixComponent";
import MatrixInversionSolver from '../../numerical/linear_algebra/MatrixInversion.js'
import MatrixInversionLatexResult from '../../components/latex_result/linear_algebra/MatrixInversionLatexResult.jsx';
import { matrixInversionExample } from '../../numerical/examples/linearAlgebra_api.js';

const MatrixInversion = () => {
  return (
    <MatrixComponent
      solverClass={MatrixInversionSolver}
      LatexResultComponent={MatrixInversionLatexResult}
      title="Matrix Inversion Method"
      exampleApiFunction={matrixInversionExample}
    />
  )
}

export default MatrixInversion;