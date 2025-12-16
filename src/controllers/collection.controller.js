class CollectionController {
    constructor(service) {
        this.service = service;
    }

    async getAll(req, res) {
        const collections = await this.service.getAll();
        res.json(collections);
    }

    async create(req, res) {
        if (!req.session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const id = await this.service.create(req.body);
        res.status(201).json({ id });
    }

    async update(req, res) {
        if (!req.session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        await this.service.update(req.params.id, req.body);
        res.sendStatus(204);
    }

    async delete(req, res) {
        if (!req.session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        await this.service.delete(req.params.id);
        res.sendStatus(204);
    }
}

module.exports = CollectionController;
