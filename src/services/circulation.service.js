const historyRepository = require("../repositories/history.repository");
const customerRepository = require("../repositories/customer.repository");
const History = require("../models/history");
const { BadRequestError, NotFoundError } = require("../errors");

class CirculationService {

    async circulation(customerId) {
        const customer = await customerRepository.findById(customerId);

        if (!customer) {
            throw new NotFoundError(`Customer with ID ${customerId} not found`);
        }

        const allRecords = await historyRepository.findByCustomerId(customerId);
        const now = new Date();

        const currentIssues = allRecords
            .filter(r => r.status === false) // книги на руках
            .map(r => ({
                ...r,
                overdue: r.returnDate && new Date(r.returnDate) < now
            }));

        const history = allRecords.filter(r => r.status === true);

        return { customer, currentIssues, history };
    }

    async issue(bookId, customerId) {
        const maxBooksPerCustomer = 5;

        const allRecords = await historyRepository.findByCustomerId(customerId);
        const countOfIssue = allRecords.filter(r => r.status === false).length;

        if (countOfIssue >= maxBooksPerCustomer) {
            throw new BadRequestError(
                `Max limit of issued books (${maxBooksPerCustomer}) reached`
            );
        }

        const issueDate = new Date();
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 21);

        const newHistory = new History(
            null,
            bookId,
            customerId,
            issueDate,
            returnDate,
            false,          // status: книга на руках
            "librarian",
            null
        );

        await historyRepository.create(newHistory);
    }

    async return(bookId, customerId) {
        const allRecords = await historyRepository.findByCustomerId(customerId);

        const activeRecord = allRecords.find(
            r => r.bookID === bookId && r.status === false
        );

        if (!activeRecord) {
            throw new BadRequestError("Active issue record not found");
        }

        const today = new Date();
        const isOverdue =
            activeRecord.returnDate &&
            new Date(activeRecord.returnDate) < today;

        activeRecord.status = true;
        activeRecord.returnDate = today;
        activeRecord.receivedBy = "librarian";

        await historyRepository.update(activeRecord);

        return { isOverdue };
    }

    async renew(bookId, customerId) {
        const allRecords = await historyRepository.findByCustomerId(customerId);

        const activeRecord = allRecords.find(
            r => r.bookID === bookId && r.status === false
        );

        if (!activeRecord) {
            throw new BadRequestError("Active issue record not found");
        }

        const extendedReturnDate = new Date(activeRecord.returnDate);
        extendedReturnDate.setDate(extendedReturnDate.getDate() + 7);

        activeRecord.returnDate = extendedReturnDate;

        await historyRepository.update(activeRecord);
    }
}

module.exports = new CirculationService();
