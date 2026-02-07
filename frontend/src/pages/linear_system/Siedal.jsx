import MatrixHaveInit from "../../components/matrixHaveInit";
import SiedalSolver from "../../numerical/linear_algebra/Siedal.js";  
import { gaussSeidelExample } from "../../numerical/examples/linearAlgebra_api.js";
import JacobiLatexResult from "../../components/latex_result/linear_algebra/JacobiLatexResult.jsx";
import { useRef } from "react";
import { useExample } from "../../hooks/useExample.js";

const Siedal = () => {
  
  const matrixRef = useRef(null);
  
  const { handleExample, loading: exampleLoading } = useExample(gaussSeidelExample, {
    ref: matrixRef,
    fields: {
      matrixSize: true,
      matrixA: true,
      vectorB: true,
      initialGuess: true,
    }
  })

  return (
    <MatrixHaveInit
      ref={matrixRef}
      title="Gauss-Seidel Iteration Method"
      solverClass={SiedalSolver}
      LatexResultComponent={JacobiLatexResult}
      onExample={handleExample}
      exampleLoading={exampleLoading}
    />
  )
}

export default Siedal;