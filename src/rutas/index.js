// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Almacena las URL para hacer fetch de la API
// Creado: 06/10/2021
// Estado: DONE
// -----------------------------------------------------------------

import { Router } from "express";
import MedicionesControlador from "../controladores/MedicionesControlador.js";
import UsuariosControlador from "../controladores/UsuariosControlador.js";
import "babel-polyfill"; //regeneratorRuntime error fix
import NodosControlador from "../controladores/NodosControlador.js";
import {obtenerDatos} from "../controladores/RaspadorControlador";
import { pool } from "../dbconfig.js";
import Punto from "../controladores/Punto.js";
var bodyParser = require("body-parser");
const routes = Router();
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
 * Recibe Mediciones acotadas por tiempo y posicion
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con las Mediciones
 * 
 * GET /Mediciones/acotadas
 * Envía los datos para la operación de acotado dentro de la url
    "latMax":1,
    "latMin":32,
    "lonMax":1,
    "lonMin":2,
    "tiempoMin":1635496134293,
    "tiempoMax":1635496134293,
    "tipo":1
 */
routes.get("/mediciones/acotadas/:latMax/:latMin/:lonMax/:lonMin/:tiempoMin/:tiempoMax/:tipo", async (request, response) => {
  let params = request.params;
  let puntoMax = new Punto(parseFloat(params.latMax), parseFloat(params.lonMax));
  let puntoMin = new Punto(parseFloat(params.latMin), parseFloat(params.lonMin));
  // Recibe las Mediciones
  const Mediciones = await MedicionesControlador.obtenerMedicionesAcotadas(
    puntoMin,
    puntoMax,
    parseInt(params.tiempoMin),
    parseInt(params.tiempoMax),
    parseInt(params.tipo),
    pool
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
  {
    "latMax":1,
    "latMin":32,
    "lonMax":1,
    "lonMin":2,
    "tiempo":1635496134293,
    "factor":2
  }
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
routes.get('/mediciones/acotadas/interp', async (request, response) => {
  const json = request.body;
  const puntoMax = new Punto(json.latMax, json.lonMax);
  const puntoMin = new Punto(json.latMin, json.lonMin);
  const factos = json.factor;
  // Recibe las mediciones
  const mediciones = await MedicionesControlador.obtenerMedicionesAcotadas(puntoMin, puntoMax, json.tiempoMins, json.tiempoMin, pool);
  // Se asegura de que no haya errores
  if(!mediciones) response.status(404).send(`No hay Mediciones`);
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
  "listMagnitudes" : [ {
    "idME" : 870,
    "codEstacion" : 5,
    "codMagnitud" : 17,
    "nombreMagnitud" : "Arsénico",
    "abreviatura" : "As",
    "unidad" : "ng/m³N",
    "unidadParentesis" : "(ng/m³N)",
    "calculo" : "S",
    "magnitudCEE" : null,
    "numDecimales" : 4,
    "valorMinimo" : 0,
    "valorMaximo" : 1000,
    "formato" : "####.#####"
  }, {
    "idME" : 873,
    "codEstacion" : 5,
    "codMagnitud" : 27,
    "nombreMagnitud" : "Benzo(a)pireno",
    "abreviatura" : "BaP",
    "unidad" : "ng/m³N",
    "unidadParentesis" : "(ng/m³N)",
    "calculo" : "S",
    "magnitudCEE" : null,
    "numDecimales" : 4,
    "valorMinimo" : 0,
    "valorMaximo" : 1000,
    "formato" : "####.#####"
  }, {
    "idME" : 871,
    "codEstacion" : 5,
    "codMagnitud" : 28,
    "nombreMagnitud" : "Cadmio",
    "abreviatura" : "Cd",
    "unidad" : "ng/m³N",
    "unidadParentesis" : "(ng/m³N)",
    "calculo" : "S",
    "magnitudCEE" : null,
    "numDecimales" : 4,
    "valorMinimo" : 0,
    "valorMaximo" : 250,
    "formato" : "####.#####"
  }, {
    "idME" : 490,
    "codEstacion" : 5,
    "codMagnitud" : 1,
    "nombreMagnitud" : "Dióxido de Azufre",
    "abreviatura" : "SO2",
    "unidad" : "µg/m³",
    "unidadParentesis" : "(µg/m³)",
    "calculo" : "S",
    "magnitudCEE" : 1,
    "numDecimales" : 0,
    "valorMinimo" : 0,
    "valorMaximo" : 250,
    "formato" : "####.#####"
  }, {
    "idME" : 847,
    "codEstacion" : 5,
    "codMagnitud" : 8,
    "nombreMagnitud" : "Dióxido de Nitrógeno",
    "abreviatura" : "NO2",
    "unidad" : "µg/m³",
    "unidadParentesis" : "(µg/m³)",
    "calculo" : "S",
    "magnitudCEE" : 3,
    "numDecimales" : 0,
    "valorMinimo" : 0,
    "valorMaximo" : 250,
    "formato" : "####.#####"
  }, {
    "idME" : 491,
    "codEstacion" : 5,
    "codMagnitud" : 6,
    "nombreMagnitud" : "Monóxido de Carbono",
    "abreviatura" : "CO",
    "unidad" : "mg/m³",
    "unidadParentesis" : "(mg/m³)",
    "calculo" : "S",
    "magnitudCEE" : 8,
    "numDecimales" : 1,
    "valorMinimo" : 0,
    "valorMaximo" : 50,
    "formato" : "####.#####"
  }, {
    "idME" : 980,
    "codEstacion" : 5,
    "codMagnitud" : 7,
    "nombreMagnitud" : "Monóxido de Nitrógeno",
    "abreviatura" : "NO",
    "unidad" : "µg/m³",
    "unidadParentesis" : "(µg/m³)",
    "calculo" : "S",
    "magnitudCEE" : 2,
    "numDecimales" : 0,
    "valorMinimo" : 0,
    "valorMaximo" : 250,
    "formato" : "####.#####"
  }, {
    "idME" : 872,
    "codEstacion" : 5,
    "codMagnitud" : 62,
    "nombreMagnitud" : "Níquel",
    "abreviatura" : "Ni",
    "unidad" : "ng/m³N",
    "unidadParentesis" : "(ng/m³N)",
    "calculo" : "S",
    "magnitudCEE" : null,
    "numDecimales" : 4,
    "valorMinimo" : 0,
    "valorMaximo" : 1000,
    "formato" : "####.#####"
  }, {
    "idME" : 740,
    "codEstacion" : 5,
    "codMagnitud" : 12,
    "nombreMagnitud" : "Oxidos de Nitrógeno totales",
    "abreviatura" : "NOx",
    "unidad" : "µg/m³",
    "unidadParentesis" : "(µg/m³)",
    "calculo" : "S",
    "magnitudCEE" : 15,
    "numDecimales" : 0,
    "valorMinimo" : 0,
    "valorMaximo" : 250,
    "formato" : "####.#####"
  }, {
    "idME" : 492,
    "codEstacion" : 5,
    "codMagnitud" : 14,
    "nombreMagnitud" : "Ozono",
    "abreviatura" : "O3",
    "unidad" : "µg/m³",
    "unidadParentesis" : "(µg/m³)",
    "calculo" : "S",
    "magnitudCEE" : 5,
    "numDecimales" : 0,
    "valorMinimo" : 0,
    "valorMaximo" : 250,
    "formato" : "####.#####"
  }, {
    "idME" : 867,
    "codEstacion" : 5,
    "codMagnitud" : 10,
    "nombreMagnitud" : "Partículas en Suspensión (< 10 µm)",
    "abreviatura" : "PM10",
    "unidad" : "µg/m³",
    "unidadParentesis" : "(µg/m³)",
    "calculo" : "S",
    "magnitudCEE" : 12,
    "numDecimales" : 0,
    "valorMinimo" : 0,
    "valorMaximo" : 250,
    "formato" : "####.#####"
  }, {
    "idME" : 869,
    "codEstacion" : 5,
    "codMagnitud" : 9,
    "nombreMagnitud" : "Partículas en Suspensión (< 2,5 µm)",
    "abreviatura" : "PM2.5",
    "unidad" : "µg/m³",
    "unidadParentesis" : "(µg/m³)",
    "calculo" : "S",
    "magnitudCEE" : 0,
    "numDecimales" : 0,
    "valorMinimo" : 0,
    "valorMaximo" : 250,
    "formato" : "#########"
  }, {
    "idME" : 470,
    "codEstacion" : 5,
    "codMagnitud" : 3,
    "nombreMagnitud" : "Partículas en suspensión totales",
    "abreviatura" : "PST",
    "unidad" : "µg/m³",
    "unidadParentesis" : "(µg/m³)",
    "calculo" : "S",
    "magnitudCEE" : 4,
    "numDecimales" : 0,
    "valorMinimo" : 0,
    "valorMaximo" : 250,
    "formato" : "####.#####"
  }, {
    "idME" : 866,
    "codEstacion" : 5,
    "codMagnitud" : 19,
    "nombreMagnitud" : "Plomo",
    "abreviatura" : "Pb",
    "unidad" : "µg/m³",
    "unidadParentesis" : "(µg/m³)",
    "calculo" : "S",
    "magnitudCEE" : null,
    "numDecimales" : 0,
    "valorMinimo" : 0,
    "valorMaximo" : 5,
    "formato" : "####.#####"
  } ]
}]
 */
routes.get('/estaciones', async (request, response) => {
  const URL = "https://webcat-web.gva.es/webcat_web/datosOnlineRvvcca/cargarDatosOnlineRvvcca?languageId=es_ES"
  const municipio = "Gandia";
  const datos = await obtenerDatos(URL, municipio);

  if(!datos) response.status(400).send("No se ha encontrado la estacion");

  response.send(datos);
});

// -----------------------------------------------------------------
//#endregion
// -----------------------------------------------------------------
// -----------------------------------------------------------------
//#region POST
// -----------------------------------------------------------------
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
 * Recibe un usuario de la base de datos
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con el usuario
 *
 */
routes.get("/usuario/:id", async (request, response) => {
  // Recibe las Mediciones
  const Mediciones = await UsuariosControlador.obtenerUsuario(
    request.params.id,
    pool
  );
  // Se asegura de que no haya errores
  if (!Mediciones) response.status(404).send(`No hay Mediciones`);
  // Devuelve la lista de Mediciones
  response.send(Mediciones);
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

export default routes;
