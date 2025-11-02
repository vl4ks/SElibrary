const historyRepository = require("../repositories/history.repository")
const History = require("../models/history")

class CirculationService {
    async circulation(customerId) {
        const allRecords = await historyRepository.findByCustomerId(customerId)
        
        const currentIssues = allRecords.filter(record => record.status === "issued")

        const history = allRecords.filter(record => record.status !== "issued")

        return { currentIssues, history }
    }

    async issue(bookId, customerId) {
        const issueDate = new Date()
        const returnDate = new Date()
        returnDate.setDate(returnDate.getDate() + 14) // например, 14 дней на возврат

        const newHistory = new History(
            null,
            bookId,
            customerId,
            issueDate,
            returnDate,
            "issued",
            "librarian", // кто выдал — можно позже заменить на ID пользователя, если доработать входные параметры то будет admin id
            null         // еще не получено обратно
        )

        await historyRepository.create(newHistory)
    }

    async return(bookId, customerId) {
        const allRecords = await historyRepository.findByCustomerId(customerId)
        const activeRecord = allRecords.find(r => r.book_id === bookId && r.status === "issued")

        const newHistory = new History(
            null,
            bookId,
            customerId,
            activeRecord.issue_date,
            new Date(),
            "returned",
            activeRecord.issued_by,
            "librarian" // кто принял возврат
        )

        await historyRepository.create(newHistory)
    }

    async renew(bookId, customerId) {
        const allRecords = await historyRepository.findByCustomerId(customerId)
        const activeRecord = allRecords.find(r => r.book_id === bookId && r.status === "issued")


        const extendedReturnDate = new Date(activeRecord.return_date)
        extendedReturnDate.setDate(extendedReturnDate.getDate() + 7) // продление на неделю, можно доработать если передавать параметр

        const newHistory = new History(
            null,
            bookId,
            customerId,
            activeRecord.issue_date,
            extendedReturnDate,
            "renewed",
            activeRecord.issued_by,
            null
        )

        await historyRepository.create(newHistory)
    }
}

module.exports = new CirculationService()
