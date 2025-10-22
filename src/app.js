require('dotenv').config()

const express = require('express')
const path = require('path')
const session = require('express-session')
const PgSession = require('connect-pg-simple')(session)
const dbPool = require('../db')

function createApp() {
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(session({
    //store: new PgSession({ pool: dbPool }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 12 } // 12 hours
  }))

  app.use(express.static(path.join(__dirname, '..', 'public')))

  const htmlDir = path.join(__dirname, '..', 'public', 'html')
  const htmlMap = {
    '/login': 'login.html',
    '/catalog': 'catalog.html',
    '/author': 'authors.html',
    '/customer': 'customers.html',
    '/addeditcustomer': 'addeditcustomer.html',
    '/circulation': 'circulation.html',
    '/report': 'reports.html'
  }

  app.get('/', (req, res) => res.redirect('/catalog'))

  Object.entries(htmlMap).forEach(([route, file]) => {
    app.get(route, (req, res, next) => {
      res.sendFile(path.join(htmlDir, file), err => { if (err) next(err) })
    })
  })

  //const loginRoutes = require('./routes/login.routes')
  //const catalogRoutes = require('./routes/catalog.routes')
  //const customerRoutes = require('./routes/customer.routes')
  //const circulationRoutes = require('./routes/circulation.routes')
  //const reportRoutes = require('./routes/report.routes')
  const swaggerRoutes = require('./routes/swagger.routes')

  //app.use('/api/login', loginRoutes)
  //app.use('/api/catalog', catalogRoutes)
  //app.use('/api/customer', customerRoutes)
  //app.use('/api/circulation', circulationRoutes)
  //app.use('/api/report', reportRoutes)
  app.use(swaggerRoutes)

  app.use((err, req, res, next) => {
    console.error(err)
    if (req.path.startsWith('/api')) return res.status(500).json({ error: 'internal_server_error' })
    next(err)
  })

  return app
}

module.exports = createApp