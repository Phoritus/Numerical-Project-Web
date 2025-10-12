// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const RootFinding = require('../models/RootFinding');

const rawData = [
  // Bisection
  { method: 'bisection', equation: 'x^2 - 4', xl: 0, xr: 3, tolerance: 0.0001 },
  { method: 'bisection', equation: 'x^3 - 2*x - 5', xl: 2, xr: 3, tolerance: 0.0001 },
  { method: 'bisection', equation: 'e^x - 3*x', xl: 0, xr: 2, tolerance: 0.0001 },
  { method: 'bisection', equation: 'x^4 - x - 10', xl: 1, xr: 2, tolerance: 0.0001 },
  { method: 'bisection', equation: 'cos(x) - x', xl: 0, xr: 1, tolerance: 0.0001 },

  // Newton-Raphson
  { method: 'newton-raphson', equation: 'x^2 - 7', x0: 2, tolerance: 0.0001 },
  { method: 'newton-raphson', equation: 'x^3 - x - 1', x0: 1.5, tolerance: 0.0001 },
  { method: 'newton-raphson', equation: 'e^x - 4', x0: 1, tolerance: 0.0001 },
  { method: 'newton-raphson', equation: 'x^3 + 4*x^2 - 10', x0: 1, tolerance: 0.0001 },
  { method: 'newton-raphson', equation: 'sin(x) - x/2', x0: 2, tolerance: 0.0001 },

  // Secant
  { method: 'secant', equation: 'x^2 - 3', x0: 1, x1: 2, tolerance: 0.0001 },
  { method: 'secant', equation: 'x^3 - 6*x^2 + 11*x - 6', x0: 2.5, x1: 3.5, tolerance: 0.0001 },
  { method: 'secant', equation: 'e^x - 2*x - 1', x0: 1, x1: 2, tolerance: 0.0001 },
  { method: 'secant', equation: 'x^4 - 2*x^3 - 4*x^2 + 4*x + 4', x0: 0, x1: 1, tolerance: 0.0001 },
  { method: 'secant', equation: 'ln(x) - cos(x)', x0: 1, x1: 2, tolerance: 0.0001 },

  // False-Position
  { method: 'false-position', equation: 'x^2 - 5', xl: 2, xr: 3, tolerance: 0.0001 },
  { method: 'false-position', equation: 'x^3 - x - 2', xl: 1, xr: 2, tolerance: 0.0001 },
  { method: 'false-position', equation: 'e^x - 3*x^2', xl: 3, xr: 4, tolerance: 0.0001 },
  { method: 'false-position', equation: 'x^3 + x^2 - 3*x - 3', xl: 1, xr: 2, tolerance: 0.0001 },
  { method: 'false-position', equation: 'sin(x) - x + 1', xl: -2, xr: 0, tolerance: 0.0001 },

  // One-Point
  { method: 'one-point', equation: 'x^2 - 2*x - 3', x0: 3, tolerance: 0.0001 },
  { method: 'one-point', equation: 'x^3 - x - 1', x0: 1.5, tolerance: 0.0001 },
  { method: 'one-point', equation: 'e^(-x) - x', x0: 0.5, tolerance: 0.0001 },
  { method: 'one-point', equation: 'x^2 - 4*x + 3', x0: 2, tolerance: 0.0001 },
  { method: 'one-point', equation: 'cos(x) - x*e^x', x0: 0.5, tolerance: 0.0001 },

  // Graphical
  { method: 'graphical', equation: 'x^2 - 6', xl: 2, xr: 3, tolerance: 0.0001 },
  { method: 'graphical', equation: 'x^3 - 2*x^2 - 5', xl: 2, xr: 3, tolerance: 0.0001 },
  { method: 'graphical', equation: 'e^x - 4*x', xl: 0, xr: 2, tolerance: 0.0001 },
  { method: 'graphical', equation: 'x^3 - 3*x + 1', xl: 0, xr: 1, tolerance: 0.0001 },
  { method: 'graphical', equation: 'tan(x) - x - 1', xl: 1, xr: 1.5, tolerance: 0.0001 },
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

const rootFindingData = assignIdsByMethod(rawData);

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await RootFinding.deleteMany({});
    console.log('🗑️ Cleared existing Root Finding data');

    await RootFinding.insertMany(rootFindingData);
    console.log(`✅ Inserted ${rootFindingData.length} problems`);

    const counts = await RootFinding.aggregate([
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