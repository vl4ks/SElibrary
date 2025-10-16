const db = require("../../db")
const Author = require("../models/author")

class AuthorRepository {
    async findById(id) {
        const result = await db.query(`
            SELECT * FROM authors 
            WHERE id = $1`,
            [id]
        )

        const row = result.rows[0]
        if (row) {
            const author = new Author(row.author_id, row.name, row.birth_date, row.death_date, row.wikipedia)
            return author
        }
        
        return null
    }
}

module.exports = new AuthorRepository()