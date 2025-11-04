const db = require("../../db")
const BookSubject = require("../models/booksubject")

class SubjectRepository {
    async findById(id) {
        const result = await db.query(`
            SELECT * FROM book_subjects 
            WHERE subject_id = $1`,
            [id]
        )

        const row = result.rows[0]
        if (row) {
            const booksubject = new BookSubject(row.subject_id, row.topic)
            return booksubject
        }
        
        return null
    }
}

module.exports = new SubjectRepository()