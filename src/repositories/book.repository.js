const db = require("../../db")
const Book = require("../models/book")
const { formatDate } = require("../utilities/date.utility")

class BookRepository {
    async findById(id) {
        const result = await db.query(`
            SELECT books.*, COALESCE(ARRAY_AGG(DISTINCT book_authors_rel.author_id) FILTER (WHERE book_authors_rel.author_id IS NOT NULL), '{}') AS author_ids, COALESCE(ARRAY_AGG(DISTINCT book_subjects_rel.subject_id) FILTER (WHERE book_subjects_rel.subject_id IS NOT NULL), '{}') AS subject_ids, COALESCE(ARRAY_AGG(DISTINCT book_covers_rel.book_cover_id) FILTER (WHERE book_covers_rel.book_cover_id IS NOT NULL), '{}') AS cover_ids FROM books
            LEFT JOIN book_authors_rel ON books.book_id = book_authors_rel.book_id
            LEFT JOIN book_subjects_rel ON books.book_id = book_subjects_rel.book_id
            LEFT JOIN book_covers_rel ON books.book_id = book_covers_rel.book_id
            WHERE books.book_id = $1
            GROUP BY books.book_id`,
            [id]
        )

        const row = result.rows[0]
        if (row) {
            const book = new Book(row.book_id, row.title, row.subtitle, formatDate(row.first_published), row.description, row.author_ids, row.subject_ids, row.cover_ids)
            return book
        }
        
        return null
    }

    async findByParameters(title, author, subject, limit, offset = 0) {
        const conditions = []
        const params = []

        if (title) {
            params.push(`%${title}%`)
            conditions.push(`books.title ILIKE $${params.length}`)
        }

        if (author) {
            params.push(`%${author}%`)
            conditions.push(`authors.name ILIKE $${params.length}`)
        }

        if (subject) {
            params.push(`%${subject}%`)
            conditions.push(`subjects.topic ILIKE $${params.length}`)
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

        params.push(limit)
        params.push(offset)

        const dataQuery = `
            SELECT
                books.book_id,
                books.title,
                COALESCE(ARRAY_AGG(DISTINCT book_authors_rel.author_id) FILTER (WHERE book_authors_rel.author_id IS NOT NULL), '{}') AS author_ids,
                STRING_AGG(DISTINCT authors.name, ', ') AS author_names
            FROM books
            LEFT JOIN book_authors_rel ON books.book_id = book_authors_rel.book_id
            LEFT JOIN authors ON book_authors_rel.author_id = authors.author_id
            LEFT JOIN book_subjects_rel ON books.book_id = book_subjects_rel.book_id
            LEFT JOIN subjects ON book_subjects_rel.subject_id = subjects.subject_id
            ${whereClause}
            GROUP BY books.book_id, books.title
            ORDER BY books.book_id
            LIMIT $${params.length - 1} OFFSET $${params.length};
        `

        const countQuery = `
            SELECT COUNT(DISTINCT books.book_id) AS total
            FROM books
            LEFT JOIN book_authors_rel ON books.book_id = book_authors_rel.book_id
            LEFT JOIN authors ON book_authors_rel.author_id = authors.author_id
            LEFT JOIN book_subjects_rel ON books.book_id = book_subjects_rel.book_id
            LEFT JOIN subjects ON book_subjects_rel.subject_id = subjects.subject_id
            ${whereClause};
        `

        const dataResult = await db.query(dataQuery, params)
        const countResult = await db.query(countQuery, params.slice(0, -2))

        return {
            books: dataResult.rows.map(row => new Book(row.book_id, row.title, null, null, null, row.author_ids, null, null)),
            total: parseInt(countResult.rows[0].total, 10)
        }
    }
}

module.exports = new BookRepository()