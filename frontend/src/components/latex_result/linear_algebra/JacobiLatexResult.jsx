import React from 'react';
import {
	Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
	Paper, Typography, Box
} from '@mui/material';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Format number for LaTeX: handle infinities, NaN, and trim length
function fmtNum(v) {
	if (v === Infinity) return '\\infty';
	if (v === -Infinity) return '-\\infty';
	if (v === null || v === undefined) return '-';
	if (Number.isNaN(v)) return 'NaN';
	if (!Number.isFinite(v)) return String(v);
	const n = Number(v);
	// Prefer significant precision; keep reasonable width
	const s = Math.abs(n) < 1e6 && Math.abs(n) > 1e-6
		? Number(n.toPrecision(8)).toString()
		: n.toExponential(6).replace(/e\+?(-?\d+)/, '\\times 10^{$1}');
	return s;
}

function KaTeXInline({ latex }) {
	const html = React.useMemo(() => (
		katex.renderToString(latex || '', { throwOnError: false })
	), [latex]);
	return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

// Render values as stacked KaTeX lines: x_1 = v1, x_2 = v2, ...
function VectorLinesKaTeX({ prefix = 'x', values = [], showPercent = false }) {
	if (!Array.isArray(values)) return '-';
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
			{values.map((v, i) => (
				<Box key={i}>
					<KaTeXInline latex={`${prefix}_{${i + 1}} = ${fmtNum(v)}${showPercent ? ' \\%' : ''}`} />
				</Box>
			))}
		</Box>
	);
}

// Expected data shape from solver:
// {
//   solution: number[],
//   iterations: number,
//   errorPercent: number[],           // final errors
//   history: [
//     { currentX: number[], errorPercent: number[], iteration: number }, ...
//   ]
// }
export default function JacobiLatexResult({ solution }) {
	const history = Array.isArray(solution?.history) ? solution.history : [];
	const finalX = Array.isArray(solution?.solution) ? solution.solution : null;
	const iterCount = typeof solution?.iterations === 'number' ? solution.iterations : history.length;
	const finalErr = Array.isArray(solution?.errorPercent)
		? solution.errorPercent
		: (history.length ? history[history.length - 1]?.errorPercent : null);

	return (
		<Box>
			{/* Summary section rendered with KaTeX */}
			<Box mb={2}>
				<Typography variant="subtitle1" fontWeight={600} gutterBottom>Summary</Typography>
				{finalX && (
					<Box mb={1}>
						<VectorLinesKaTeX prefix="x" values={finalX} />
					</Box>
				)}
				<Typography variant="subtitle1" fontWeight={600} gutterBottom>
					Iterations: {iterCount}
				</Typography>
				{Array.isArray(finalErr) && (
					<Box>
						<VectorLinesKaTeX prefix="e" values={finalErr} showPercent />
					</Box>
				)}
			</Box>

			{/* Iteration table with KaTeX vectors per row */}
			<Typography variant="subtitle1" fontWeight={600} mb={1}>Table</Typography>
			<TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
				<Table size="small" sx={{ minWidth: 600 }}>
					<TableHead>
						<TableRow>
							<TableCell sx={{ width: 80 }}><span dangerouslySetInnerHTML={{ __html: katex.renderToString("iter") }} /></TableCell>
							<TableCell align="left" sx={{ fontWeight: "bold" }}>
								<span dangerouslySetInnerHTML={{ __html: katex.renderToString("x_k") }} />
							</TableCell>

							<TableCell align="left" sx={{ fontWeight: "bold" }}>
								<span dangerouslySetInnerHTML={{ __html: katex.renderToString("error\\%") }} />
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{history.map((h, idx) => (
							<TableRow key={idx} hover>
								<TableCell>{h?.iteration ?? (idx + 1)}</TableCell>
								<TableCell>
									{Array.isArray(h?.currentX)
										? <VectorLinesKaTeX prefix="x" values={h.currentX} />
										: '-'}
								</TableCell>
								<TableCell>
									{Array.isArray(h?.errorPercent)
										? <VectorLinesKaTeX prefix="e" values={h.errorPercent} showPercent />
										: '-'}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}

