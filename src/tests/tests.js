// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Tests de la base de datos y la API
// Creado: 05/10/2021
// -----------------------------------------------------------------

// Import the dependencies for testing
import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import MedicionesControlador from '../controladores/MedicionesControlador.js';
import { obtenerDatos } from '../controladores/RaspadorControlador.js';

// Configure chai
chai.use(chaiHttp);
chai.should();

let id = 1;

describe("Main test", function () {
    // TODO: limpiar la base de datos o rehacerla
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
    // ----------------------------------------------
    it("deberia recibir un solo tipo", (done) => {
        chai.request(app)
            .get(`/tipo/${id}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.have.property('ID');
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
        // Tomamos el resultado de una prueba hecha anteriormente como correcta, está cmprobada
        const res = '[{"lat":"-0.24263245","lng":"-0.4252626","valor":42},{"lat":"-0.24263255","lng":"-0.4252726","valor":156},{"lat":"-0.24263345","lng":"-0.4252636","valor":65},{"lat":"-0.24263345","lng":"-0.4252736","valor":75},{"lat":-0.24263345,"lng":-0.4252736,"valor":59.121881544913876},{"lat":-0.24263345,"lng":-0.42527222499999995,"valor":59.18493554696586},{"lat":-0.24263345,"lng":-0.42527085,"valor":65.76126030047791},'+
        '{"lat":-0.24263345,"lng":-0.425269475,"valor":73.78219284911619},{"lat":-0.24263345,"lng":-0.4252681,"valor":82.04895623085444},{"lat":-0.24263345,"lng":-0.42526672499999996,"valor":90.36102011356142},{"lat":-0.24263345,"lng":-0.42526535,"valor":98.61100840683775},{"lat":-0.24263345,"lng":-0.425263975,"valor":106.541414606737},{"lat":-0.242632075,"lng":-0.4252736,"valor":59.12053862419411},{"lat":-0.242632075,"lng":-0.42527222499999995,"valor":57.97064536586092},{"lat":-0.242632075,"lng":-0.42527085,"valor":65.28315875162954},' +
        '{"lat":-0.242632075,"lng":-0.425269475,"valor":73.45714550748714},{"lat":-0.242632075,"lng":-0.4252681,"valor":81.73853343832567},{"lat":-0.242632075,"lng":-0.42526672499999996,"valor":89.98428135017835},{"lat":-0.242632075,"lng":-0.42526535,"valor":98.00801771946293},{"lat":-0.242632075,"lng":-0.425263975,"valor":105.09723280037564},{"lat":-0.2426307,"lng":-0.4252736,"valor":63.58469433457715},{"lat":-0.2426307,"lng":-0.42527222499999995,"valor":64.05518176819974},{"lat":-0.2426307,"lng":-0.42527085,"valor":68.38839213679141},' +        
        '{"lat":-0.2426307,"lng":-0.425269475,"valor":74.78249642337393},{"lat":-0.2426307,"lng":-0.4252681,"valor":81.84027378981835},{"lat":-0.2426307,"lng":-0.42526672499999996,"valor":88.93288103760511},{"lat":-0.2426307,"lng":-0.42526535,"valor":95.52643433750191},{"lat":-0.2426307,"lng":-0.425263975,"valor":100.73466007183472},{"lat":-0.242629325,"lng":-0.4252736,"valor":67.873494491008},{"lat":-0.242629325,"lng":-0.42527222499999995,"valor":68.8930325624374},{"lat":-0.242629325,"lng":-0.42527085,"valor":72.00141914280266},{"lat":-0.242629325,"lng":-0.425269475,"valor":76.70615878231548},' +
        '{"lat":-0.242629325,"lng":-0.4252681,"valor":82.19129764723768},{"lat":-0.242629325,"lng":-0.42526672499999996,"valor":87.77764967308252},{"lat":-0.242629325,"lng":-0.42526535,"valor":92.84925435065755},{"lat":-0.242629325,"lng":-0.425263975,"valor":96.72780265990008},{"lat":-0.24262795,"lng":-0.4252736,"valor":71.26847141372677},{"lat":-0.24262795,"lng":-0.42527222499999995,"valor":72.46031933543863},{"lat":-0.24262795,"lng":-0.42527085,"valor":74.91661795989756},{"lat":-0.24262795,"lng":-0.425269475,"valor":78.44301220602775},{"lat":-0.24262795,"lng":-0.4252681,"valor":82.58700425904426},'+
        '{"lat":-0.24262795,"lng":-0.42526672499999996,"valor":86.8371584636154},{"lat":-0.24262795,"lng":-0.42526535,"valor":90.69469918328517},{"lat":-0.24262795,"lng":-0.425263975,"valor":93.706336852901},{"lat":-0.242626575,"lng":-0.4252736,"valor":73.8764723938787},{"lat":-0.242626575,"lng":-0.42527222499999995,"valor":75.07108381971346},{"lat":-0.242626575,"lng":-0.42527085,"valor":77.0789707065424},{"lat":-0.242626575,"lng":-0.425269475,"valor":79.78918151208114},{"lat":-0.242626575,"lng":-0.4252681,"valor":82.93082524522539},{"lat":-0.242626575,"lng":-0.42526672499999996,"valor":86.15749232065913},{"lat":-0.242626575,"lng":-0.42526535,"valor":89.11768721826742},{"lat":-0.242626575,"lng":-0.425263975,"valor":91.51326856406426},{"lat":-0.2426252,"lng":-0.4252736,"valor":75.87173578285572},{"lat":-0.2426252,"lng":-0.42527222499999995,"valor":76.99250215328863},{"lat":-0.2426252,"lng":-0.42527085,"valor":78.65606119818676},{"lat":-0.2426252,"lng":-0.425269475,"valor":80.78433588914378},{"lat":-0.2426252,"lng":-0.4252681,"valor":83.20368420440118},{"lat":-0.2426252,"lng":-0.42526672499999996,"valor":85.68511238325823},{"lat":-0.2426252,"lng":-0.42526535,"valor":87.99214929921764},{"lat":-0.2426252,"lng":-0.425263975,"valor":89.92658649111239},{"lat":-0.24262382500000002,"lng":-0.4252736,"valor":77.40518274995888},{"lat":-0.24262382500000002,"lng":-0.42527222499999995,"valor":78.42279230558984},{"lat":-0.24262382500000002,"lng":-0.42527085,"valor":79.8125924866741},{"lat":-0.24262382500000002,"lng":-0.425269475,"valor":81.5153419858095},{"lat":-0.24262382500000002,"lng":-0.4252681,"valor":83.4145091420377},{"lat":-0.24262382500000002,"lng":-0.42526672499999996,"valor":85.35784694785636},{"lat":-0.24262382500000002,"lng":-0.42526535,"valor":87.18717258537815},{"lat":-0.24262382500000002,"lng":-0.425263975,"valor":88.76846651520388}]';
        
        const mediciones = '[{"valor":42,"latitud":"-0.24263245","longitud":"-0.4252626","tiempo":"1635960428862","tipo":1,"nodo":1,"usuario":1},'+
            '{"valor":156,"latitud":"-0.24263255","longitud":"-0.4252726","tiempo":"1635960426862","tipo":1,"nodo":1,"usuario":1},'+
            '{"valor":65,"latitud":"-0.24263345","longitud":"-0.4252636","tiempo":"1635960428962","tipo":1,"nodo":1,"usuario":1},'+
            '{"valor":75,"latitud":"-0.24263345","longitud":"-0.4252736","tiempo":"1635960428962","tipo":1,"nodo":1,"usuario":1}]';
        const datos = MedicionesControlador.interpolarMediciones(mediciones, 2);

        expect(JSON.stringify(datos)).equals(res);
        // TODO: falta el testeo aqui. Probar a usar el vector resultado actual para hacer
        // la comprobación
        done();
    });
    
    // ----------------------------------------------
});
describe("Puppeteer tests: ", function () {
    // Pupeteer necesita más tiempo de espera ya que la navegación puede ser lenta
    this.timeout(20000);
    // Tests de puppeteer
    it("recoge datos de MITECO", async () => {
        // Tomamos los datos desde esta página porque la de origen la tiene insertada
        // dentro como documento. Hay que acceder a la insertada para poder referenciar
        // sus elementos usando puppeteer
        const URL = "https://webcat-web.gva.es/webcat_web/datosOnlineRvvcca/cargarDatosOnlineRvvcca?languageId=es_ES"
        const municipio = "Gandia";
        const datos = await obtenerDatos(URL, municipio);

        expect(datos[0]).have.property('descMunicipio');
        expect(datos[0].descMunicipio).equal(municipio);

        assert.ok(true);
    });
});