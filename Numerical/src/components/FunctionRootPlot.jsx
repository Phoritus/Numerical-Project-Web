import React, { useEffect, useRef, useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import * as math from 'mathjs';

/**
 * FunctionRootPlot
 * Reusable plotting component for visualizing a function f(x) and root-finding iterations.
 *
 * Props:
 *  - functionExpr: string (mathjs-compatible expression) OR
 *  - evaluate: (x:number)=>number custom evaluator (overrides functionExpr)
 *  - history: array of iteration objects (supports bisection/newton/secant/false-position shapes)
 *    Bisection/False-Position example entry: { iteration, xl, xr, xm, fxm, errorPercent }
 *    Newton example entry: { iteration, x, fx }
 *    Secant example entry: { iteration, x, fx }
 *  - method: 'bisection' | 'newton' | 'secant' | 'false-position'
 *  - domain: { min:number, max:number } optional; if omitted inferred from history
 *  - samples: number of sample points for base curve (default 300)
 *  - showIterations: boolean (default true)
 *  - showBrackets: boolean (default true for bracketing methods)
 *  - height: plot height (default 420)
 *  - layoutExtras: additional layout overrides
 *  - onPointClick: callback({ x, y, traceName, pointIndex })
 *  - lineColor, pointColor, bracketColor: color customization
 */
export default function FunctionRootPlot({
  functionExpr,
  evaluate,
  history = [],
  method = 'bisection',
  domain,
  samples = 300,
  showIterations = true,
  showBrackets = true,
  height = 420,
  layoutExtras = {},
  onPointClick,
  lineColor = '#38bdf8',
  pointColor = '#ef4444',
  bracketColor = '#6366f1'
}) {
  const divRef = useRef(null);

  // Compile expression if evaluate not provided
  const compiled = useMemo(() => {
    if (evaluate) return null;
    if (!functionExpr) return null;
    try { return math.parse(functionExpr).compile(); } catch { return null; }
  }, [functionExpr, evaluate]);

  const evalFn = useMemo(() => {
    if (evaluate) return evaluate;
    if (!compiled) return () => NaN;
    return (x) => { try { return compiled.evaluate({ x }); } catch { return NaN; } };
  }, [compiled, evaluate]);

  const resolvedDomain = useMemo(() => {
    if (domain && typeof domain.min === 'number' && typeof domain.max === 'number') return domain;
    let xs = [];
    history.forEach(h => {
      if (typeof h.xl === 'number') xs.push(h.xl);
      if (typeof h.xr === 'number') xs.push(h.xr);
      if (typeof h.xm === 'number') xs.push(h.xm);
      if (typeof h.x === 'number') xs.push(h.x);
    });
    if (xs.length === 0) xs = [-5, 5];
    const min = Math.min(...xs);
    const max = Math.max(...xs);
    const pad = (max - min || 1) * 0.15;
    return { min: min - pad, max: max + pad };
  }, [domain, history]);

  const curve = useMemo(() => {
    const xVals = [];
    const yVals = [];
    const step = (resolvedDomain.max - resolvedDomain.min) / (samples - 1);
    for (let i = 0; i < samples; i++) {
      const x = resolvedDomain.min + i * step;
      xVals.push(x);
      yVals.push(evalFn(x));
    }
    return { x: xVals, y: yVals };
  }, [resolvedDomain, samples, evalFn]);

  const iterationPoints = useMemo(() => {
    if (!showIterations) return null;
    let pts = [];
    if (method === 'bisection' || method === 'false-position') {
      pts = history.map(h => ({ x: h.xm ?? h.x, y: h.fxm ?? h.fx ?? evalFn(h.xm ?? h.x) }));
    } else if (method === 'newton' || method === 'secant') {
      pts = history.map(h => ({ x: h.x ?? h.xm, y: h.fx ?? h.fxm ?? evalFn(h.x ?? h.xm) }));
    }
    return pts.filter(p => Number.isFinite(p.x) && Number.isFinite(p.y));
  }, [history, method, showIterations, evalFn]);

  const bracketSegments = useMemo(() => {
    if (!showBrackets) return [];
    if (!(method === 'bisection' || method === 'false-position')) return [];
    return history
      .filter(h => typeof h.xl === 'number' && typeof h.xr === 'number')
      .map(h => ({ x0: h.xl, x1: h.xr, iteration: h.iteration }));
  }, [history, method, showBrackets]);

  useEffect(() => {
    if (!divRef.current) return;
    const traces = [];

    traces.push({
      x: curve.x,
      y: curve.y,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x)',
      line: { color: lineColor, width: 2 }
    });

    traces.push({
      x: [resolvedDomain.min, resolvedDomain.max],
      y: [0, 0],
      type: 'scatter',
      mode: 'lines',
      name: 'y=0',
      line: { color: '#64748b', width: 1, dash: 'dot' },
      hoverinfo: 'skip'
    });

    if (iterationPoints && iterationPoints.length) {
      traces.push({
        x: iterationPoints.map(p => p.x),
        y: iterationPoints.map(p => p.y),
        text: iterationPoints.map((_, i) => `iter ${i}`),
        type: 'scatter',
        mode: 'markers+lines',
        name: 'Iterations',
        marker: { color: pointColor, size: 8 },
        line: { color: pointColor, width: 1, dash: 'dot' }
      });
    }

    const shapes = bracketSegments.map(seg => ({
      type: 'rect', xref: 'x', yref: 'paper',
      x0: seg.x0, x1: seg.x1, y0: 0, y1: 1,
      fillcolor: 'rgba(99,102,241,0.05)', line: { width: 0 }, layer: 'below'
    }));

    const layout = {
      margin: { l: 55, r: 20, t: 30, b: 45 },
      height,
      showlegend: true,
      hovermode: 'closest',
      xaxis: { title: 'x', zeroline: false },
      yaxis: { title: 'f(x)', zeroline: true },
      shapes,
      ...layoutExtras
    };

    Plotly.newPlot(divRef.current, traces, layout, { displaylogo: false, responsive: true });

    function handleClick(evt) {
      if (onPointClick && evt.points && evt.points.length > 0) {
        const p = evt.points[0];
        onPointClick({ x: p.x, y: p.y, traceName: p.data.name, pointIndex: p.pointIndex });
      }
    }
    divRef.current.on?.('plotly_click', handleClick);

    return () => {
      divRef.current?.removeAllListeners?.('plotly_click');
      Plotly.purge(divRef.current);
    };
  }, [curve, iterationPoints, bracketSegments, resolvedDomain, height, layoutExtras, lineColor, pointColor, showIterations, showBrackets, onPointClick]);

  return <div ref={divRef} style={{ width: '100%' }} />;
}
