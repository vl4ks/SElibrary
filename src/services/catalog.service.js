const bookRepository = require("../repositories/book.repository")
const authorRepository = require("../repositories/author.repository")
const coverRepository = require("../repositories/cover.repository")
const subjectRepository = require("../repositories/subject.repository")
const { NotFoundError } = require("../errors")

class CatalogService {
    async search(title, author, subject, page = 1) {
        const limit = 50
        const offset = (page - 1) * limit;
        const { books, total } = await bookRepository.findByParameters(title, author, subject, limit, offset)

        const result = await Promise.all(
            books.map(async b => ({
                book_id: b.book_id,
                book: b.title,
                authors: await Promise.all(b.author_ids.map(id => authorRepository.findById(id)))
            }))
        )

        return {
            rows: result,
            total
        }
    }

    async getBookInfo(id) {
        const book = await bookRepository.findById(id)

        if (!book) 
            throw new NotFoundError('Book not found')

        const covers = await Promise.all(book.cover_ids.map(id => coverRepository.findById(id)))
        const subjects = await Promise.all(book.subject_ids.map(id => subjectRepository.findById(id)))
        const authors = await Promise.all(book.author_ids.map(id => authorRepository.findById(id)))
        return { book, covers, subjects, authors }
    }

    async getAuthorsByBook(bookId) {
        const book = await bookRepository.findById(bookId)

        if (!book) 
            throw new NotFoundError('Book not found')
        
        return await Promise.all(book.author_ids.map(id => authorRepository.findById(id)))
    }
}

module.exports = new CatalogService()