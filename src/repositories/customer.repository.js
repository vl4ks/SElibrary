const db = require("../../db");
const Customer = require("../models/customer");

class CustomerRepository {
    async findById(id) {
        const result = await db.query(`
            SELECT *
            FROM customers
            WHERE customer_id = $1
        `, [id]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];

        return new Customer(
            row.customer_id,
            row.name,
            row.address,
            row.postal_code,
            row.city,
            row.phone,
            row.email
        );
    }

    async findByParameters(id, name) {
        const conditions = [];
        const params = [];

        if (id) {
            params.push(id);
            conditions.push(`customer_id = $${params.length}`);
        }

        if (name) {
            params.push(`%${name}%`);
            conditions.push(`name ILIKE $${params.length}`);
        }

        const result = await db.query(`
            SELECT *
            FROM customers
            ${conditions.length > 0 ? `WHERE ` + conditions.join(" AND ") : ""}
            ORDER BY name
        `, params);

        return result.rows.map(row =>
            new Customer(
                row.customer_id,
                row.name,
                row.address,
                row.postal_code,
                row.city,
                row.phone,
                row.email
            )
        );
    }

    async create(customer) {
        const result = await db.query(`
            INSERT INTO customers (name, address, postal_code, city, phone, email)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING customer_id
        `, [
            customer.name,
            customer.address,
            customer.postalCode,
            customer.city,
            customer.phone,
            customer.email
        ]);

        return result.rows[0].customer_id;
    }

    async update(customer) {
        await db.query(`
            UPDATE customers
            SET name = $1,
                address = $2,
                postal_code = $3,
                city = $4,
                phone = $5,
                email = $6
            WHERE customer_id = $7
        `, [
            customer.name,
            customer.address,
            customer.postalCode,
            customer.city,
            customer.phone,
            customer.email,
            customer.customerID
        ]);
    }
}

module.exports = new CustomerRepository();
