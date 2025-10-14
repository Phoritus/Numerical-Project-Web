const express = require('express');
const router = express.Router();
const LinearAlgebra = require('../models/LinearAlgebra');

// GET /api/linear-algebra/:methodName/:Id
router.get('/:methodName/:Id', async (req, res) => {
  try {
    const { methodName, Id } = req.params;

    if (!Id || isNaN(Id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing Id parameter'
      });
    }

    const validMethods = ['cramer', 'gauss-elimination', 'gauss-jordan', 'matrix-inversion', 'lu-decomposition', 'Cholesky-decomposition', 'jacobi-iteration', 'gauss-seidel', 'conjugate-gradient'];
    if (!validMethods.includes(methodName)) {
      return res.status(400).json({
        success: false,
        message: `Invalid method. Must be one of: ${validMethods.join(', ')}`
      });
    }

    const data = await LinearAlgebra.find({ method: methodName, Id: parseInt(Id) });
    res.json({
      success: true,
      method: methodName,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
