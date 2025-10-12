import { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import katex from "katex";

export default function GaussEliminationLatexResult({ solution }) {

  const conclusionRef = useRef(null);
  useEffect(() => {
    if (!solution || !solution.solution) return;
    const { solution: sol } = solution;

    // Render conclusion
    if (conclusionRef.current) {
      const resultLatex = sol
        .map((val, i) => `x_{${i + 1}} = ${val.toFixed(6)}`)
        .join(",\\ ");
      katex.render(
        `\\therefore \\; ${resultLatex}`,
        conclusionRef.current,
        { displayMode: true, throwOnError: false }
      );
    }
  }, [solution]);

  return (
    <div className="text-white">
      {/* Conclusion */}
      <div
        ref={conclusionRef}
        className="mt-8 text-center text-lg font-semibold"
      />
    </div>
  );
}