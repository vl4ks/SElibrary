const CollectionController = require('../src/controllers/collection.controller');
const collectionService = require('../src/services/collection.service');

jest.mock('../src/services/collection.service');

describe('CollectionController', () => {
    let controller;
    let mockReq, mockRes;

    beforeEach(() => {
        controller = new CollectionController(collectionService);
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            sendStatus: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('create', () => {
        test('ТК-027: Доступ к управлению выставками для неавторизованных', async () => {
            mockReq = {
                session: {},
                body: { title: 'Test Collection' }
            };

            await controller.create(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
            expect(collectionService.create).not.toHaveBeenCalled();
        });
    });
});