const reportService = require('../services/report.service')
const CSVExporter = require('../utilities/csv.exporter')

class ReportController {
    async getReminders(req, res, next) {
        try {
            const rows = await reportService.getReminders()
            return res.json(rows)
        } catch (error) {
            return next(error)
        }
    }

    async getBookHistory(req, res, next) {
        try {
            const { bookId, bookTitle } = req.body
            const { rows, book } = await reportService.search(bookId, bookTitle)
            return res.json({ rows, book })
        } catch (error) {
            return next(error)
        }
    }

    async exportToCSV(req, res, next) {
        try {
            const { bookId, bookTitle } = req.body
            const { rows, book} = await reportService.search(bookId, bookTitle)
            const filePath = CSVExporter.exportBookHistory({ rows, book })
            res.download(filePath)
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = new ReportController()