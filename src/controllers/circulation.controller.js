const circulationService = require('../services/circulation.service');
const { BadRequestError, NotFoundError } = require('../errors');

class CirculationController {
    async getCustomerCirculation(req, res, next) {
        try {
            const { id } = req.params;

            if (!id) throw new BadRequestError("Customer ID is required");

            const data = await circulationService.circulation(id);

            res.json(data);

        } catch (err) {
            next(err);
        }
    }

    async issue(req, res, next) {
        try {
            const { bookId, customerId } = req.body;

            if (!bookId) throw new BadRequestError("bookId is required");
            if (!customerId) throw new BadRequestError("customerId is required");

            await circulationService.issue(bookId, customerId);

            res.json({ message: "Book issued successfully" });

        } catch (err) {
            next(err);
        }
    }

    async return(req, res, next) {
        try {
            const { bookId, customerId } = req.body;

            if (!bookId) throw new BadRequestError("bookId is required");
            if (!customerId) throw new BadRequestError("customerId is required");

            await circulationService.return(bookId, customerId);

            res.json({ message: "Book returned successfully" });

        } catch (err) {
            next(err);
        }
    }

    async renew(req, res, next) {
        try {
            const { bookId, customerId } = req.body;

            if (!bookId) throw new BadRequestError("bookId is required");
            if (!customerId) throw new BadRequestError("customerId is required");

            await circulationService.renew(bookId, customerId);

            res.json({ message: "Book renewed successfully" });

        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CirculationController();
