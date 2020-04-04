const express = require('express')
const app = express()
const port = 4200

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(` Server listening at port: ${port}`))