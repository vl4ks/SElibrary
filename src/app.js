require('dotenv').config()

const express = require('express')
const path = require('path')
const session = require('express-session')

function createApp() {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.set('view engine', 'ejs')
    app.set('views', path.join(__dirname, '..', 'views'))

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 12 } // 12 hours
    }))

    app.use(express.static(path.join(__dirname, '..', 'public')))

    const requireLogin = (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/auth')
        }
        next()
    }

    app.use((req, res, next) => {
        const publicPaths = ['/auth', '/api/auth/login', '/api/auth/logout', '/catalog', '/']
        const isPublic = publicPaths.some(p => req.path.startsWith(p))

        if (!req.session.user && !isPublic) {
            return res.redirect('/auth')
        }
        next()
    })

    app.get('/', (req, res) => res.redirect('/catalog'))

    const publicRoutes = [
        { path: '/auth', view: 'auth' },
        { path: '/catalog', view: 'catalog' },
        { path: '/catalog/authors/:bookId', view: 'authors' }
    ]

    publicRoutes.forEach(r => {
        app.get(r.path, (req, res) => res.render(r.view, { user: req.session.user }))
    })

    const protectedRoutes = [
        { path: '/collections', view: 'collections' },
        { path: '/customers', view: 'customers' },
        { path: '/addeditcustomer', view: 'addeditcustomer' },
        { path: '/circulation', view: 'circulation' },
        { path: '/reports', view: 'reports' }
    ]

    protectedRoutes.forEach(r => {
        app.get(r.path, requireLogin, (req, res) => {
            res.render(r.view, { user: req.session.user })
        })
    })

    const authRoutes = require('./routes/auth.routes')
    const catalogRoutes = require('./routes/catalog.routes')
    const customerRoutes = require('./routes/customer.routes')
    const circulationRoutes = require('./routes/circulation.routes')
    const reportRoutes = require('./routes/report.routes')
    const swaggerRoutes = require('./routes/swagger.routes')

    app.use('/api/auth', authRoutes)
    app.use('/api/catalog', catalogRoutes)
    app.use('/api/customer', customerRoutes)
    app.use('/api/circulation', circulationRoutes)
    app.use('/api/report', reportRoutes)
    app.use(swaggerRoutes)

    app.use((err, req, res, next) => {
        console.error(err)
        if (req.path.startsWith('/api')) {
            const statusCode = err.statusCode || 500
            const message = err.message || 'internal_server_error'
            return res.status(statusCode).json({ error: message })
        }
        next(err)
    })

    return app
}

module.exports = createApp