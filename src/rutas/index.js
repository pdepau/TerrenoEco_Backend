// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Almacena las URL para hacer fetch de la API
// Creado: 06/10/2021
// Estado: DONE
// -----------------------------------------------------------------

import { Router } from "express";
import MedicionesControlador from "../controladores/MedicionesControlador.js";
import UsuariosControlador from "../controladores/UsuariosControlador.js";
import TipoControlador from "../controladores/TipoControlador.js";
import "babel-polyfill"; //regeneratorRuntime error fix
import NodosControlador from "../controladores/NodosControlador.js";
import {obtenerDatos} from "../controladores/RaspadorControlador.js";
import { pool, usuario } from "../dbconfig.js";
import Punto from "../controladores/Punto.js";

const routes = Router();

var sess;
/**
 * Comprueba que exista una sesion
 * https://stackoverflow.com/questions/37608114/how-to-check-session-in-node-js-express/44238319
 * Desde el frontend puede llamarse la funcion para comprobar que hay una sesion y así
 * ajustar lo que se necesite
 * 
 */
routes.get('/',function(req,res){
    sess=req.session;
    /*
    * Here we have assign the 'session' to 'sess'.
    * Now we can create any number of session variable we want.
    * in PHP we do as $_SESSION['var name'].
    * Here we do like this.
    */
    if(!sess) {
      res.status(400);
      return;
    }
    sess.username; // usamos el usuario unicamente, que es el correo
});
/**
 * 
 * Recibe todas las Mediciones de la base de datos
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con las Mediciones
 * 
 * GET /Mediciones
 * Ejemplo de objeto medicion:
  {
    "id":1,
    "nodo":32,
    "usuario":1,
    "tiempo":1635496134293,
    "tipo":2,
    "latitud":32.43635,
    "longitud":-0.3526,
    "valor":43
  }
 */
routes.get("/mediciones", async (request, response) => {
  // Recibe las Mediciones
  const Mediciones = await MedicionesControlador.obtenerTodasLasMediciones(
    pool
  );
  // Se asegura de que no haya errores
  if (!Mediciones) response.status(404).send(`No hay Mediciones`);
  // Devuelve la lista de Mediciones
  response.send(Mediciones);
});

/**
 * 
 * Recibe las ultimas Mediciones de un usuario de la base de datos
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con las Mediciones
 * 
 * GET /Mediciones
 * Ejemplo de objeto medicion:
  {
    "id":1,
    "nodo":32,
    "usuario":1,
    "tiempo":1635496134293,
    "tipo":2,
    "latitud":32.43635,
    "longitud":-0.3526,
    "valor":43
  }
 */
  routes.get("/ultimasMediciones/:idUsuario/:cuantas", async (request, response) => {
    let params = request.params;
    // Recibe las Mediciones
    const Mediciones = await MedicionesControlador.obtenerUltimasMedicionesDeUsuario(
      pool,params.idUsuario, params.cuantas
    );
    // Se asegura de que no haya errores
    if (!Mediciones) response.status(404).send(`No hay Mediciones`);
    // Devuelve la lista de Mediciones
    response.send(Mediciones);
  });

/**
 * Recibe Mediciones acotadas por tiempo y posicion y además interpoladas
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con las Mediciones
 * 
 * GET /Mediciones/acotadas
 * Envía los datos para la operación de acotado dentro del cuerpo:
 * Params:
    "latMax":1,
    "latMin":32,
    "lonMax":1,
    "lonMin":2,
    "tiempoMin":1635496134293,
    "tiempoMax":1635496134293,
    "factor":2,
    "tipo":1
  * el factor funciona bien entre 2 y 10
  Datos devueltos:
  * [{
  *    latitud: -0.3452,
  *    longitud: 0.262462,
  *    valor: 43
  * },
  * {
  *    latitud: -0.3352,
  *    longitud: 0.222462,
  *    valor: 32
  * }]
 */
