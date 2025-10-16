const db = require("../../db")
const Book = require("../models/book")

class BookRepository {
    async getAll() {
        const result = await db.query(`
            SELECT books.book_id, books.title, books.author_id
            FROM books
            ORDER BY books.title
        `);

        const rows = result.rows
        const list = rows.map(row => new Book(row.book_id, row.title, null, null, row.author_id, null, null))
        return list
    }
    
    async findById(id) {
        const result = await db.query(`
            SELECT books.*, ARRAY_AGG(DISTINCT book_subjects_rel.subject_id) AS subject_ids, ARRAY_AGG(DISTINCT book_covers_rel.cover_id) AS cover_ids FROM books
            LEFT JOIN book_subjects_rel ON books.book_id = book_subjects_rel.book_id
            LEFT JOIN book_covers_rel ON books.book_id = book_subjects_rel.book_id
            WHERE books.book_id = $1
            GROUP BY books.book_id`,
            [id]
        )

        const row = result.rows[0]
        if (row) {
            const book = new Book(row.book_id, row.title, row.first_published, row.description, row.author_id, row.subject_ids || [], row.cover_ids || [])
            return book
        }
        
        return null
    }

    async findByParameters(title, author, subject) {
        const conditions = []
        const params = []

        if (title) {
            params.push(`%${title}%`);
            conditions.push(`books.title ILIKE $${params.length}`);
        }

        if (author) {
            params.push(`%${author}%`);
            conditions.push(`authors.name ILIKE $${params.length}`);
        }

        if (subject) {
            params.push(`%${subject}%`);
            conditions.push(`book_subjects.topic ILIKE $${params.length}`);
        }

        const result = await db.query(`
            SELECT books.book_id, books.title, books.author_id FROM books
            JOIN authors ON books.author_id = authors.author_id
            LEFT JOIN book_subjects_rel ON books.book_id = book_subjects_rel.book_id
            LEFT JOIN book_subjects ON book_subjects_rel.subject_id = book_subjects.subject_id
            ${conditions.length > 0 ? `WHERE ` + conditions.join(` AND `) : ``}
            GROUP BY books.book_id
            ORDER BY books.title`, 
            params
        )

        const rows = result.rows
        const list = rows.map(row => new Book(row.book_id, row.title, null, null, row.author_id, null, null))
        return list
    }
}

module.exports = new BookRepository()