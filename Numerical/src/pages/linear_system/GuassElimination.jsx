import MatrixComponent from '../../components/matrixComponent';
import GuassEliminationSolver from '../../numerical/linear_algebra/GuassElimination.js'
import GuassEliminationLatexResult from '../../components/latex_result/linear_algebra/GuassEliminationLatexResult.jsx'

const GuassElimination = () => {
  return (
    <MatrixComponent
      solverClass={GuassEliminationSolver}
      LatexResultComponent={GuassEliminationLatexResult}
      title="Gaussian Elimination"
    />
  )
}

export default GuassElimination;
