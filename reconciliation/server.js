import express from 'express';
import { returnServiceMetadata, returnHomeHTML } from './serviceMetadata.js';

export function server(data, config) {
    const app = express();
    app.use(express.json());
    const port = config.port;

    //Routes
    app.get('/reconcile', (req, res) => {
    })

    app.post('/reconcile', (req, res) => {
    })

    app.get('/', (req, res) => {
        // check if it needs serviceMetadata
        if(req.query.callback) {
            res.jsonp(returnServiceMetadata(port))
        } else {
            res.send(returnHomeHTML(port))
        }
    })

    app.get('*', (req, res) => {
        res.status(404).send("ERROR 404")
    })
    
    app.listen(port, () => {
            console.log(`Reconciliation service listening at http://localhost:${port}`)
    })
}