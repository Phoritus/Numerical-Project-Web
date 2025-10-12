import { useEffect, useRef } from "react";
import 'katex/dist/katex.min.css';
import katex from 'katex';

const matrixToString = (M) => {
  const rows = M.map(row => row.map(val => val.toFixed(6)).join(' & ')).join(' \\\\ ');
  return `\\left[\\begin{array}{${'c'.repeat(M[0].length)}}${rows}\\end{array}\\right]`;
}

const vectorToString = (V) => {
  const rows = V.map(val => val.toFixed(0)).join(' \\\\ ');
  return `\\left\\{\\begin{array}{c}${rows}\\end{array}\\right\\}`;
}

const MatrixInversionLatexResult = ({ solution }) => {
  const headerRef = useRef(null);
  const equationRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (!solution) return;

    const { A, B, inverseA, x } = solution;

    // Header
    if (headerRef.current) {
      katex.render(
        `\\begin{aligned} \\textrm{From } & Ax = B \\\\ \\textrm{Therefore } & A^{-1}B = x \\end{aligned}`,
        headerRef.current,
        { displayMode: true, throwOnError: false }
      );
    }

    // Equation: A^(-1) × B = {x_labels}
    if (equationRef.current && inverseA && B) {
      const invLatex = matrixToString(inverseA);
      const bLatex = vectorToString(B);
      const xLabels = `\\left\\{\\begin{array}{c}${B.map((_, i) => `x_${i+1}`).join(' \\\\ ')}\\end{array}\\right\\}`;
      
      katex.render(
        `${invLatex} ${bLatex} = ${xLabels}`,
        equationRef.current,
        { displayMode: true, throwOnError: false }
      );
    }

    // Result: x = (value1, value2, value3)
    if (resultRef.current && x) {
      const xValues = x.map(val => val.toFixed(6)).join(', ');
      const xLabels = x.map((_, i) => `x_${i+1}`).join(', ');
      
      katex.render(
        `\\therefore (${xLabels}) = (${xValues})`,
        resultRef.current,
        { displayMode: true }
      );
    }

  }, [solution]);

  if (!solution) return null;

  return (
    <div className="p-1 text-white text-center">
      <div ref={headerRef} className="text-lg mb-4"></div>
      <div ref={equationRef} className="my-4"></div>
      <div ref={resultRef} className="mt-5"></div>
    </div>
  )

}
export default MatrixInversionLatexResult;