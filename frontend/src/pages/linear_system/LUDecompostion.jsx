import LUDecomposition from "../../numerical/linear_algebra/LUDecompostion.js";
import MatrixComponent from "../../components/matrixComponent.jsx";
import LULatexResult from "../../components/latex_result/linear_algebra/LULatexResult.jsx";

const LUDecompostionPage = () => {
  return (
    <MatrixComponent
      title="LU Decomposition Method"
      solverClass={LUDecomposition}
      LatexResultComponent={LULatexResult}
    />
  )
};

export default LUDecompostionPage;
