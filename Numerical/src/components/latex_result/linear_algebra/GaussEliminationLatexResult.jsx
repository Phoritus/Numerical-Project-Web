import { useEffect, useRef } from "react";
import 'katex/dist/katex.min.css';
import katex from 'katex';

const matrixToAugmented = (M, V) => {
  const rows = M.map((row, i) => {
    const rowStr = row.map(val => val.toFixed(3)).join(' & ');
    return `${rowStr} & ${V[i].toFixed(3)}`;
  }).join(' \\\\ ');
  return `\\left[\\begin{array}{${'c'.repeat(M[0].length)}|c}${rows}\\end{array}\\right]`;
}

const GuassEliminationLatexResult = ({ solution }) => {
  const headerRef = useRef(null);
  const stepsRefs = useRef([]);
  const enderRef = useRef(null);
  const backSubRefs = useRef([]);
  const conclusionRef = useRef(null);

  useEffect(() => {
    if (!solution) return;

    // Header: Forward Elimination
    if (headerRef.current) {
      katex.render(
        `\\text{Forward Elimination}`,
        headerRef.current,
        { displayMode: false, throwOnError: false }
      );
    }

    // Forward elimination steps
    solution.steps.forEach((step, idx) => {
      if (stepsRefs.current[idx]) {
        const latex = `${matrixToAugmented(step.matrix, step.vector)} \\quad \\Rightarrow \\quad ${step.description}`;
        katex.render(
          latex,
          stepsRefs.current[idx],
          { displayMode: true, throwOnError: false }
        );
      }
    });

    // Header: Back Substitution
    if (enderRef.current) {
      katex.render(
        `\\text{Back Substitution}`,
        enderRef.current,
        { displayMode: false, throwOnError: false }
      );
    }

    // Back substitution steps
    if (solution.backSubSteps) {
      solution.backSubSteps.forEach((step, idx) => {
        if (backSubRefs.current[idx]) {
          const latex = `${step.formula} = ${step.value.toFixed(6)}`;
          katex.render(
            latex,
            backSubRefs.current[idx],
            { displayMode: true, throwOnError: false }
          );
        }
      });
    }

    // Conclusion
    if (conclusionRef.current) {
      const variables = solution.solution.map((_, i) => `x_{${i + 1}}`).join(', ');
      const values = solution.solution.map(val => val.toFixed(6)).join(', ');

      katex.render(
        `\\therefore \\; (${variables}) = (${values})`,
        conclusionRef.current,
        { displayMode: true, throwOnError: false }
      );
    }
  }, [solution]);

  if (!solution) return null;

  return (
    <div className='space-y-6'>
      {/* Forward Elimination */}
      <div ref={headerRef} className='text-xl font-semibold mb-4'/>
      
      <div className='space-y-4'>
        {solution.steps.map((_, idx) => (
          <div 
            key={idx}
            ref={el => stepsRefs.current[idx] = el}
            className='my-3'
          />
        ))}
      </div>

      {/* Back Substitution */}
      <div ref={enderRef} className='text-xl font-semibold mt-8 mb-4' />

      <div className='space-y-3'>
        {solution.backSubSteps && solution.backSubSteps.map((_, idx) => (
          <div 
            key={idx}
            ref={el => backSubRefs.current[idx] = el}
            className='my-2'
          />
        ))}
      </div>

      {/* Final Answer */}
      <div ref={conclusionRef} className='mt-6 text-lg' />
    </div>
  );
};

export default GuassEliminationLatexResult;