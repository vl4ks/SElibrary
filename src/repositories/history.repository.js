const db = require("../../db")
const History = require("../models/history")
const { formatDate } = require("../utilities/date.utility")

class HistoryRepository {
    async findByOverdue(flag) {
        const result = await db.query(`
            SELECT * FROM history
            WHERE status = $1
            ORDER BY return_date ASC`,
            [flag]
        )

        const rows = result.rows
        const list = rows.map(row => new History(row.history_id, row.book_id, row.customer_id, formatDate(row.issue_date), formatDate(row.return_date), row.status, row.issued_by, row.received_by))
        return list
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
            const history = new History(row.history_id, row.book_id, row.customer_id, formatDate(row.issue_date), formatDate(row.return_date), row.status, row.issued_by, row.received_by)
            history.title = row.title
            return history
        })
        return list
    }

    async findByCustomerId(customer_id) {
        const result = await db.query(`
            SELECT * FROM history
            WHERE customer_id = $1`,
            [customer_id]
        )

        const rows = result.rows
        const list = rows.map(row => new History(row.history_id, row.book_id, row.customer_id, formatDate(row.issue_date), formatDate(row.return_date), row.status, row.issued_by, row.received_by))
        return list
    }

    async update(history) {
        const result = await db.query(`
            UPDATE history
            SET return_date = $1, status = $2, received_by = $3
            WHERE history_id = $4`,
            [history.return_date, history.status, history.received_by, history.history_id]
        )
        return result.rows[0].history_id
    }

    async create(history) {
        const result = await db.query(`
            INSERT INTO history (book_id, customer_id, issue_date, return_date, status, issued_by, received_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING history_id`,
            [history.book_id, history.customer_id, history.issue_date, history.return_date, history.status, history.issued_by, history.received_by]
        )
        return result.rows[0].history_id
    }
}

module.exports = new HistoryRepository()