import { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import katex from "katex";

const matrixToAugmented = (A, B) => {
  const rows = A.map((row, i) => {
    const left = row.map(v => v.toFixed(3)).join(" & ");
    return `${left} & ${B[i].toFixed(3)}`;
  }).join(" \\\\ ");
  return `\\left[\\begin{array}{${'c'.repeat(A[0].length)}|c}${rows}\\end{array}\\right]`;
};

const GaussJordanLatexResult = ({ solution }) => {
  const headerRef = useRef(null);
  const stepsRefs = useRef([]);
  const conclusionRef = useRef(null);

  useEffect(() => {
    if (!solution) return;

    // Header
    if (headerRef.current) {
      katex.render(
        "\\textbf{Gauss–Jordan Elimination}",
        headerRef.current,
        { displayMode: false, throwOnError: false }
      );
    }

    // Render steps with ⇒
    solution.steps.forEach((step, index) => {
      if (stepsRefs.current[index]) {
        const latex = `${matrixToAugmented(step.matrix, step.vector)} \\quad \\Rightarrow \\quad ${step.description}`;
        katex.render(latex, stepsRefs.current[index], {
          displayMode: true,
          throwOnError: false,
        });
      }
    });

    // Render final result
    if (conclusionRef.current && solution.vector) {
      const resultLatex = solution.vector
        .map((val, i) => `x_{${i + 1}} = ${val.toFixed(6)}`)
        .join(",\\ ");
      katex.render(
        `\\therefore \\; ${resultLatex}`,
        conclusionRef.current,
        { displayMode: true, throwOnError: false }
      );
    }
  }, [solution]);

  if (!solution) return null;

  return (
    <div className="p-6 text-white">
      {/* Header */}
      <h2 ref={headerRef} className="text-left mb-6 text-xl" />

      {/* Steps */}
      <div className="space-y-6">
        {solution.steps.map((_, index) => (
          <div
            key={index}
            ref={(el) => (stepsRefs.current[index] = el)}
          />
        ))}
      </div>

      {/* Conclusion */}
      <div
        ref={conclusionRef}
        className="mt-8 text-center text-lg font-semibold"
      />
    </div>
  );
};

export default GaussJordanLatexResult;
