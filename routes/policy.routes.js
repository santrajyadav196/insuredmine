const express = require("express");
const {
  getPolicyByUser,
  getPolicyAggregation,
} = require("../controllers/policy.controller");

const router = express.Router();

router.get("/search", getPolicyByUser);
router.get("/aggregate", getPolicyAggregation);

module.exports = router;
