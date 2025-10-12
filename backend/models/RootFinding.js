const mongoose = require('mongoose');

const rootFindingSchema = new mongoose.Schema({
  Id: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    required: true,
    enum: ['bisection', 'newton-raphson', 'secant', 'false-position', 'one-point', 'graphical']
  },
  equation: {
    type: String,
    required: true,
    trim: true
  },
  xl: Number,      // For Bisection, False Position, Graphical
  xr: Number,      // For Bisection, False Position, Graphical
  x0: Number,      // For Newton-Raphson, Secant, One-Point
  x1: Number,      // For Secant
  tolerance: {
    type: Number,
    default: 0.0001
  }
}, {
  timestamps: false,
  collection: 'RootFinding'
});

// Index for faster queries
rootFindingSchema.index({ Id: 1, method: 1 });
rootFindingSchema.index({ method: 1 });
rootFindingSchema.index({ equation: 1 });

module.exports = mongoose.model('RootFinding', rootFindingSchema);
