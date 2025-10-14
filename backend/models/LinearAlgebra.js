const mongoose = require('mongoose');


const linearAlgebraSchema = new mongoose.Schema({
  Id: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    required: true,
    enum: [
      'cramer',
      'gauss-elimination',
      'gauss-jordan',
      'matrix-inversion',
      'lu-decomposition',
      'cholesky-decomposition',
      'jacobi-iteration',
      'gauss-seidel',
      'conjugate-gradient'
    ]
  },
  matrixSize: {
    type: Number,
    required: true,
    min: 2,
    max: 10
  },
  matrixA: {
    type: [[Number]],
    required: true
  },
  vectorB: {
    type: [Number],
    required: true
  },
  // Optional fields for iterative methods
  initialGuess: {
    type: [Number],
  },
  tolerance: {
    type: Number,
    default: 1e-6
  }
}, {
  timestamps: false,
  collection: 'LinearAlgebra'
});

// Index for faster queries
linearAlgebraSchema.index({ Id: 1, method: 1 });
linearAlgebraSchema.index({ method: 1 });
linearAlgebraSchema.index({ matrixSize: 1 });

module.exports = mongoose.model('LinearAlgebra', linearAlgebraSchema);