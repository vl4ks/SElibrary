const circulationService = require('../src/services/circulation.service');

jest.mock('../src/repositories/history.repository');
jest.mock('../src/repositories/customer.repository');
jest.mock('../src/repositories/book.repository');

const historyRepository = require('../src/repositories/history.repository');
const customerRepository = require('../src/repositories/customer.repository');
const bookRepository = require('../src/repositories/book.repository');

describe('CirculationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('issue', () => {
        test('TK-020: Книга не найдена', async () => {
            bookRepository.findById.mockResolvedValue(null);
            customerRepository.findById.mockResolvedValue({ id: 1, name: 'John Doe' });

            await expect(circulationService.issue(999, 1)).rejects.toThrow('Book not found in the catalog');
        });

        test('TK-021: Клиент не найден', async () => {
            bookRepository.findById.mockResolvedValue({ bookID: 1, title: 'Test Book' });
            customerRepository.findById.mockResolvedValue(null);

            await expect(circulationService.issue(1, 999)).rejects.toThrow('Customer not found in the system');
        });
    });
});