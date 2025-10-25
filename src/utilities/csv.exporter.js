const fs = require('fs')
const path = require('path')

class CSVExporter {
    static exportBookHistory(data, filename) {
        if (!filename) {
            const bookTitle = data.book ? data.book.title.replace(/[^a-zA-Z0-9]/g, '_') : 'book'
            filename = `${bookTitle}_history.csv`
        }
        if (!data.rows || data.rows.length === 0) {
            throw new Error('No data to export')
        }

        const headers = ['Book ID', 'Title', 'Customer ID', 'Date of issue', 'Return Date', 'Was overdue']
        const rows = data.rows.map(row => [
            row.book_id,
            row.title,
            row.customer_id,
            row.issue_date,
            row.return_date,
            row.status
        ])

        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n')

        const filePath = path.join(__dirname, '../../exports', filename)
        fs.mkdirSync(path.dirname(filePath), { recursive: true })
        fs.writeFileSync(filePath, csvContent, 'utf8')

        return filePath
    }
}

module.exports = CSVExporter