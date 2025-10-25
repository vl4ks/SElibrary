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

        const headers = ['Customer ID', 'Issue Date', 'Return Date']
        const rows = data.rows.map(row => [
            row.customer_id,
            row.issue_date,
            row.return_date
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