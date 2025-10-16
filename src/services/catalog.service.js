const bookRepository = require("../repositories/book.repository")
const authorRepository = require("../repositories/author.repository")

class CatalogService {
    async search(title, author, subject) { // call on start without parameters in controller
        // pagination
        // bookRepository.findByParameters(title, author, subject)
        // return books[]
    }

    async getBook(id) {
        // bookRepository.findById(id)
        // return book
    }

    async getAuthor(id) {
        // authorRepository.findById(id)
        // return author
    }
}