const historyRepository = require("../repositories/history.repository")
const History = require("../models/history")
const { BadRequestError } = require("../errors")

class CirculationService {
    async circulation(customerId) {
        const allRecords = await historyRepository.findByCustomerId(customerId)
        
        const currentIssues = allRecords.filter(record => record.status === "issued")

        const history = allRecords.filter(record => record.status !== "issued")

        return { currentIssues, history }
    }

    async issue(bookId, customerId) {
        const maxBooksPerCustomer = 5
        const issuedRecords = await historyRepository.findByCustomerId(customerId)
        const countOfIssue = issuedRecords.filter(r => r.status === "issued").length
        if (countOfIssue === maxBooksPerCustomer)
            return new BadRequestError(`Max limit of issued books (${maxBooksPerCustomer}) reached`)

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
        const activeRecord = allRecords.find(r => r.bookID === bookId && r.status === "issued")

        const newHistory = new History(
            null,
            bookId,
            customerId,
            activeRecord.issueDate,
            new Date(),
            "returned",
            activeRecord.issuedBy,
            "librarian" // кто принял возврат
        )

        await historyRepository.create(newHistory)
    }

    async renew(bookId, customerId) {
        const allRecords = await historyRepository.findByCustomerId(customerId)
        const activeRecord = allRecords.find(r => r.bookID === bookId && r.status === "issued")


        const extendedReturnDate = new Date(activeRecord.returnDate)
        extendedReturnDate.setDate(extendedReturnDate.getDate() + 7) // продление на неделю, можно доработать если передавать параметр

        const newHistory = new History(
            null,
            bookId,
            customerId,
            activeRecord.issueDate,
            extendedReturnDate,
            "renewed",
            activeRecord.issuedBy,
            null
        )

        await historyRepository.create(newHistory)
    }
}

module.exports = new CirculationService()
