const express = require("express");
const router = express.Router();
const circulationController = require("../controllers/circulation.controller");

router.get("/customer/:id", circulationController.circulation.bind(circulationController));
router.post("/issue", circulationController.issue.bind(circulationController));
router.post("/return", circulationController.return.bind(circulationController));
router.post("/renew", circulationController.renew.bind(circulationController));

module.exports = router;
