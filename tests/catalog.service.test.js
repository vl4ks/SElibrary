const catalogService = require('../src/services/catalog.service');

jest.mock('../src/repositories/book.repository');
jest.mock('../src/repositories/author.repository');
jest.mock('../src/repositories/cover.repository');
jest.mock('../src/repositories/subject.repository');

const bookRepository = require('../src/repositories/book.repository');
const authorRepository = require('../src/repositories/author.repository');
const coverRepository = require('../src/repositories/cover.repository');
const subjectRepository = require('../src/repositories/subject.repository');

describe('CatalogService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('search', () => {
        test('TK-003: Поиск книги по названию', async () => {
            const mockBooks = [
                { bookID: 1, title: 'Harry Potter and the Philosopher\'s Stone', authorIDs: [1] },
                { bookID: 2, title: 'Harry Potter and the Chamber of Secrets', authorIDs: [1] }
            ];
            bookRepository.findByParameters.mockResolvedValue({ books: mockBooks, total: 2 });
            authorRepository.findById.mockResolvedValue({ name: 'J.K. Rowling' });

            const result = await catalogService.search('Potter', null, null, 1);

            expect(bookRepository.findByParameters).toHaveBeenCalledWith('Potter', null, null, 10, 0);
            expect(result.rows).toHaveLength(2);
            expect(result.rows[0].book).toBe('Harry Potter and the Philosopher\'s Stone');
            expect(result.total).toBe(2);
        });

        test('TK-004: Поиск книги по автору', async () => {
            const mockBooks = [
                { bookID: 1, title: 'Harry Potter and the Philosopher\'s Stone', authorIDs: [1] }
            ];
            bookRepository.findByParameters.mockResolvedValue({ books: mockBooks, total: 1 });
            authorRepository.findById.mockResolvedValue({ name: 'J.K. Rowling' });

            const result = await catalogService.search(null, 'Rowling', null, 1);

            expect(bookRepository.findByParameters).toHaveBeenCalledWith(null, 'Rowling', null, 10, 0);
            expect(result.rows).toHaveLength(1);
            expect(result.rows[0].authors[0].name).toBe('J.K. Rowling');
        });

        test('TK-005: Комбинированный поиск', async () => {
            const mockBooks = [
                { bookID: 1, title: 'Harry Potter', authorIDs: [1] }
            ];
            bookRepository.findByParameters.mockResolvedValue({ books: mockBooks, total: 1 });
            authorRepository.findById.mockResolvedValue({ name: 'J.K. Rowling' });

            const result = await catalogService.search('Harry', 'Rowling', 'Fiction', 1);

            expect(bookRepository.findByParameters).toHaveBeenCalledWith('Harry', 'Rowling', 'Fiction', 10, 0);
            expect(result.rows).toHaveLength(1);
        });

        test('TK-006: Пагинация результатов', async () => {
            const mockBooks = Array(10).fill().map((_, i) => ({ bookID: i + 1, title: `Book ${i + 1}`, authorIDs: [1] }));
            bookRepository.findByParameters.mockResolvedValue({ books: mockBooks, total: 60 });
            authorRepository.findById.mockResolvedValue({ name: 'Author' });

            const result = await catalogService.search('Book', null, null, 2);

            expect(bookRepository.findByParameters).toHaveBeenCalledWith('Book', null, null, 10, 10); // page 2, offset 10
            expect(result.rows).toHaveLength(10);
            expect(result.total).toBe(60);
        });
    });

    describe('getBookInfo', () => {
        test('TK-007: Просмотр деталей книги', async () => {
            const mockBook = { bookID: 1, title: 'Harry Potter', authorIDs: [1], coverIDs: [1], subjectIDs: [1] };
            bookRepository.findById.mockResolvedValue(mockBook);
            authorRepository.findById.mockResolvedValue({ name: 'J.K. Rowling' });
            coverRepository.findById.mockResolvedValue({ url: 'cover.jpg' });
            subjectRepository.findById.mockResolvedValue({ name: 'Fiction' });

            const result = await catalogService.getBookInfo(1);

            expect(bookRepository.findById).toHaveBeenCalledWith(1);
            expect(result.book).toEqual(mockBook);
            expect(result.authors).toHaveLength(1);
            expect(result.covers).toHaveLength(1);
            expect(result.subjects).toHaveLength(1);
        });

        test('should throw NotFoundError if book not found', async () => {
            bookRepository.findById.mockResolvedValue(null);

            await expect(catalogService.getBookInfo(999)).rejects.toThrow('Book not found');
        });
    });
});