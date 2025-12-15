const repository = require("../repositories/collection.repository");

class CollectionService {

    async getAll() {
        return repository.findAll();
    }

    async create(data) {
        const id = await repository.create(data.title);
        await repository.replaceBooks(id, data.books || []);
        return id;
    }

    async update(id, data) {
        await repository.update(id, data.title);
        await repository.replaceBooks(id, data.books || []);
    }

    async delete(id) {
        await repository.delete(id);
    }
}

module.exports = new CollectionService();
