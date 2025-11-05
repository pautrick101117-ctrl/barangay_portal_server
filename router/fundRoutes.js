const express = require("express");
const {
  getFunds,
  createFund,
  updateFund,
  deleteFund,
} = require("../controller/fundController");

const router = express.Router();

router.get("/", getFunds);
router.post("/", createFund);
router.put("/:id", updateFund);
router.delete("/:id", deleteFund);

module.exports = router;
