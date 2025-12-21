const fs = require('fs')
const path = require('path')
const { BadRequestError } = require('../errors')

class CSVExporter {
    static exportBookHistory(data, filename) {
        if (!data || typeof data !== 'object')
            throw new BadRequestError('Invalid data provided')

        if (!filename) {
            const bookTitle = data.book ? data.book.title.replace(/[^a-zA-Z0-9]/g, '_') : 'book'
            filename = `${bookTitle}_history.csv`
        }
        if (!data.rows || data.rows.length === 0)
            throw new BadRequestError('No data to export')

        const headers = ['Book ID', 'Title', 'Customer Name', 'Date of issue', 'Return Date', 'Was overdue']
        const rows = data.rows.map(row => [
            row.bookID,
            row.title,
            row.customerName,
            row.issueDate,
            row.returnDate,
            row.status
        ])

        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field || ''}"`).join(','))
            .join('\n')

        const filePath = path.join(__dirname, '../../exports', filename)
        try {
            fs.mkdirSync(path.dirname(filePath), { recursive: true })
            fs.writeFileSync(filePath, csvContent, 'utf8')
        } catch (error) {
            throw new Error(`Failed to write CSV file: ${error.message}`)
        }

        return filePath
    }

    static exportReminders(data, filename) {
        if (!data || !Array.isArray(data))
            throw new BadRequestError('Invalid data provided')

        if (!filename) {
            filename = 'reminders.csv'
        }
        if (data.length === 0)
            throw new BadRequestError('No data to export')

        const headers = ['Title', 'Customer Name', 'Date of Issue', 'Return Until']
        const rows = data.map(row => [
            row.title,
            row.customerName,
            row.issueDate,
            row.returnDate
        ])

        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field || ''}"`).join(','))
            .join('\n')

        const filePath = path.join(__dirname, '../../exports', filename)
        try {
            fs.mkdirSync(path.dirname(filePath), { recursive: true })
            fs.writeFileSync(filePath, csvContent, 'utf8')
        } catch (error) {
            throw new Error(`Failed to write CSV file: ${error.message}`)
        }

        return filePath
    }
}

module.exports = CSVExporter