const historyRepository = require("../repositories/history.repository");
const customerRepository = require("../repositories/customer.repository");
const bookRepository = require("../repositories/book.repository");
const History = require("../models/history");
const { BadRequestError, NotFoundError } = require("../errors");
const db = require("../../db");

class CirculationService {

    async circulation(customerId) {
        const customer = await customerRepository.findById(customerId);
        if (!customer) {
            throw new NotFoundError(`Customer with ID ${customerId} not found`);
        }

        const allRecords = await historyRepository.findByCustomerId(customerId);
        const now = new Date();

        const currentIssues = allRecords
            .filter(r => r.status === false)
            .map(r => ({
                ...r,
                overdue: r.returnDate && r.returnDate < now
            }));

        const history = allRecords.filter(r => r.status === true);

        return { customer, currentIssues, history };
    }

    async issue(bookId, customerId) {
    if (!bookId || !customerId) {
        throw new BadRequestError("Book ID and Customer ID are required");
    }

    const customer = await customerRepository.findById(customerId);
    if (!customer) {
        throw new NotFoundError("Customer not found");
    }

    const book = await bookRepository.findById(bookId);
    if (!book) {
        throw new NotFoundError("Book not found");
    }

    const allRecords = await historyRepository.findByCustomerId(customerId);

    const activeBooks = allRecords.filter(r => r.status === false);
    if (activeBooks.length >= 5) {
        throw new BadRequestError("Нельзя выдать больше 5 книг одному пользователю");
    }

    const issueDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 21);

    const history = new History(
        null,
        bookId,
        book.title,
        customerId,
        issueDate,
        returnDate,
        false,
        1,
        null
    );

    return await historyRepository.create(history);
}



    async return(bookId, customerId) {
        const book = await bookRepository.findById(bookId);
        if (!book) {
            throw new NotFoundError("Book not found in the catalog");
        }

        const customer = await customerRepository.findById(customerId);
        if (!customer) {
            throw new NotFoundError("Customer not found in the system");
        }

        const allRecords = await historyRepository.findByCustomerId(customerId);

        const activeRecord = allRecords.find(
            r => r.bookID === bookId && r.status === false
        );

        if (!activeRecord) {
            throw new BadRequestError("Active issue record not found");
        }

        console.log('allRecords for renew:', allRecords);

        const today = new Date();
        const isOverdue = activeRecord.returnDate && new Date(activeRecord.returnDate) < today;

        activeRecord.status = true;
        activeRecord.returnDate = today;
        activeRecord.receivedBy = 1;

        await historyRepository.update(activeRecord);

        return { isOverdue };
    }

    async renew(bookId, customerId) {
    const customer = await customerRepository.findById(customerId);
    if (!customer) {
        throw new NotFoundError("Customer not found in the system");
    }

    const book = await bookRepository.findById(bookId);
    if (!book) {
        throw new NotFoundError("Book not found in the catalog");
    }

    const allRecords = await historyRepository.findByCustomerId(customerId);
    const activeRecord = allRecords.find(
        r => r.bookID === bookId && r.status === false
    );

    if (!activeRecord) {
        throw new BadRequestError("Active issue record not found");
    }

    const issueDate = new Date(activeRecord.issueDate);
    const currentReturnDate = new Date(activeRecord.returnDate);

    const maxReturnDate = new Date(issueDate);
    maxReturnDate.setDate(maxReturnDate.getDate() + 28);

    if (currentReturnDate > maxReturnDate - 1) { 
        throw new BadRequestError("Продлевать можно только один раз");
    }

    let extendedReturnDate = currentReturnDate instanceof Date && !isNaN(currentReturnDate)
        ? new Date(currentReturnDate)
        : new Date();

    extendedReturnDate.setDate(extendedReturnDate.getDate() + 7);
    activeRecord.returnDate = extendedReturnDate;

    await historyRepository.update(activeRecord);
}



    async getBookTitleById(bookId) {
        if (!bookId) return null;

        const result = await db.query(
            `SELECT title FROM books WHERE book_id = $1`,
            [bookId]
        );

        if (result.rows.length === 0) return null;

        return result.rows[0].title;
    }
}

module.exports = new CirculationService();
