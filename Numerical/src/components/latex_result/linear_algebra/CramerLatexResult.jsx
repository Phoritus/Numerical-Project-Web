import { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

// Utility to build a LaTeX vmatrix from a 2D numeric array
const matrixToVmatrix = (M) => {
  return `\\begin{vmatrix}` + M.map(row => row.join(' & ')).join(' \\\\ ') + `\\end{vmatrix}`;
};

const CramerLatexResult = ({ solution }) => {
  const headerRef = useRef(null);
  const detARef = useRef(null);
  const stepsRefs = useRef([]);
  const conclusionRef = useRef(null);

  useEffect(() => {
    if (!solution) return;

    // Header: Cramer's Rule formula
    if (headerRef.current) {
      try {
        katex.render(
          `\\text{From Cramer's Rule; } x_i = \\dfrac{\\det(A_i)}{\\det(A)}`,
          headerRef.current,
          { displayMode: true, throwOnError: false }
        );
      } catch (e) {
        headerRef.current.innerText = e.message;
      }
    }

    // det(A) section
    if (detARef.current) {
      try {
        katex.render(
          `\\det(A) = ${matrixToVmatrix(solution.matrixA)} = ${solution.detA}`,
          detARef.current,
          { displayMode: true, throwOnError: false }
        );
      } catch (e) {
        detARef.current.innerText = e.message;
      }
    }

    // Each x_i calculation
    solution.steps.forEach((step, idx) => {
      if (stepsRefs.current[idx]) {
        try {
          const latex = `x_{${step.index}} = \\dfrac{\\det(A_{${step.index}})}{\\det(A)} = \\dfrac{${matrixToVmatrix(step.matrixAi)}}{${step.detA}} = \\dfrac{${step.detAi}}{${step.detA}} = ${step.xi}`;
          
          katex.render(
            latex,
            stepsRefs.current[idx],
            { displayMode: true, throwOnError: false }
          );
        } catch (e) {
          stepsRefs.current[idx].innerText = e.message;
        }
      }
    });

    // Conclusion
    if (conclusionRef.current) {
      try {
        const solutionValues = solution.solutions.map(v => 
          Number.isInteger(v) ? v : v.toFixed(4)
        ).join(', ');

        const variables = solution.solutions.map((_, i) => `x_{${i + 1}}`).join(', ');        
        katex.render(
          `\\therefore \\ (${variables}) = (${solutionValues})`,
          conclusionRef.current,
          { displayMode: true, throwOnError: false }
        );
      } catch (e) {
        conclusionRef.current.innerText = e.message;
      }
    }
  }, [solution]);

  if (!solution) return null;

  return (
    <div className='space-y-6'>
      {/* Cramer's Rule formula */}
      <div ref={headerRef} className='text-lg' />

      {/* det(A) */}
      <div ref={detARef} className='my-4' />

      {/* Each x_i calculation */}
      <div className='space-y-4'>
        {solution.steps.map((_, idx) => (
          <div 
            key={idx}
            ref={el => stepsRefs.current[idx] = el}
            className='my-3'
          />
        ))}
      </div>

      {/* Conclusion */}
      <div ref={conclusionRef} className='mt-6 text-lg' />
    </div>
  );
};

export default CramerLatexResult;