import MatrixComponent from "../../components/matrixComponent";
import CramerSolver from '../../numerical/linear_algebra/Cramer.js'
import CramerLatexResult from '../../components/latex_result/linear_algebra/CramerLatexResult.jsx'

const Cramer = () => {
  return (
    <MatrixComponent
      solverClass={CramerSolver}
      LatexResultComponent={CramerLatexResult}
      title="Cramer's Rule"
    />
  )
}

export default Cramer;