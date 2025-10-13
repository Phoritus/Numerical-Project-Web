const corsOptions = {
  origin: [
    'http://localhost:5173',  // React frontend (Vite default)
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
