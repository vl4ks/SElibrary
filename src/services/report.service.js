const historyRepository = require("../repositories/history.repository")
const bookRepository = require("../repositories/book.repository")

class ReportService {
    async getReminders() {
        const rows = await historyRepository.findByOverdue(true)
        return await Promise.all(rows.map(async row => {
            const book = await bookRepository.findById(row.book_id)
            return { ...row, title: book.title }
        }))
    }

    async search(bookId, bookTitle) {
        const rows = await historyRepository.findByParameters(bookId, bookTitle)
        const book = await bookRepository.findById(bookId)
        return { rows, book }
    }
}

module.exports = new ReportService()