const express = require('express')
const app = express()
const port = 3000
const isTesting = require('detect-mocha')

//Routes
app.get('*', (req, res) => {
    res.status(404).send("invalid request")
})

app.listen(port, () => {
    if(!isTesting()) {
        console.log(`Reconciliation service listening at http://localhost:${port}`)
    }
})

module.exports = app