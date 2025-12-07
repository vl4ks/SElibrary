const { NotFoundError, BadRequestError } = require('../src/errors');

describe('Errors', () => {
    describe('NotFoundError', () => {
        test('should create error with default message and status 404', () => {
            const error = new NotFoundError();
            expect(error.message).toBe('Resource not found');
            expect(error.statusCode).toBe(404);
            expect(error.name).toBe('NotFoundError');
        });

        test('should create error with custom message', () => {
            const error = new NotFoundError('Custom message');
            expect(error.message).toBe('Custom message');
            expect(error.statusCode).toBe(404);
        });
    });

    describe('BadRequestError', () => {
        test('should create error with default message and status 400', () => {
            const error = new BadRequestError();
            expect(error.message).toBe('Bad request');
            expect(error.statusCode).toBe(400);
            expect(error.name).toBe('BadRequestError');
        });

        test('should create error with custom message', () => {
            const error = new BadRequestError('Invalid input');
            expect(error.message).toBe('Invalid input');
            expect(error.statusCode).toBe(400);
        });
    });

    test('TK-023: Ошибка валидации данных', () => {
        const error = new BadRequestError('Email is required and must be valid');
        expect(error.message).toBe('Email is required and must be valid');
        expect(error.statusCode).toBe(400);
    });
});