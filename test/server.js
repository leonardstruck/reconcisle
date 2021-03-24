//Require dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let chaiJsonSchema = require('chai-json-schema')

let server = require('../reconciliation/server')
let should = chai.should()

chai.use(chaiHttp)
chai.use(chaiJsonSchema)

describe('Server', () => {
    it('should return 404 on GET *', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            })
    })
    it('should return the service metadata when no query/-ies are posted', (done) => {
        chai.request(server)
            .post('/reconcile')
            .end((err, res) => {
                let serviceMetadataSchema = {
                    type: 'object',
                    required: ["name", "identifierSpace", "schemaSpace"]
                }
                res.should.have.status(200);
                res.body.should.be.jsonSchema(serviceMetadataSchema)
                done();
            })
    })
    it('should return the service metadata when no query/-ies are set as get params', (done) => {
        chai.request(server)
            .get('/reconcile')
            .end((err, res) => {
                let serviceMetadataSchema = {
                    type: 'object',
                    required: ["name", "identifierSpace", "schemaSpace"]
                }
                res.should.have.status(200);
                res.body.should.be.jsonSchema(serviceMetadataSchema)
                done();
            })
    })
})