const db = require("../../db")
const Customer = require("../models/customer")

class CustomerRepository {
    async findByParameters(id, name) {
        const conditions = []
        const params = []

        if (id) {
            params.push(id);
            conditions.push(`customer_id = $${params.length}`);
        }

        if (name) {
            params.push(`%${name}%`);
            conditions.push(`name ILIKE $${params.length}`);
        }

        const result = await db.query(`
            SELECT * FROM customers
            ${conditions.length > 0 ? `WHERE ` + conditions.join(` AND `) : ``}
            ORDER BY name`, 
            params
        )

        const rows = result.rows
        const list = rows.map(row => new Customer(row.customer_id, row.name, row.address, row.postalcode, row.city, row.phone, row.email))
        return list
    }

    async create(customer) {
        const result = await db.query(`
            INSERT INTO customers (name, address, postalcode, city, phone, email) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING customer_id`,
            [customer.name, customer.address, customer.postalcode, customer.city, customer.phone, customer.email]
        )
        return result.rows[0].customer_id
    }

    async update(customer) {
        await db.query(`
            UPDATE requests 
            SET name = $1, address=$2, postalcode = $3, city = $4, phone = $5, email = $6
            WHERE customer_id = $7`,
            [customer.name, customer.address, customer.postalcode, customer.city, customer.phone, customer.email, customer.customer_id]
        )
    }
}

module.exports = new CustomerRepository()