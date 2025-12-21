const express = require("express");
const router = express.Router();
const circulationController = require("../controllers/circulation.controller");
const circulationService = require("../services/circulation.service");

router.get("/customer/:id", circulationController.getCustomerCirculation.bind(circulationController));
router.post("/issue", circulationController.issue.bind(circulationController));
router.post("/return", circulationController.return.bind(circulationController));
router.post("/renew", circulationController.renew.bind(circulationController));

router.get("/book/:id", async (req, res, next) => {
    try {
        const title = await circulationService.getBookTitleById(req.params.id);
        if (!title) {
            return res.status(404).json({ title: null });
        }
        res.json({ title });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
