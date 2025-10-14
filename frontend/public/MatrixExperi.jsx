export const parseMatrix = (arr, label) => arr.map(row =>
  (Array.isArray(row) ? row : [row]).map(val => {
    const num = parseFloat(val);
    if (isNaN(num)) throw new Error(`All entries in ${label} must be valid numbers.`);
    return num;
  })
);

export const buildEmptyMatrix = (n) => Array(n).fill(null).map(() => Array(n).fill(null));
export const buildEmptyVector = (n) => Array(n).fill(null);

export const disabledMatrix = (matrixSize) => (
  Array(matrixSize).fill(null).map((_, i) => (
    <input key={`x${i}`} className='matrix-disabled-input' placeholder={`x${i + 1}`} disabled />
  ))
);

export const renderMatrixHorizontal = (label, data, formVersion, updateCell) => {
  // Normalize: accept either 1D vector [v1, v2, ...] or 2D [[...], ...]
  // For 1D vectors, render as a single horizontal row to save space
  const rows = Array.isArray(data)
    ? (Array.isArray(data[0]) ? data : [data])
    : [];
  const cols = rows.length > 0 && Array.isArray(rows[0]) ? rows[0].length : 1;
  const isRowVector = rows.length === 1 && cols > 1;

  return (
    <div className='flex flex-col items-center'>
      <div className='text-lg font-semibold mb-2'>{label}</div>
      <div className='grid gap-3' style={{ gridTemplateColumns: `repeat(${cols}, minmax(50px, 1fr))` }}>
        {rows.map((row, i) => row.map((val, j) => (
          <input
            key={`${label}${formVersion}-${i}-${j}`}
            className='matrix-input'
            value={val ?? ''}
            onChange={(e) => updateCell('initialGuess', i, j, e.target.value)}
            placeholder={isRowVector ? `x${j + 1}` : `x${i + 1}${cols > 1 ? `,${j + 1}` : ''}`}
            style={{ width: 80, height: 80 }}
          />
        )))}
      </div>
    </div>
  )
}
