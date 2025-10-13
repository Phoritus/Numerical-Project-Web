const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const LinearAlgebra = require('../models/LinearAlgebra');

// Raw data (no Id)
const rawData = [
  // Cramer's Rule
  { method: 'cramer', matrixSize: 2, matrixA: [[2, 1], [1, 3]], vectorB: [5, 8] },
  // FIXED: Changed the last element from 2 to 3 to ensure the determinant is non-zero.
  { method: 'cramer', matrixSize: 3, matrixA: [[1, 2, -1], [2, 1, 1], [1, -1, 3]], vectorB: [3, 10, 7] },
  { method: 'cramer', matrixSize: 3, matrixA: [[2, -1, 3], [1, 1, 1], [3, 2, -2]], vectorB: [12, 6, 2] },
  { method: 'cramer', matrixSize: 2, matrixA: [[3, 2], [1, 4]], vectorB: [7, 10] },
  { method: 'cramer', matrixSize: 3, matrixA: [[1, 1, 1], [2, -1, 3], [1, -2, -1]], vectorB: [6, 14, -4] },

  // Gauss Elimination
  { method: 'gauss-elimination', matrixSize: 2, matrixA: [[4, 2], [1, 3]], vectorB: [10, 7] },
  { method: 'gauss-elimination', matrixSize: 3, matrixA: [[2, 1, -1], [1, 3, 2], [3, 1, -3]], vectorB: [8, 13, 2] },
  { method: 'gauss-elimination', matrixSize: 3, matrixA: [[3, -1, 2], [1, 2, 3], [2, -2, -1]], vectorB: [12, 11, 2] },
  { method: 'gauss-elimination', matrixSize: 4, matrixA: [[1, 1, 1, 1], [2, -1, 3, -2], [3, 2, -1, 1], [1, -3, 2, -1]], vectorB: [10, 8, 7, -3] },
  { method: 'gauss-elimination', matrixSize: 3, matrixA: [[1, 2, 3], [2, 5, 3], [1, 0, 8]], vectorB: [14, 18, 20] },

  // Gauss-Jordan
  { method: 'gauss-jordan', matrixSize: 2, matrixA: [[5, 2], [1, 1]], vectorB: [9, 4] },
  { method: 'gauss-jordan', matrixSize: 3, matrixA: [[1, 1, -1], [2, 3, 1], [1, -1, 3]], vectorB: [2, 12, 8] },
  { method: 'gauss-jordan', matrixSize: 3, matrixA: [[2, 1, 1], [1, -1, 2], [3, 2, -1]], vectorB: [10, 8, 2] },
  { method: 'gauss-jordan', matrixSize: 4, matrixA: [[2, 1, 1, 1], [1, 2, 1, 1], [1, 1, 2, 1], [1, 1, 1, 2]], vectorB: [10, 11, 12, 13] },
  { method: 'gauss-jordan', matrixSize: 3, matrixA: [[1, 2, 1], [2, 1, 3], [3, 3, 2]], vectorB: [8, 13, 16] },

  // Matrix Inversion
  { method: 'matrix-inversion', matrixSize: 2, matrixA: [[3, 1], [2, 2]], vectorB: [7, 8] },
  { method: 'matrix-inversion', matrixSize: 3, matrixA: [[1, 0, 2], [2, 1, 0], [1, 1, 1]], vectorB: [5, 7, 6] },
  { method: 'matrix-inversion', matrixSize: 3, matrixA: [[2, 1, 3], [1, -1, 1], [3, 2, 2]], vectorB: [14, 4, 14] },
  { method: 'matrix-inversion', matrixSize: 2, matrixA: [[1, 2], [3, 4]], vectorB: [5, 11] },
  { method: 'matrix-inversion', matrixSize: 3, matrixA: [[1, 1, 1], [0, 2, 5], [2, 5, -1]], vectorB: [6, 13, 10] },

  // LU Decomposition
  { method: 'lu-decomposition', matrixSize: 2, matrixA: [[4, 3], [6, 3]], vectorB: [10, 12] },
  { method: 'lu-decomposition', matrixSize: 3, matrixA: [[2, -1, -2], [4, 6, -1], [-2, 7, 5]], vectorB: [-3, 9, 14] },
  { method: 'lu-decomposition', matrixSize: 3, matrixA: [[1, 2, 3], [0, 1, 4], [5, 6, 0]], vectorB: [14, 13, 23] },
  { method: 'lu-decomposition', matrixSize: 4, matrixA: [[1, 2, -1, -4], [2, 3, 3, 3], [4, 5, -2, 2], [3, 4, 1, 1]], vectorB: [3, 15, 7, 8] },
  { method: 'lu-decomposition', matrixSize: 6, matrixA: [[2, -1, 0, 0, 0, 0], [-1, 2, -1, 0, 0, 0], [0, -1, 2, -1, 0, 0], [0, 0, -1, 2, -1, 0], [0, 0, 0, -1, 2, -1], [0, 0, 0, 0, -1, 2]], vectorB: [1, 0, 0, 0, 0, 1] },

  // Jacobi Iteration
  { method: 'jacobi-iteration', matrixSize: 2, matrixA: [[4, -1], [2, 3]], vectorB: [3, 15], initialGuess: [10, -5], tolerance: 0.000001 },
  { method: 'jacobi-iteration', matrixSize: 3, matrixA: [[10, -1, 2], [-1, 11, -1], [2, -1, 10]], vectorB: [6, 25, -11], initialGuess: [5, -5, 5], tolerance: 0.000001 },
  { method: 'jacobi-iteration', matrixSize: 3, matrixA: [[3, -1, 1], [1, 4, -2], [2, -1, 5]], vectorB: [1, 2, 3], initialGuess: [-3, 3, -3], tolerance: 0.000001 },
  { method: 'jacobi-iteration', matrixSize: 6, matrixA: [[4, -1, 0, 0, 0, 0], [-1, 4, -1, 0, 0, 0], [0, -1, 4, -1, 0, 0], [0, 0, -1, 4, -1, 0], [0, 0, 0, -1, 4, -1], [0, 0, 0, 0, -1, 3]], vectorB: [15, 10, 10, 10, 10, 10], initialGuess: [10, 10, 10, 10, 10, 10], tolerance: 0.000001 },
  { method: 'jacobi-iteration', matrixSize: 4, matrixA: [[5, 2, 1, -1], [2, 6, -1, 0], [1, -1, 7, 3], [-1, 0, 3, 4]], vectorB: [12, 15, 14, 10], initialGuess: [-5, 5, -5, 5], tolerance: 0.000001 },

  // Gauss-Seidel
  { method: 'gauss-seidel', matrixSize: 2, matrixA: [[4, -1], [2, 3]], vectorB: [3, 15], initialGuess: [15, -10], tolerance: 0.000001 },
  { method: 'gauss-seidel', matrixSize: 3, matrixA: [[10, -1, 2], [-1, 11, -1], [2, -1, 10]], vectorB: [6, 25, -11], initialGuess: [20, -20, 20], tolerance: 0.000001 },
  { method: 'gauss-seidel', matrixSize: 3, matrixA: [[3, -1, 1], [1, 4, -2], [2, -1, 5]], vectorB: [1, 2, 3], initialGuess: [-5, 5, -5], tolerance: 0.000001 },
  { method: 'gauss-seidel', matrixSize: 6, matrixA: [[4, -1, 0, 0, 0, 0], [-1, 4, -1, 0, 0, 0], [0, -1, 4, -1, 0, 0], [0, 0, -1, 4, -1, 0], [0, 0, 0, -1, 4, -1], [0, 0, 0, 0, -1, 3]], vectorB: [15, 10, 10, 10, 10, 10], initialGuess: [15, 15, 15, 15, 15, 15], tolerance: 0.000001 },
  { method: 'gauss-seidel', matrixSize: 4, matrixA: [[5, 2, 1, -1], [2, 6, -1, 0], [1, -1, 7, 3], [-1, 0, 3, 4]], vectorB: [12, 15, 14, 10], initialGuess: [-8, 8, -8, 8], tolerance: 0.000001 },

  // Conjugate Gradient
  { method: 'conjugate-gradient', matrixSize: 3, matrixA: [[4, 1, 0], [1, 3, -1], [0, -1, 2]], vectorB: [1, 2, 3], initialGuess: [-10, -10, -10], tolerance: 0.000001 },
  { method: 'conjugate-gradient', matrixSize: 4, matrixA: [[4, 1, 0, 0], [1, 3, -1, 0], [0, -1, 2, 1], [0, 0, 1, 1]], vectorB: [1, 2, 3, 4], initialGuess: [15, 15, 15, 15], tolerance: 0.000001 },
  { method: 'conjugate-gradient', matrixSize: 6, matrixA: [[6, 1, 0, 0, 0, 0], [1, 5, 2, 0, 0, 0], [0, 2, 4, 1, 0, 0], [0, 0, 1, 3, 2, 0], [0, 0, 0, 2, 5, 1], [0, 0, 0, 0, 1, 6]], vectorB: [1, 2, 3, 4, 5, 6], initialGuess: [20, 20, 20, 20, 20, 20], tolerance: 0.000001 },
  { method: 'conjugate-gradient', matrixSize: 3, matrixA: [[3, 2, 0], [2, 3, -1], [0, -1, 2]], vectorB: [1, 2, 3], initialGuess: [-12, -12, -12], tolerance: 0.000001 },
  { method: 'conjugate-gradient', matrixSize: 4, matrixA: [[4, -1, 0, 0], [-1, 4, -1, 0], [0, -1, 4, -1], [0, 0, -1, 3]], vectorB: [15, 10, 10, 10], initialGuess: [-15, -15, -15, -15], tolerance: 0.000001 },
];

// Function to assign Ids starting from 1 for each method
const assignIdsByMethod = (data) => {
  const grouped = {};
  data.forEach(item => {
    if (!grouped[item.method]) grouped[item.method] = [];
    grouped[item.method].push(item);
  });

  const result = [];
  Object.keys(grouped).forEach(method => {
    grouped[method].forEach((item, index) => {
      result.push({
        ...item,
        Id: index + 1, // Start from 1 for each method
      });
    });
  });

  return result;
};

const linearAlgebraData = assignIdsByMethod(rawData);

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await LinearAlgebra.deleteMany({});
    console.log('🗑️ Cleared existing Linear Algebra data');

    await LinearAlgebra.insertMany(linearAlgebraData);
    console.log(`✅ Inserted ${linearAlgebraData.length} problems`);

    const counts = await LinearAlgebra.aggregate([
      { $group: { _id: '$method', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Summary:');
    counts.forEach(item => console.log(`   ${item._id}: ${item.count} problems`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();