const circulationService = require('../services/circulation.service');
const { BadRequestError, NotFoundError } = require('../errors');

class CirculationController {
    async getCustomerCirculation(req, res, next) {
        console.log('CirculationController.getCustomerCirculation called with req.params:', req.params)
        try {
            const { id } = req.params;

            if (!id) throw new BadRequestError("Customer ID is required");

            const data = await circulationService.circulation(id);

            console.log('CirculationController.getCustomerCirculation returning', data)
            res.json(data);

        } catch (err) {
            console.log('CirculationController.getCustomerCirculation error:', err.message)
            next(err);
        }
    }

    async issue(req, res, next) {
        console.log('CirculationController.issue called with req.body:', req.body)
        try {
            const { bookId, customerId } = req.body;

            if (!bookId) throw new BadRequestError("bookId is required");
            if (!customerId) throw new BadRequestError("customerId is required");

            await circulationService.issue(bookId, customerId);

            console.log('CirculationController.issue successful')
            res.json({ message: "Book issued successfully" });

        } catch (err) {
            console.log('CirculationController.issue error:', err.message)
            next(err);
        }
    }

    async return(req, res, next) {
        console.log('CirculationController.return called with req.body:', req.body)
        try {
            const { bookId, customerId } = req.body;

            if (!bookId) throw new BadRequestError("bookId is required");
            if (!customerId) throw new BadRequestError("customerId is required");

            await circulationService.return(bookId, customerId);

            console.log('CirculationController.return successful')
            res.json({ message: "Book returned successfully" });

        } catch (err) {
            console.log('CirculationController.return error:', err.message)
            next(err);
        }
    }

    async renew(req, res, next) {
        console.log('CirculationController.renew called with req.body:', req.body)
        try {
            const { bookId, customerId } = req.body;

            if (!bookId) throw new BadRequestError("bookId is required");
            if (!customerId) throw new BadRequestError("customerId is required");

            await circulationService.renew(bookId, customerId);

            console.log('CirculationController.renew successful')
            res.json({ message: "Book renewed successfully" });

        } catch (err) {
            console.log('CirculationController.renew error:', err.message)
            next(err);
        }
    }
}

module.exports = new CirculationController();