routes.get('/mediciones/acotadas/:latMax/:latMin/:lonMax/:lonMin/:tiempoMin/:tiempoMax/:tipo/:factor', async (request, response) => {
  const params = request.params;
  const puntoMax = new Punto(parseFloat(params.lonMax), parseFloat(params.latMax));
  const puntoMin = new Punto(parseFloat(params.lonMin), parseFloat(params.latMin));
  const factor = parseInt(params.factor);
  const tipo = parseInt(params.tipo);
  // Recibe las mediciones
  const mediciones = await MedicionesControlador.obtenerMedicionesAcotadas(puntoMin, puntoMax, params.tiempoMin, params.tiempoMax, tipo, pool);
  const interp = await MedicionesControlador.interpolarMediciones(mediciones, factor);
  // Devuelve la lista de Mediciones
  response.send(interp);
});

/**
 * 
 * Devuelve los datos de Gandia por ahora
 * TODO: devolver los datos segun el nombre de las estaciones
 * 
 * Cuerpo de la respuesta con los datos, es un array
 * [{
  "longitudGoogleMaps" : "-0.19109882",
  "longitudDegrees" : "-0.19109882",
  "latitudDegrees" : "38.96797739",
  "altitud" : "22 m",
  "descMunicipio" : "Gandia",
  "estacion" : {
    "idEstacion" : 5,
    "codigo" : "46131002",
    "estacionNom" : "Gandia",
    "idProvincia" : 46,
    "provinciaNom" : "VALÈNCIA",
    "idMunicipio" : 131,
    "municipioNom" : "Gandia",
    "direccion" : "Parc Alquería Nova",
    "zona" : "4",
    "longitud" : -0.1127,
    "latitud" : 38.5804,
    "altitud" : 22,
    "activa" : "S",
    "idRed" : 0,
    "fechaBaja" : null
  },
  "latitudGoogleMaps" : "38.96797739",
  "listMagnitudes" : [ {Objetos} ]
}]
 */
routes.get('/estaciones', async (request, response) => {
  const URL = "https://webcat-web.gva.es/webcat_web/datosOnlineRvvcca/cargarDatosOnlineRvvcca?languageId=es_ES"
  const municipio = "Gandia";
  const datos = await obtenerDatos(URL, municipio);

  if(!datos) response.status(400).send("No se ha encontrado la estacion");

  response.send(datos);
});
/**
 *
 * Envia una medicion a la base de datos para añadirla
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con la medicion enviada
 *
 * POST /medicion
 * Envía dentro del cuerpo los datos de la medición
 */
routes.post("/medicion", async (request, response) => {
  // Recibe los sensores
  const medicion = await MedicionesControlador.crearMedicion(
    request.body,
    pool
  );
  // Se asegura de que no haya errores
  if (!medicion) response.status(404).send(`No se ha creado la medicion`);
  // Devuelve la lista de sensores
  response.send(medicion);
});

/**
 *
 * Recibe un usuario de la base de datos por la id
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con el usuario
 *
 */
routes.get("/usuario/:id", async (request, response) => {
  // Recibe las Mediciones
  const usuario = await UsuariosControlador.obtenerUsuario(
    request.params.id,
    pool
  );
  // Se asegura de que no haya errores
  if (!usuario) response.status(404).send(`No hay Usuario`);
  // Devuelve la lista de Mediciones
  response.send(usuario);
});

/**
 * Envia un usuario a la base de datos para añadirla
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con el usuario enviado
 * 
 * POST /usuario
 * Envía los datos dentro del cuerpo:
 *{
    "id":1,
    "telefono":4532156266,
    "nombre":"Yo Al",
    "password":"1635496033293"
  }
 */
routes.post("/usuario", async (request, response) => {
  // Recibe los sensores
  const usuario = await UsuariosControlador.crearUsuario(request.body, pool);
  // Se asegura de que no haya errores
  if (!usuario) response.status(404).send(`No se ha creado el usuario`);
  // Devuelve la lista de sensores
  response.send(usuario);
});

/**
 * Envia un usuario a la base de datos para editarla
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con el usuario enviado
 * 
 * PUT /usuario
 * Envía los datos dentro del cuerpo:
 *{
    "id":1,
    "telefono":4532156266,
    "nombre":"Yo Al",
    "password":"1635496033293"
  }
 */
