require('dotenv').config();
const mongoose = require('mongoose');
const LinearAlgebra = require('../models/LinearAlgebra');

// Raw data (no Id)
const rawData = [
  // Cramer's Rule
  { method: 'cramer', matrixSize: 2, matrixA: [[2, 1],[1, 3]], vectorB: [5, 8] },
  { method: 'cramer', matrixSize: 3, matrixA: [[1, 2, -1],[2, 1, 1],[1, -1, 2]], vectorB: [3, 10, 7] },
  { method: 'cramer', matrixSize: 3, matrixA: [[2, -1, 3],[1, 1, 1],[3, 2, -2]], vectorB: [12, 6, 2] },
  { method: 'cramer', matrixSize: 2, matrixA: [[3, 2],[1, 4]], vectorB: [7, 10] },
  { method: 'cramer', matrixSize: 3, matrixA: [[1, 1, 1],[2, -1, 3],[1, -2, -1]], vectorB: [6, 14, -4] },
  // Gauss Elimination
  { method: 'gauss-elimination', matrixSize: 2, matrixA: [[4, 2],[1, 3]], vectorB: [10, 7] },
  { method: 'gauss-elimination', matrixSize: 3, matrixA: [[2, 1, -1],[1, 3, 2],[3, 1, -3]], vectorB: [8, 13, 2] },
  { method: 'gauss-elimination', matrixSize: 3, matrixA: [[3, -1, 2],[1, 2, 3],[2, -2, -1]], vectorB: [12, 11, 2] },
  { method: 'gauss-elimination', matrixSize: 4, matrixA: [[1, 1, 1, 1],[2, -1, 3, -2],[3, 2, -1, 1],[1, -3, 2, -1]], vectorB: [10, 8, 7, -3] },
  { method: 'gauss-elimination', matrixSize: 3, matrixA: [[1, 2, 3],[2, 5, 3],[1, 0, 8]], vectorB: [14, 18, 20] },
  // Gauss-Jordan
  { method: 'gauss-jordan', matrixSize: 2, matrixA: [[5, 2],[1, 1]], vectorB: [9, 4] },
  { method: 'gauss-jordan', matrixSize: 3, matrixA: [[1, 1, -1],[2, 3, 1],[1, -1, 3]], vectorB: [2, 12, 8] },
  { method: 'gauss-jordan', matrixSize: 3, matrixA: [[2, 1, 1],[1, -1, 2],[3, 2, -1]], vectorB: [10, 8, 2] },
  { method: 'gauss-jordan', matrixSize: 4, matrixA: [[2, 1, 1, 1],[1, 2, 1, 1],[1, 1, 2, 1],[1, 1, 1, 2]], vectorB: [10, 11, 12, 13] },
  { method: 'gauss-jordan', matrixSize: 3, matrixA: [[1, 2, 1],[2, 1, 3],[3, 3, 2]], vectorB: [8, 13, 16] },
  // Matrix Inversion
  { method: 'matrix-inversion', matrixSize: 2, matrixA: [[3, 1],[2, 2]], vectorB: [7, 8] },
  { method: 'matrix-inversion', matrixSize: 3, matrixA: [[1, 0, 2],[2, 1, 0],[1, 1, 1]], vectorB: [5, 7, 6] },
  { method: 'matrix-inversion', matrixSize: 3, matrixA: [[2, 1, 3],[1, -1, 1],[3, 2, 2]], vectorB: [14, 4, 14] },
  { method: 'matrix-inversion', matrixSize: 2, matrixA: [[1, 2],[3, 4]], vectorB: [5, 11] },
  { method: 'matrix-inversion', matrixSize: 3, matrixA: [[1, 1, 1],[0, 2, 5],[2, 5, -1]], vectorB: [6, 13, 10] },
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
