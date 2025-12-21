const repository = require("../repositories/collection.repository");
const db = require("../../db");
const { BadRequestError } = require("../errors");

class CollectionService {

    async getAll() {
        return repository.findAll();
    }

    async create(data) {
        await this.validateBooksExist(data.books || []);

        const id = await repository.create(data.title);
        await repository.replaceBooks(id, data.books || []);
        return id;
    }

    async update(id, data) {
        await this.validateBooksExist(data.books || []);

        await repository.update(id, data.title);
        await repository.replaceBooks(id, data.books || []);
    }

    async delete(id) {
        await repository.delete(id);
    }

    async validateBooksExist(books) {
        for (const b of books) {
            const result = await db.query(
                `SELECT book_id FROM books WHERE title = $1`,
                [b.title]
            );

            if (result.rows.length === 0) {
                throw new BadRequestError(`Книга "${b.title}" не найдена`);
            }
        }
    }
}

module.exports = new CollectionService();
