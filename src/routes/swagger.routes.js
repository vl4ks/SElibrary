const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

const yamlPath = path.join(__dirname, '..', '..', 'swagger.yaml')

router.get('/swagger.yaml', (req, res) => {
  if (!fs.existsSync(yamlPath)) 
    return res.status(404).send('swagger.yaml not found')
  res.type('yaml').send(fs.readFileSync(yamlPath, 'utf8'))
})

router.get('/swagger', (req, res) => {
  const html = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>SElibrary API</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4/swagger-ui.css" />
      <style>#swagger { max-width: 800px; margin: 16px auto; }</style>
    </head>
    <body>
      <div id="swagger"></div>
      <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js"></script>
      <script>
        window.onload = function() {
          const ui = SwaggerUIBundle({
            url: '/swagger.yaml',
            dom_id: '#swagger',
            presets: [SwaggerUIBundle.presets.apis],
            layout: 'BaseLayout'
          });
          window.ui = ui;
        };
      </script>
    </body>
    </html>
  `
  res.type('html').send(html)
})

module.exports = router