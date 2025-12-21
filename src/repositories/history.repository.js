const db = require("../../db")
const History = require("../models/history")
const { formatDate } = require("../utilities/date.utility")

class HistoryRepository {
    async findByOverdue(flag) {
    const result = await db.query(`
        SELECT
            h.history_id,
            h.book_id,
            b.title,
            h.customer_id,
            h.issue_date,
            h.return_date,
            h.status,
            h.issued_by,
            h.received_by
        FROM history h
        JOIN books b ON b.book_id = h.book_id
        WHERE h.status = $1
        ORDER BY h.return_date ASC
    `, [flag]);

    return result.rows.map(row => {
        const history = new History(
            row.history_id,
            row.book_id,
            row.title,
            row.customer_id,
            row.issue_date,
            row.return_date,
            row.status,
            row.issued_by,
            row.received_by
        );
        history.issueDate = formatDate(row.issue_date);
        history.returnDate = formatDate(row.return_date);
        return history;
    });
}


    async findByParameters(book_id, book_title) {
        const conditions = []
        const params = []

        if (book_id) {
            params.push(book_id);
            conditions.push(`history.book_id = $${params.length}`);
        }

        if (book_title) {
            params.push(`%${book_title}%`);
            conditions.push(`books.title ILIKE $${params.length}`);
        }

        const result = await db.query(`
            SELECT * FROM history
            JOIN books ON history.book_id = books.book_id
            ${conditions.length > 0 ? `WHERE ` + conditions.join(` AND `) : ``}
            ORDER BY history.history_id`,
            params
        )

        const rows = result.rows
        const list = rows.map(row => {
            const history = new History(row.history_id, row.book_id, row.title, row.customer_id, row.issue_date, row.return_date, row.status, row.issued_by, row.received_by)
            history.issueDate = formatDate(row.issue_date)
            history.returnDate = formatDate(row.return_date)
            return history
        })
        return list
    }

    async findByCustomerId(customer_id) {
    const result = await db.query(`
        SELECT
            h.history_id,
            h.book_id,
            b.title,
            h.customer_id,
            h.issue_date,
            h.return_date,
            h.status,
            h.issued_by,
            h.received_by
        FROM history h
        JOIN books b ON b.book_id = h.book_id
        WHERE h.customer_id = $1
        ORDER BY h.issue_date DESC
    `, [customer_id]);

    return result.rows.map(row => {
        const history = new History(
            row.history_id,
            row.book_id,
            row.title,
            row.customer_id,
            row.issue_date,
            row.return_date,
            row.status,
            row.issued_by,
            row.received_by
        );
        history.issueDate = formatDate(row.issue_date);
        history.returnDate = formatDate(row.return_date);
        return history;
    });
}


    async update(history) {
    const result = await db.query(`
        UPDATE history
        SET return_date = $1, status = $2, received_by = $3
        WHERE history_id = $4
        RETURNING history_id
    `,
    [history.returnDate, history.status, history.receivedBy, history.historyID]
    );

    if (result.rows.length === 0) {
        throw new Error("Failed to update history record");
    }

    return result.rows[0].history_id;
}


    async create(history) {
    const result = await db.query(`
        INSERT INTO history (
            book_id,
            customer_id,
            issue_date,
            return_date,
            status,
            issued_by,
            received_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING history_id
    `,
    [
        history.bookID,
        history.customerID,
        history.issueDate,
        history.returnDate,
        history.status,
        history.issuedBy,
        history.receivedBy
    ]);

    return result.rows[0].history_id;
}

}

module.exports = new HistoryRepository()