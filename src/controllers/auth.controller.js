const authService = require('../services/auth.service')

class AuthController {
    async login(req, res, next) {
        try {
            const { username, password } = req.body
            await authService.tryLogin(username, password)

            req.session.user = username

            await new Promise((resolve, reject) => {
                req.session.save(err => (err ? reject(err) : resolve()))
            })

            return res.json({ redirect: "/catalog" })
        } catch (error) {
            return next(error)
        }
    }

    async logout(req, res) {
        req.session.destroy(() => {
            res.json({ redirect: "/catalog" })
        })
    }
}

module.exports = new AuthController()