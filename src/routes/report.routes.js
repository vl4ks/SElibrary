const express = require('express')
const router = express.Router()
const reportController = require('../controllers/report.controller')

router.get('/reminders', reportController.getReminders.bind(reportController))
router.post('/search', reportController.getBookHistory.bind(reportController))
router.post('/export', reportController.exportToCSV.bind(reportController))

module.exports = router