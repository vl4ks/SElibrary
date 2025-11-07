const bcrypt = require('bcrypt')
const adminRepository = require('../repositories/admin.repository')
const { NotFoundError } = require('../errors')

class AuthService {
    async tryLogin(login, password) {
        // test: admin, admin123
        const testUser = {
            username: 'admin',
            passwordHash: bcrypt.hashSync('admin123', 10)
        }

        if (login !== testUser.username)
            throw new NotFoundError('Invalid username or password')

        const isValidPassword = await bcrypt.compare(password, testUser.passwordHash)
        if (!isValidPassword)
            throw new NotFoundError('Invalid username or password')
    }

    // async tryLogin(login, password) {
    //     const admin = await adminRepository.findByLogin(login)

    //     if (!admin)
    //         throw new NotFoundError('Invalid username or password')

    //     const isValidPassword = await bcrypt.compare(password, testUser.passwordHash)
    //     if (!isValidPassword)
    //         throw new NotFoundError('Invalid username or password')
    // }
}

module.exports = new AuthService()
