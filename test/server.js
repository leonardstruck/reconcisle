//Require dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')

let server = require('../reconciliation/server')
let should = chai.should()

chai.use(chaiHttp)

describe('Server', () => {
    it('should return 404 on GET *', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            })
    })
})