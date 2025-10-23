const bcrypt = require('bcrypt')
const adminRepository = require('../repositories/admin.repository')

class AuthService {
    async tryLogin(login, password) {
        // test: admin, admin123
        const testUser = {
            username: 'admin',
            passwordHash: bcrypt.hashSync('admin123', 10)
        }

        if (login !== testUser.username)
            return false

        return await bcrypt.compare(password, testUser.passwordHash)
    }

    // async tryLogin(login, password) {
    //   const admin = await adminRepository.findByLogin(login)
    //
    //   if (!admin)
    //       return false
    //
    //   return await bcrypt.compare(password, admin.password)
    // }
}

module.exports = new AuthService()
