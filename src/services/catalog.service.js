const bookRepository = require("../repositories/book.repository")
const authorRepository = require("../repositories/author.repository")
const coverRepository = require("../repositories/cover.repository")
const subjectRepository = require("../repositories/subject.repository")
const { NotFoundError } = require("../errors")

class CatalogService {
    async search(title, author, subject, page = 1) {
        console.log('CatalogService.search called with', { title, author, subject, page })
        const limit = 50
        const offset = (page - 1) * limit;
        const { books, total } = await bookRepository.findByParameters(title, author, subject, limit, offset)

        const result = await Promise.all(
            books.map(async b => ({
                bookID: b.bookID,
                book: b.title,
                authors: await Promise.all(b.authorIDs.map(id => authorRepository.findById(id)))
            }))
        )

        const finalResult = {
            rows: result,
            total
        }
        console.log('CatalogService.search returning', finalResult)
        return finalResult
    }

    async getBookInfo(id) {
        console.log('CatalogService.getBookInfo called with id:', id)
        const book = await bookRepository.findById(id)

        if (!book) {
            console.log('CatalogService.getBookInfo throwing: Book not found')
            throw new NotFoundError('Book not found')
        }

        const covers = await Promise.all(book.coverIDs.map(id => coverRepository.findById(id)))
        const subjects = await Promise.all(book.subjectIDs.map(id => subjectRepository.findById(id)))
        const authors = await Promise.all(book.authorIDs.map(id => authorRepository.findById(id)))
        const result = { book, covers, subjects, authors }
        console.log('CatalogService.getBookInfo returning', result)
        return result
    }

    async getAuthorsByBook(bookId) {
        console.log('CatalogService.getAuthorsByBook called with bookId:', bookId)
        const book = await bookRepository.findById(bookId)

        if (!book) {
            console.log('CatalogService.getAuthorsByBook throwing: Book not found')
            throw new NotFoundError('Book not found')
        }

        const result = await Promise.all(book.authorIDs.map(id => authorRepository.findById(id)))
        console.log('CatalogService.getAuthorsByBook returning', result)
        return result
    }
}

module.exports = new CatalogService()