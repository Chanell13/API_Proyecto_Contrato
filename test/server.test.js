var server = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

chai.use(chaiHttp);

describe('API contratos', () => {
    it('hola mundo', (done) => {
var x = 2;
var y = 3;
var resultado = x + y;

expect(resultado).to.equal(5);
done();
    });
    
});
beforeEach((done)=>{
    var contratos = [      {"NoCandidato": 1, "Nombre": "Maria" ,"Apellido": "Soto", 
                           "Puesto":"Investigadora", "Categoria":"Gerente", "Tipo de contrato":"Indeterminado","Sueldo":100,"NoContrato":1,
                           "Fecha Inicio":"09-01-2019", "Fecha Fin":"09-03-2019"},
                           {"NoCandidato": 2, "Nombre": "Juan" ,"Apellido": "Lopez", 
                           "Puesto":"Investigador", "Categoria":"Gerente", "Tipo de contrato":"Indeterminado","Sueldo":100,"NoContrato":2,
                           "Fecha Inicio":"09-01-2019", "Fecha Fin":"09-03-2019"}
                       ];
                       server.db.remove({}, {multi: true}, () => {
                           server.db.insert(contratos, () => {
   done();
   });
   });
});
describe('GET /', () => {
    it('Should return HTML', (done) => {
        chai.request(server.app)
            .get('/')
            .end((err,res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                done();
                });
            });
});
describe('GET /contratos', () => {
    it('Should return all records', (done) => {
        
                chai.request(server.app)
                .get('/api/v1/contratos')
                .end((err,res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(2);
                    done();
                    });  
            
       
            });
        });
        describe('POST /contratos', () => {
                it('should create a new record', (done) =>{
                    chai.request(server.app)
                        .post("/api/v1/contratos")
                        .send({"NoCandidato": 3,
                                "Nombre": "Roberto",
                                "Apellido": "Garcia",
                                "Puesto": "Periodista",
                                "Categoria": "Gerente",
                                "Tipo de contrato": "Indeterminado",
                                "Sueldo": 100,
                                "NoContrato": 3,
                                "Fecha Inicio": "09-01-2019",
                                "Fecha Fin": "09-03-2019"})
                                .end((err, res) => {
                                    expect(res).to.have.status(201);
                                    server.db.find({"Nombre": "Roberto"}, (err,contratos) => {
                                        expect(contratos).to.have.lengthOf(1);
                                        done();
                                      
                        });
                });
            });
});