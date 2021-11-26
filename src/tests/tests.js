// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Tests de la base de datos y la API
// Creado: 05/10/2021
// -----------------------------------------------------------------

// Import the dependencies for testing
import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import MedicionesControlador from '../controladores/MedicionesControlador';
import { obtenerDatos } from '../controladores/RaspadorControlador';

// Configure chai
chai.use(chaiHttp);
chai.should();

let id = 1;

describe("Main test", function () {
    // ----------------------------------------------
    it("deberia recibir todas las mediciones", (done) => {
        chai.request(app)
            .get('/mediciones')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.have.property('ID');
                done();
            });
    }); 
    // ----------------------------------------------
    it("deberia crear un usuario", (done) => {
        const res = "{"+
            '"telefono":"868493778",'+
            '"nombre":"Prueba",'+
            '"password":"1999"'+
        "}";
        chai.request(app)
            .post(`/usuario`)
            .send(JSON.parse(res))
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.affectedRows).be.equals(1);
                done();
            });
    });
    // ----------------------------------------------
    it("deberia crear un nodo", (done) => {
        const res = "{"+
            '"usuario":"1",'+
            '"estado":"1"'+
        "}";
        chai.request(app)
            .post(`/nodo`)
            .send(JSON.parse(res))
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.affectedRows).be.equals(1);
                done();
            });
    });
    // ----------------------------------------------
    it("deberia crear una medicion", (done) => {
        const res = "{"+
            '"valor":222,'+
            '"latitud":"-0.24263245",'+
            '"longitud":"-0.4252626",'+
            '"tiempo":"1635960428862",'+
            '"tipo":1,'+
            '"nodo":1,'+
            '"usuario":1'+
        "}";
        chai.request(app)
            .post(`/medicion`)
            .send(JSON.parse(res))
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.affectedRows).be.equals(1);
                done();
            });
    });
    // TODO: Estos tests deberian recoger el id del usuario creado anteriormente y modificarlo
    // ----------------------------------------------
    it("deberia recibir un solo usuario", (done) => {
        chai.request(app)
            .get(`/usuario/${id}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.have.property('ID');
                done();
            });
    });
    // TODO: Estos tests deberian recoger el id del usuario creado anteriormente y modificarlo
    // ----------------------------------------------
    it("deberia actualizar un usuario", (done) => {
        const res = "{"+
            '"id":"1",'+
            '"telefono":"5666",'+
            '"nombre":"Modificado",'+
            '"password":"26472"'+
        "}";
        chai.request(app)
            .put(`/usuario`)
            .send(JSON.parse(res))
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.affectedRows).be.equals(1);
                done();
            });
    });
    // TODO: Estos tests deberian recoger el id del usuario creado anteriormente y modificarlo
    // ----------------------------------------------
    it("deberia borrar un usuario", (done) => {
        chai.request(app)
            .put(`/usuario/${id}`)
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.affectedRows).be.equals(1);
                done();
            });
    });
    // TODO: testear obtenerMedicionesAcotadas
    // ----------------------------------------------
    // Comprobamos la libreria por si se actualizara y los valores cambiaran
    it("interpolacion", (done) => {
        const res = '[{"valor":42,"latitud":"-0.24263245","longitud":"-0.4252626","tiempo":"1635960428862","tipo":1,"nodo":1,"usuario":1},'+
            '{"valor":156,"latitud":"-0.24263255","longitud":"-0.4252726","tiempo":"1635960426862","tipo":1,"nodo":1,"usuario":1},'+
            '{"valor":65,"latitud":"-0.24263345","longitud":"-0.4252636","tiempo":"1635960428962","tipo":1,"nodo":1,"usuario":1},'+
            '{"valor":75,"latitud":"-0.24263345","longitud":"-0.4252736","tiempo":"1635960428962","tipo":1,"nodo":1,"usuario":1}]';
        const datos = MedicionesControlador.interpolarMediciones(res, 2);

        
        // TODO: falta el testeo aqui
        done();
    });
    
    // ----------------------------------------------
});
describe("Puppeteer tests: ", function () {
    // Pupeteer necesita más tiempo de espera ya que la navegación puede ser lenta
    this.timeout(11000);
    // Tests de puppeteer
    it("recoge datos de MITECO", async () => {
        // Tomamos los datos desde esta página porque la de origen la tiene insertada
        // dentro como documento. Hay que acceder a la insertada para poder referenciar
        // sus elementos usando puppeteer
        const URL = "https://webcat-web.gva.es/webcat_web/datosOnlineRvvcca/cargarDatosOnlineRvvcca?languageId=es_ES"
        const municipio = "Gandia";
        const datos = await obtenerDatos(URL, municipio);

        expect(datos[0]).have.property('altitud');
        expect(datos[0].descMunicipio).equal(municipio);

        assert.ok(true);
    });
});