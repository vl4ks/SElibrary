const authService = require('../services/auth.service')

class AuthController {
    async login(req, res, next) {
        try {
            const { username, password } = req.body
            const ok = await authService.tryLogin(username, password)

            if (!ok) {
                return res.status(401).json({ error: 'invalid_credentials' })
            }

            req.session.user = username

            await new Promise((resolve, reject) => {
                req.session.save(err => (err ? reject(err) : resolve()))
            })

            return res.redirect('/catalog')
        } catch (error) {
            return next(error)
        }
    }

    async logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/catalog')
        })
    }
}

module.exports = new AuthController()