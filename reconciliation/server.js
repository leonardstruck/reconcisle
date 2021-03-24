const express = require('express')
const app = express()
app.use(express.json());
const port = 3000
const isTesting = require('detect-mocha')
const serviceMetadata = require('./serviceMetadata');

//Routes
app.get('/reconcile', (req, res) => {
    res.send(serviceMetadata.checkAndReturn(req, port, "get"))
})
app.post('/reconcile', (req, res) => {
    res.send(serviceMetadata.checkAndReturn(req, port, "post"))
})
app.get('*', (req, res) => {
    res.status(404).send("invalid request")
})

app.listen(port, () => {
    if(!isTesting()) {
        console.log(`Reconciliation service listening at http://localhost:${port}`)
    }
})

module.exports = app