// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Tests de la base de datos y la API
// Creado: 05/10/2021
// -----------------------------------------------------------------

// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
// Configure chai
chai.use(chaiHttp);
chai.should();
describe("Medidas", () => {
    describe("GET /", () => {
        // Test para recibir todas las medidas
        it("deberia recibir todas las medidas", (done) => {
             chai.request(app)
                 .get('/medidas')
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('array');
                     done();
                  });
        });
        // Test para recibir un usuario
        it("deberia recibir un solo usuario", (done) => {
             const id = 2;
             chai.request(app)
                 .get(`/usuario/${id}`)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('array');
                     done();
                  });
        });
         
        // Test para recibir los sensores de un usuario
        it("deberia recibir los sensores de un usuario", (done) => {
             const id = 4;
             chai.request(app)
                 .get(`/sensores/usuario/${id}`)
                 .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                    });
        });

        // Test para crear una medida
        it("deberia crear una medida", (done) => {
            const res = "{"+
                '"valor":222,'+
                '"latitud":"-0.24263245",'+
                '"longitud":"-0.4252626",'+
                '"fecha":"2021-10-17 12:34:14.000000",'+
                '"sensor_id":12345'+
            "}";
            chai.request(app)
                .post(`/medida`)
                .send(JSON.parse(res))
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                    });
       });
    });
});