const db = require("../../db")
const Admin = require("../models/admin")

class AdminRepository {
    async findByLogin(login) {
        const result = await db.query(`
            SELECT * FROM admins 
            WHERE login = $1`,
            [login]
        )

        const row = result.rows[0]
        if (row) {
            const admin = new Admin(row.user_id, row.login, row.password)
            return admin
        }
        
        return null
    }
}

module.exports = new AdminRepository()