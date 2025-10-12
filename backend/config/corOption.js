const corsOptions = {
  origin: [
    'http://localhost:5173',  // React frontend (Vite default)
    'http://localhost:9999'   // Additional frontend
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
