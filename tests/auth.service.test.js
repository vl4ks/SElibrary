const authService = require('../src/services/auth.service');
const { NotFoundError } = require('../src/errors');

describe('AuthService', () => {
    describe('tryLogin', () => {
        test('TK-001: Успешный вход администратора', async () => {
            await expect(authService.tryLogin('admin', 'admin123')).resolves.toBeUndefined();
        });

        test('TK-002: Неуспешный вход с неверными данными', async () => {
            await expect(authService.tryLogin('wronguser', 'wrongpass')).rejects.toThrow(NotFoundError);
            await expect(authService.tryLogin('wronguser', 'wrongpass')).rejects.toThrow('Invalid username or password');

            await expect(authService.tryLogin('admin', 'wrongpass')).rejects.toThrow(NotFoundError);
            await expect(authService.tryLogin('admin', 'wrongpass')).rejects.toThrow('Invalid username or password');
        });
    });
});