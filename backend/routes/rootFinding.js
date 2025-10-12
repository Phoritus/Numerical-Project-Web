const express = require('express');
const router = express.Router();
const RootFinding = require('../models/RootFinding');

// GET /api/root-finding/:methodName/:Id
router.get('/:methodName/:Id', async (req, res) => {
  try {
    const { methodName, Id } = req.params;

    if (!Id || isNaN(Id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing Id parameter'
      });
    }

    const validMethods = ['bisection', 'newton-raphson', 'secant', 'false-position', 'one-point', 'graphical'];
    if (!validMethods.includes(methodName)) {
      return res.status(400).json({
        success: false,
        message: `Invalid method. Must be one of: ${validMethods.join(', ')}`
      });
    }

    const data = await RootFinding.find({ method: methodName, Id: parseInt(Id) });
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