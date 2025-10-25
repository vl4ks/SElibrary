const express = require('express')
const router = express.Router()
const catalogController = require('../controllers/catalog.controller')

router.post('/search', catalogController.search.bind(catalogController))
router.get('/books/:bookId', catalogController.getBook.bind(catalogController))
router.get('/authors/:bookId', catalogController.getAuthorsDetails.bind(catalogController))

module.exports = router