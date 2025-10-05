import { useEffect, useRef } from "react";
import 'katex/dist/katex.min.css';
import katex from 'katex';

const GaussJordanLatexResult = ({ solution }) => {
  const headerRef = useRef(null);
  const stepsRefs = useRef([]);
  const conclusionRef = useRef(null);

  useEffect(() => {
    if (!solution) return;
    if (headerRef.current) {
      headerRef.current.innerHTML = katex.renderToString("Gauss-Jordan Elimination", { throwOnError: false });
    }
    stepsRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.innerHTML = katex.renderToString(`Step ${index + 1}: ${solution.steps[index]}`, { throwOnError: false });
      }
    });
    if (conclusionRef.current) {
      conclusionRef.current.innerHTML = katex.renderToString(`Conclusion: ${solution.conclusion}`, { throwOnError: false });
    }
  }, [solution]);

  if (!solution) return null;

  return (
    <div>
      <h2 ref={headerRef}></h2>
      <div>
        {solution.steps.map((_, index) => (
          <div key={index} ref={el => stepsRefs.current[index] = el}></div>
        ))}
      </div>
      <div ref={conclusionRef}></div>
    </div>
  );
};

export default GaussJordanLatexResult;
