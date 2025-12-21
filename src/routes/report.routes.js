const express = require('express')
const router = express.Router()
const reportController = require('../controllers/report.controller')

router.get('/reminders', reportController.getReminders.bind(reportController))
router.post('/search', reportController.getBookHistory.bind(reportController))
router.post('/export-history', reportController.exportToCSV.bind(reportController))
router.get('/export-reminders', reportController.exportReminders.bind(reportController))

module.exports = router