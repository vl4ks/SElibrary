const historyRepository = require("../repositories/history.repository")
const bookRepository = require("../repositories/book.repository")
const customerRepository = require("../repositories/customer.repository")

class ReportService {
    async getReminders() {
        console.log('ReportService.getReminders called')
        const rows = await historyRepository.findByOverdue(true)
        const result = await Promise.all(rows.map(async row => {
            const book = await bookRepository.findById(row.bookID)
            const customer = await customerRepository.findById(row.customerID)
            return { ...row, title: book.title, customerName: customer.name }
        }))
        console.log('ReportService.getReminders returning', result)
        return result
    }

    async search(bookId, bookTitle) {
        console.log('ReportService.search called with', { bookId, bookTitle })
        if (bookId && bookTitle) {
            console.log('ReportService.search throwing: Please search by either book ID or title, not both.')
            throw new Error('Please search by either book ID or title, not both.')
        }

        let rows, book;

        if (bookId) {
            book = await bookRepository.findById(bookId)
            rows = await historyRepository.findByParameters(bookId, null)
        } else if (bookTitle) {
            rows = await historyRepository.findByParameters(null, bookTitle)
        }

        // Add customer names to rows
        const rowsWithNames = await Promise.all(rows.map(async row => {
            const customer = await customerRepository.findById(row.customerID)
            return { ...row, customerName: customer.name }
        }))

        const result = { rows: rowsWithNames, book }
        console.log('ReportService.search returning', result)
        return result
    }
}

module.exports = new ReportService()