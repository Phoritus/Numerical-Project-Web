import MatrixComponent from "../../components/matrixComponent";
import CramerSolver from '../../numerical/linear_algebra/Cramer.js'
import CramerLatexResult from '../../components/latex_result/linear_algebra/CramerLatexResult.jsx'
import { cramerExample } from '../../numerical/examples/linearAlgebra_api.js';

const Cramer = () => {
  return (
    <MatrixComponent
      solverClass={CramerSolver}
      LatexResultComponent={CramerLatexResult}
      title="Cramer's Rule"
      exampleApiFunction={cramerExample}
    />
  )
}

export default Cramer;