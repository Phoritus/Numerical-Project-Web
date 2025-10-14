import MatrixComponent from "../../components/matrixComponent.jsx";
import CholeskySolver from "../../numerical/linear_algebra/Cholesky.js";
import { choleskyExample } from "../../numerical/examples/linearAlgebra_api.js";

const Cholesky = () => {
  return (
    <MatrixComponent
      title="Cholesky Decomposition Method"
      solverClass={CholeskySolver}
      exampleApiFunction={choleskyExample}
    />
  )
}

export default Cholesky;