require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');

const connectDB = require('./db/connect');
const router = require('./router/router.js');
const projectRouter = require('./router/projectRoutes');
const officialsRoutes = require("./router/officials.js");
const fundRoutes = require("./router/fundRoutes");
const newsRoutes = require("./router/newsRoutes"); 
const adminAccRoutes = require('./router/adminAccount.js');
const complaintsRoutes = require('./router/complaints'); 
const projectSuggestionRoutes = require("./router/projectSuggestionRoutes");

const app = express();

// ✅ Allow CORS
app.use(cors({ origin: '*' }));

// ✅ Parse JSON requests
app.use(express.json({ limit: "10mb" }));

// ✅ ROUTES
app.use('/api/v1', router);
app.use('/api/admin/projects', projectRouter);
app.use("/api/admin/officials", officialsRoutes);
app.use("/api/admin/funds", fundRoutes);
app.use("/api/admin/news", newsRoutes);
app.use("/api/admin/", adminAccRoutes);
app.use("/api/admin/complaints", complaintsRoutes);
app.use("/api/admin/project-suggestions", projectSuggestionRoutes);

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('🔥 SERVER ERROR:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`✅ Server running on port: ${PORT}`);
    });
  } catch (err) {
    console.error('❌ ERROR:', err);
  }
};

start();