routes.put("/usuario", async (request, response) => {
  // Recibe los sensores
  const usuario = await UsuariosControlador.actualizarUsuario(
    request.body,
    pool
  );
  // Se asegura de que no haya errores
  if (!usuario) response.status(404).send(`No se ha encontrado el usuario`);
  // Devuelve la lista de sensores
  response.send(usuario);
});

/**
 * Borra un usuario de la base de datos
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con el usuario enviado
 *
 * PUT /usuario
 * Envía el ID en la url como numero
 */
routes.put("/usuario/:id", async (request, response) => {
  // Recibe los sensores
  const usuario = await UsuariosControlador.borrarUsuario(
    request.params.id,
    pool
  );
  // Se asegura de que no haya errores
  if (!usuario) response.status(404).send(`No se ha encontrado el usuario`);
  // Devuelve la lista de sensores
  response.send(usuario);
});

/**
 * Crea un nodo en la base de datos
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con el nodo enviado
 * 
 * POST /nodo
 * Envía el objeto nodo por el cuerpo, la ID se genera en la base de datos Autoincremental
 * {
      "usuario":"1",
      "estado":"1"
  }
 */
routes.post("/nodo", async (request, response) => {
  // Recibe los sensores
  const nodo = await NodosControlador.crearNodo(request.body, pool);
  // Se asegura de que no haya errores
  if (!nodo) response.status(404).send(`No se ha creado el nodo`);
  // Devuelve la lista de sensores
  response.send(nodo);
});

/**
 *
 * Recibe un tipo de la base de datos
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con el tipo
 *
 */
 routes.get("/tipo/:id", async (request, response) => {
  // Recibe las Mediciones
  const tipo = await TipoControlador.obtenerTipo(
    request.params.id,
    pool
  );
  // Se asegura de que no haya errores
  if (!tipo) response.status(404).send(`No hay tipo con esa ID`);
  // Devuelve la lista de Mediciones
  response.send(tipo);
});

/**
 * Login basico de
 * https://ull-esit-pl-1617.github.io/estudiar-cookies-y-sessions-en-expressjs-victor-pamela-jesus/cookies/chapter6.html
 *
 * @param {text} URL
 * @param {text} callback function
 * 
 */
routes.post('/login', async (req, res) => {
  const datos = req.body;
  console.log(datos);
  // Busca el usuario segun el correo enviado en la peticion
  let usuario = await UsuariosControlador.obtenerUsuarioCorreo(datos.correo, pool);
  console.log("Usuario: " + datos.correo + " intentando conectar.");
  console.log(usuario[0].correo)
  if (!datos.correo || !datos.password) {
    res.status(400);
    res.send('login failed');
    return;
  } else if(datos.correo == usuario[0].correo && datos.password == usuario[0].password) {
    req.session.user = usuario.correo;
    res.send('login completed');
    return;
  }
  res.status(400);
  res.send('login failed');
});

/**
 * Registro de usuario basico
 *
 * @param {text} URL
 * @param {text} callback function
 * 
 */
 routes.post('/register', async (req, res) => {
  const datos = req.body;
  console.log(datos);
  // Busca el usuario segun el correo enviado en la peticion
  let usuario = await UsuariosControlador.obtenerUsuarioCorreo(datos.correo, pool);
  console.log("Usuario: " + datos.correo + " intentando conectar.");
  console.log(usuario[0].correo)
  if (!datos.correo || !datos.password) {
    res.status(400);
    res.send('register failed');
    return;
  } else if(datos.correo == usuario[0].correo && datos.password == usuario[0].password) {
    let nuevo = "{"+
            '"correo":"'+usuario[0].correo+'",'+
            '"password":"'+usuario[0].password+'"'+
        "}";
    await UsuariosControlador.crearUsuario(nuevo, pool);
    req.session.user = usuario.correo;
    res.send('register completed');
    return;
  }
  res.status(400);
  res.send('register failed');
});

/**
 * 
 * Destruye una sesion
 * 
 * @param {text} URL
 * @param {text} callback function
 */
routes.get('/logout', (req, res) => {
  req.session.destroy();
});

export default routes;
