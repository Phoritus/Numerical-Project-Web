const corsOptions = {
  origin: [
    'http://localhost:5173',  // React frontend (Vite default)
    'https://numerical-project-web.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
