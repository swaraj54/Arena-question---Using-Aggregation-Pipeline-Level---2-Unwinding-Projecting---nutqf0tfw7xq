const express = require("express");

const { searchProducts, getProjectedData, getTagCount } = require("../controllers/productControllers");

const router = express.Router();

router.get("/", searchProducts);
router.get("/projected", getProjectedData);
router.get("/tags", getTagCount);

module.exports = router;