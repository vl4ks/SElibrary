const db = require("../../db")
const History = require("../models/history")

class HistoryRepository {
    async getAll() {
        const result = await db.query(`
            SELECT * FROM history
            ORDER BY return_date ASC`
        )

        const rows = result.rows
        const list = rows.map(row => new History(row.history_id, row.book_id, row.issue_date, row.return_date, row.status, row.issued_by, row.received_by))
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
            [`%${book_title}%`]
        )

        const rows = result.rows
        const list = rows.map(row => new History(row.history_id, row.book_id, row.issue_date, row.return_date, row.status, row.issued_by, row.received_by))
        return list
    }

    async findByCustomerId(customer_id) {
        const result = await db.query(`
            SELECT * FROM history
            WHERE customer_id = $1`,
            [customer_id]
        )

        const rows = result.rows
        const list = rows.map(row => new History(row.history_id, row.book_id, row.issue_date, row.return_date, row.status, row.issued_by, row.received_by))
        return list
    }

    async create(history) {
        const result = await db.query(`
            INSERT INTO history (book_id, issue_date, return_date, status, issued_by, received_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING history_id`,
            [history.book_id, history.issue_date, history.return_date, history.status, history.issued_by, history.received_by]
        )
        return result.rows[0].history_id
    }
}

module.exports = new HistoryRepository()