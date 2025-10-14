import MatrixComponent from "../../components/matrixComponent.jsx";
import CholeskySolver from "../../numerical/linear_algebra/Cholesky.js";
import { choleskyExample } from "../../numerical/examples/linearAlgebra_api.js";
import LULatexResult from "../../components/latex_result/linear_algebra/LULatexResult.jsx";

const Cholesky = () => {
  return (
    <MatrixComponent
      title="Cholesky Decomposition Method"
      solverClass={CholeskySolver}
      LatexResultComponent={LULatexResult}
      exampleApiFunction={choleskyExample}
    />
  )
}

export default Cholesky;