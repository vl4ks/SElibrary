const catalogService = require('../services/catalog.service')

class CatalogController {
    async search(req, res, next) {
        try {
            const { title, author, subject, page } = req.body
            const { rows, total } = await catalogService.search(title, author, subject, page)
            return res.json({ rows, total })
        } catch (error) {
            return next(error)
        }
    }

    async getBook(req, res, next) {
        try {
            const { bookId } = req.params
            const { book, covers, subjects, authors } = await catalogService.getBookInfo(bookId)
            return res.json({ book, covers, subjects, authors })
        } catch (error) {
            return next(error)
        }
    }

    async getAuthorsDetails(req, res, next) {
        try {
            const { bookId } = req.body
            const authors = await catalogService.getAuthorsByBook(bookId)
            return res.json({ authors })
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = new CatalogController()