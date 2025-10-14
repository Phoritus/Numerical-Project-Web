import LUDecomposition from "../../numerical/linear_algebra/LUDecompostion.js";
import MatrixComponent from "../../components/matrixComponent.jsx";
import LULatexResult from "../../components/latex_result/linear_algebra/LULatexResult.jsx";
import { luDecompositionExample } from "../../numerical/examples/linearAlgebra_api.js";

const LUDecompostionPage = () => {
  return (
    <MatrixComponent
      title="LU Decomposition Method"
      solverClass={LUDecomposition}
      LatexResultComponent={LULatexResult}
      exampleApiFunction={luDecompositionExample}
    />
  )
};

export default LUDecompostionPage;
