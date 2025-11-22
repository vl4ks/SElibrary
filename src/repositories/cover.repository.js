const db = require("../../db")
const BookCover = require("../models/bookcover")

class BookCoverRepository {
    async findById(id) {
        const result = await db.query(`
            SELECT * FROM book_covers
            WHERE cover_id = $1`,
            [id]
        );

        const row = result.rows[0]
        if (row) {
            const bookCover = new BookCover(row.cover_id, row.file_path)
            return bookCover
        }
        
        return null
    }
}

module.exports = new BookCoverRepository()
