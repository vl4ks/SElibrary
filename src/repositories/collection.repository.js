const db = require("../../db");
const Collection = require("../models/collection");
const CollectionBook = require("../models/collectionBook");

class CollectionRepository {

    async findAll() {
        const result = await db.query(`
            SELECT 
                c.collection_id,
                c.title,
                cb.id AS book_id,
                cb.title AS book_title,
                cb.image
            FROM collections c
            LEFT JOIN collection_books cb 
                ON c.collection_id = cb.collection_id
            ORDER BY c.collection_id
        `);

        const map = new Map();

        result.rows.forEach(r => {
            if (!map.has(r.collection_id)) {
                map.set(
                    r.collection_id,
                    new Collection(r.collection_id, r.title, [])
                );
            }

            if (r.book_id) {
                map.get(r.collection_id).books.push(
                    new CollectionBook(r.book_id, r.book_title, r.image)
                );
            }
        });

        return [...map.values()];
    }

    async create(title) {
        const res = await db.query(`
            INSERT INTO collections (title)
            VALUES ($1)
            RETURNING collection_id
        `, [title]);

        return res.rows[0].collection_id;
    }

    async update(id, title) {
        await db.query(`
            UPDATE collections
            SET title = $1
            WHERE collection_id = $2
        `, [title, id]);
    }

    async delete(id) {
        await db.query(`
            DELETE FROM collections
            WHERE collection_id = $1
        `, [id]);
    }

    async replaceBooks(collectionId, books) {
        await db.query(`
            DELETE FROM collection_books
            WHERE collection_id = $1
        `, [collectionId]);

        for (const b of books) {
            await db.query(`
                INSERT INTO collection_books (collection_id, title, image)
                VALUES ($1, $2, $3)
            `, [collectionId, b.title, b.image]);
        }
    }
}

module.exports = new CollectionRepository();