import React from 'react';
import {
	Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
	Paper, Typography, Box
} from '@mui/material';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function fmtNum(v) {
	if (v === Infinity) return '\\infty';
	if (v === -Infinity) return '-\\infty';
	if (v === null || v === undefined) return '-';
	if (Number.isNaN(v)) return 'NaN';
	if (!Number.isFinite(v)) return String(v);
	const n = Number(v);
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

function VectorLinesKaTeX({ prefix, values }) {
	if (!Array.isArray(values)) return '-';
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
			{values.map((v, i) => (
				<Box key={i}>
					<KaTeXInline latex={`${prefix}_{${i + 1}} = ${fmtNum(v)}`} />
				</Box>
			))}
		</Box>
	);
}

export default function ConjugateLatexResult({ solution }) {
	const history = Array.isArray(solution?.history) ? solution.history : [];
	const finalX = Array.isArray(solution?.solution) ? solution.solution : null;
	const iterCount = typeof solution?.iterations === 'number' ? solution.iterations : history.length;
	const finalError = solution?.error;

	return (
		<Box>
			{/* Summary */}
			<Box mb={2}>
				<Typography variant="subtitle1" fontWeight={600} gutterBottom>Summary</Typography>
				{finalX && (
					<Box mb={1}>
						<VectorLinesKaTeX prefix="x" values={finalX} />
					</Box>
				)}
				<Typography variant="subtitle1" fontWeight={600}>
					Iterations: {iterCount}
				</Typography>
				{finalError !== undefined && (
					<Typography variant='subtitle1' fontWeight={600}>
						Final error: <KaTeXInline latex={`${fmtNum(finalError)}`} />
					</Typography>
				)}
			</Box>

			{/* Iteration table */}
			<Typography variant="subtitle1" fontWeight={600} mb={1}>Table</Typography>
			<TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
				<Table size="small" sx={{ minWidth: 700 }}>
					<TableHead>
						<TableRow>
							<TableCell >
                <span dangerouslySetInnerHTML={{ __html: katex.renderToString("iter") }} />
              </TableCell>
							<TableCell>
                <span dangerouslySetInnerHTML={{ __html: katex.renderToString("x_k") }} />
              </TableCell>
							<TableCell>
                <span dangerouslySetInnerHTML={{ __html: katex.renderToString("r_k") }} />
              </TableCell>
							<TableCell>
                <span dangerouslySetInnerHTML={{ __html: katex.renderToString("\\alpha") }} />
              </TableCell>
							<TableCell>
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
									{Array.isArray(h?.residual)
										? <VectorLinesKaTeX prefix="r" values={h.residual} />
										: '-'}
								</TableCell>
								<TableCell>
									{h?.alpha !== undefined
										? <KaTeXInline latex={`${fmtNum(h.alpha)}`} />
										: '-'}
								</TableCell>
								<TableCell>
									{h?.error !== undefined
										? <KaTeXInline latex={`${fmtNum(h.error)}`} />
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

