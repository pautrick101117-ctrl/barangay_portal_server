// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { loginAdmin, createAdmin } = require("../controller/adminAccount");

// ROUTE TO CREATE A NEW ADMIN (ONLY RUN ONCE OR PROTECTED)
router.post("/create", createAdmin);

// ROUTE TO LOGIN ADMIN
router.post("/login", loginAdmin);

module.exports = router;
