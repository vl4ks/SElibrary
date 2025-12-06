const catalogService = require('../services/catalog.service')

class CatalogController {
    async search(req, res, next) {
        console.log('CatalogController.search called with req.body:', req.body)
        try {
            const { title, author, subject, page } = req.body
            const { rows, total } = await catalogService.search(title, author, subject, page)
            console.log('CatalogController.search returning', { rows, total })
            return res.json({ rows, total })
        } catch (error) {
            console.log('CatalogController.search error:', error.message)
            return next(error)
        }
    }

    async getBook(req, res, next) {
        console.log('CatalogController.getBook called with req.params:', req.params)
        try {
            const { bookId } = req.params
            const { book, covers, subjects, authors } = await catalogService.getBookInfo(bookId)
            console.log('CatalogController.getBook returning', { book, covers, subjects, authors })
            return res.json({ book, covers, subjects, authors })
        } catch (error) {
            console.log('CatalogController.getBook error:', error.message)
            return next(error)
        }
    }

    async getAuthorsDetails(req, res, next) {
        console.log('CatalogController.getAuthorsDetails called with req.params:', req.params)
        try {
            const { bookId } = req.params
            const authors = await catalogService.getAuthorsByBook(bookId)
            console.log('CatalogController.getAuthorsDetails returning', { authors })
            return res.json({ authors })
        } catch (error) {
            console.log('CatalogController.getAuthorsDetails error:', error.message)
            return next(error)
        }
    }
}

module.exports = new CatalogController()