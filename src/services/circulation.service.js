const historyRepository = require("../repositories/history.repository");
const customerRepository = require("../repositories/customer.repository");
const History = require("../models/history");
const { BadRequestError, NotFoundError } = require("../errors");

class CirculationService {
    async circulation(customerId) {
        console.log('CirculationService.circulation called with customerId:', customerId)
        const customer = await customerRepository.findById(customerId);
        if (!customer) {
            console.log('CirculationService.circulation throwing: Customer not found')
            throw new NotFoundError(`Customer with ID ${customerId} not found`);
        }

        const allRecords = await historyRepository.findByCustomerId(customerId);
        const now = new Date();

        const currentIssues = allRecords
            .filter(r => r.status === "issued")
            .map(r => ({
                ...r,
                overdue: new Date(r.returnDate) < now
            }));

        const history = allRecords.filter(r => r.status !== "issued");

        const result = { customer, currentIssues, history };
        console.log('CirculationService.circulation returning', result)
        return result;
    }

    async issue(bookId, customerId) {
        console.log('CirculationService.issue called with', { bookId, customerId })
        const maxBooksPerCustomer = 5;
        const issuedRecords = await historyRepository.findByCustomerId(customerId);
        const countOfIssue = issuedRecords.filter(r => r.status === "issued").length;
        if (countOfIssue === maxBooksPerCustomer) {
            console.log('CirculationService.issue throwing: Max limit reached')
            throw new BadRequestError(`Max limit of issued books (${maxBooksPerCustomer}) reached`);
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
            "issued",
            "librarian",
            null
        );

        await historyRepository.create(newHistory);
        console.log('CirculationService.issue completed successfully')
    }

    async return(bookId, customerId) {
        console.log('CirculationService.return called with', { bookId, customerId })
        const allRecords = await historyRepository.findByCustomerId(customerId);
        const activeRecord = allRecords.find(r => r.bookID === bookId && r.status === "issued");

        if (!activeRecord) {
            console.log('CirculationService.return throwing: Active issued record not found')
            throw new BadRequestError("Active issued record not found");
        }

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

        const result = { isOverdue };
        console.log('CirculationService.return returning', result)
        return result;
    }

    async renew(bookId, customerId) {
        console.log('CirculationService.renew called with', { bookId, customerId })
        const allRecords = await historyRepository.findByCustomerId(customerId);
        const activeRecord = allRecords.find(r => r.bookID === bookId && r.status === "issued");

        if (!activeRecord) {
            console.log('CirculationService.renew throwing: Active issued record not found')
            throw new BadRequestError("Active issued record not found");
        }

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
        console.log('CirculationService.renew completed successfully')
    }
}

module.exports = new CirculationService();
