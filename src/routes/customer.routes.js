const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");

router.get("/search", customerController.search.bind(customerController));
router.post("/", customerController.add.bind(customerController));
router.put("/:id", customerController.edit.bind(customerController));
router.get("/:id", customerController.getById.bind(customerController));

module.exports = router;
