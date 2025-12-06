const authService = require('../services/auth.service')

class AuthController {
    async login(req, res, next) {
        console.log('AuthController.login called with req.body:', req.body)
        try {
            const { username, password } = req.body
            await authService.tryLogin(username, password)

            req.session.user = username

            await new Promise((resolve, reject) => {
                req.session.save(err => (err ? reject(err) : resolve()))
            })

            console.log('AuthController.login successful, redirecting to /catalog')
            return res.json({ redirect: "/catalog" })
        } catch (error) {
            console.log('AuthController.login error:', error.message)
            return next(error)
        }
    }

    async logout(req, res) {
        console.log('AuthController.logout called')
        req.session.destroy(() => {
            console.log('AuthController.logout session destroyed, redirecting to /catalog')
            res.json({ redirect: "/catalog" })
        })
    }
}

module.exports = new AuthController()