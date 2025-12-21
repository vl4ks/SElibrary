const reportService = require('../services/report.service')
const CSVExporter = require('../utilities/csv.exporter')

class ReportController {
    async getReminders(req, res, next) {
        console.log('ReportController.getReminders called')
        try {
            const rows = await reportService.getReminders()
            console.log('ReportController.getReminders returning', rows)
            return res.json(rows)
        } catch (error) {
            console.log('ReportController.getReminders error:', error.message)
            return next(error)
        }
    }

    async getBookHistory(req, res, next) {
        console.log('ReportController.getBookHistory called with req.body:', req.body)
        try {
            const { bookId, bookTitle } = req.body
            const { rows, book } = await reportService.search(bookId, bookTitle)
            console.log('ReportController.getBookHistory returning', { rows, book })
            return res.json({ rows, book })
        } catch (error) {
            console.log('ReportController.getBookHistory error:', error.message)
            return next(error)
        }
    }

    async exportToCSV(req, res, next) {
        console.log('ReportController.exportToCSV called with req.body:', req.body)
        try {
            const { bookId, bookTitle } = req.body
            const { rows, book} = await reportService.search(bookId, bookTitle)
            const filePath = CSVExporter.exportBookHistory({ rows, book })
            console.log('ReportController.exportToCSV downloading file:', filePath)
            res.download(filePath)
        } catch (error) {
            console.log('ReportController.exportToCSV error:', error.message)
            return next(error)
        }
    }

    async exportReminders(req, res, next) {
        console.log('ReportController.exportReminders called')
        try {
            const rows = await reportService.getReminders()
            const filePath = CSVExporter.exportReminders(rows)
            console.log('ReportController.exportReminders downloading file:', filePath)
            res.download(filePath)
        } catch (error) {
            console.log('ReportController.exportReminders error:', error.message)
            return next(error)
        }
    }
}

module.exports = new ReportController()