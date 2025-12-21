const reportService = require('../src/services/report.service');

jest.mock('../src/repositories/history.repository');
jest.mock('../src/repositories/book.repository');
jest.mock('../src/repositories/customer.repository');

const historyRepository = require('../src/repositories/history.repository');
const bookRepository = require('../src/repositories/book.repository');
const customerRepository = require('../src/repositories/customer.repository');

describe('ReportService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getReminders', () => {
        test('TK-028: Формирование отчета Reminders', async () => {
            const mockRows = [
                { bookID: 1, returnUntil: '2023-01-01', customerID: 1 },
                { bookID: 2, returnUntil: '2023-01-02', customerID: 2 }
            ];
            historyRepository.findByOverdue.mockResolvedValue(mockRows);
            bookRepository.findById.mockImplementation((id) => {
                if (id === 1) return Promise.resolve({ title: 'Book 1' });
                if (id === 2) return Promise.resolve({ title: 'Book 2' });
            });
            customerRepository.findById.mockResolvedValue({ name: 'Customer Name' });

            const result = await reportService.getReminders();

            expect(historyRepository.findByOverdue).toHaveBeenCalledWith(true);
            expect(result).toHaveLength(2);
            expect(result[0].title).toBe('Book 1');
            expect(result[1].title).toBe('Book 2');
        });
    });

    describe('search', () => {
        test('should search by bookId', async () => {
            const mockBook = { bookID: 1, title: 'Book 1' };
            const mockRows = [{ historyID: 1, bookID: 1 }];
            bookRepository.findById.mockResolvedValue(mockBook);
            historyRepository.findByParameters.mockResolvedValue(mockRows);
            customerRepository.findById.mockResolvedValue({ name: 'Customer Name' });

            const result = await reportService.search(1, null);

            expect(bookRepository.findById).toHaveBeenCalledWith(1);
            expect(historyRepository.findByParameters).toHaveBeenCalledWith(1, null);
            expect(result.rows).toEqual([{ ...mockRows[0], customerName: 'Customer Name' }]);
            expect(result.book).toEqual(mockBook);
        });

        test('should search by bookTitle', async () => {
            const mockRows = [{ historyID: 1, bookID: 1 }];
            historyRepository.findByParameters.mockResolvedValue(mockRows);
            customerRepository.findById.mockResolvedValue({ name: 'Customer Name' });

            const result = await reportService.search(null, 'Book Title');

            expect(historyRepository.findByParameters).toHaveBeenCalledWith(null, 'Book Title');
            expect(result.rows).toEqual([{ ...mockRows[0], customerName: 'Customer Name' }]);
            expect(result.book).toBeUndefined();
        });

        test('should throw error if both bookId and bookTitle provided', async () => {
            await expect(reportService.search(1, 'Title')).rejects.toThrow('Please search by either book ID or title, not both.');
        });

        test('TK-029: Экспорт в CSV - data preparation', async () => {
            const mockBook = { bookID: 1, title: 'Book 1' };
            const mockRows = [{ historyID: 1, bookID: 1, action: 'issued' }];
            bookRepository.findById.mockResolvedValue(mockBook);
            historyRepository.findByParameters.mockResolvedValue(mockRows);
            customerRepository.findById.mockResolvedValue({ name: 'Customer Name' });

            const result = await reportService.search(1, null);

            expect(result.rows).toEqual([{ ...mockRows[0], customerName: 'Customer Name' }]);
            expect(result.book).toEqual(mockBook);
        });
    });
});