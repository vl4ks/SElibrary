const historyRepository = require("../repositories/history.repository");
const customerRepository = require("../repositories/customer.repository");
const History = require("../models/history");
const { BadRequestError, NotFoundError } = require("../errors");

class CirculationService {
    async circulation(customerId) {
        const customer = await customerRepository.findById(customerId);
        if (!customer) throw new NotFoundError(`Customer with ID ${customerId} not found`);

        const allRecords = await historyRepository.findByCustomerId(customerId);
        const now = new Date();

        const currentIssues = allRecords
            .filter(r => r.status === "issued")
            .map(r => ({
                ...r,
                overdue: new Date(r.returnDate) < now
            }));

        const history = allRecords.filter(r => r.status !== "issued");

        return { customer, currentIssues, history };
    }

    async issue(bookId, customerId) {
        const maxBooksPerCustomer = 5;
        const issuedRecords = await historyRepository.findByCustomerId(customerId);
        const countOfIssue = issuedRecords.filter(r => r.status === "issued").length;
        if (countOfIssue === maxBooksPerCustomer)
            throw new BadRequestError(`Max limit of issued books (${maxBooksPerCustomer}) reached`);

        const issueDate = new Date();
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 21);

        const newHistory = new History(
            null,
            bookId,
            customerId,
            issueDate,
            returnDate,
            "issued",
            "librarian",
            null
        );

        await historyRepository.create(newHistory);
    }

    async return(bookId, customerId) {
        const allRecords = await historyRepository.findByCustomerId(customerId);
        const activeRecord = allRecords.find(r => r.bookID === bookId && r.status === "issued");

        if (!activeRecord) throw new BadRequestError("Active issued record not found");

        const today = new Date();
        const isOverdue = today > new Date(activeRecord.returnDate);

        const newHistory = new History(
            null,
            bookId,
            customerId,
            activeRecord.issueDate,
            today,
            "returned",
            activeRecord.issuedBy,
            "librarian"
        );

        await historyRepository.create(newHistory);

        return { isOverdue };
    }

    async renew(bookId, customerId) {
        const allRecords = await historyRepository.findByCustomerId(customerId);
        const activeRecord = allRecords.find(r => r.bookID === bookId && r.status === "issued");

        if (!activeRecord) throw new BadRequestError("Active issued record not found");

        const extendedReturnDate = new Date(activeRecord.returnDate);
        extendedReturnDate.setDate(extendedReturnDate.getDate() + 7);

        const newHistory = new History(
            null,
            bookId,
            customerId,
            activeRecord.issueDate,
            extendedReturnDate,
            "renewed",
            activeRecord.issuedBy,
            null
        );

        await historyRepository.create(newHistory);
    }
}

module.exports = new CirculationService();
