const db = require("../../db")
const Author = require("../models/author")
const { formatDate } = require("../utilities/date.utility")

class AuthorRepository {
    async findById(id) {
        const result = await db.query(`
            SELECT * FROM authors
            WHERE author_id = $1`,
            [id]
        )

        const row = result.rows[0]
        if (row) {
            const author = new Author(row.author_id, row.name, formatDate(row.birth_date), formatDate(row.death_date), row.bio, row.wikipedia)
            return author
        }
        
        return null
    }
}

module.exports = new AuthorRepository()