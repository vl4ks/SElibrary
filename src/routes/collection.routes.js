const express = require("express");
const router = express.Router();

const CollectionController = require("../controllers/collection.controller");
const collectionService = require("../services/collection.service");

const controller = new CollectionController(collectionService);

router.get("/", controller.getAll.bind(controller));
router.post("/", controller.create.bind(controller));
router.patch("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

module.exports = router;