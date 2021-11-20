// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Almacena las URL para hacer fetch de la API
// Creado: 06/10/2021
// Estado: DONE
// -----------------------------------------------------------------

import { Router } from 'express';
import MedicionesControlador from '../controladores/MedicionesControlador.js';
import UsuariosControlador from '../controladores/UsuariosControlador.js';
import "babel-polyfill"; //regeneratorRuntime error fix
import NodosControlador from '../controladores/NodosControlador.js';
import { pool } from '../dbconfig.js';
import Punto from '../controladores/Punto.js';
var bodyParser = require('body-parser');
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
routes.get('/mediciones', async (request, response) => {
  // Recibe las Mediciones
  const Mediciones = await MedicionesControlador.obtenerTodasLasMediciones(pool);
  // Se asegura de que no haya errores
  if(!Mediciones) response.status(404).send(`No hay Mediciones`);
  // Devuelve la lista de Mediciones
  response.send(Mediciones);
});

/**
 * 
 * Recibe Mediciones acotadas por tiempo y posicion
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con las Mediciones
 * 
 * GET /Mediciones/acotadas
 * Cuerpo:
  {
    "latMax":1,
    "latMin":32,
    "lonMax":1,
    "lonMin":2,
    "tiempo":1635496134293
  }
 */
routes.get('/mediciones/acotadas', async (request, response) => {
  let json = request.body;
  let puntoMax = new Punto(json.latMax, json.lonMax);
  let puntoMin = new Punto(json.latMin, json.lonMin);
  // Recibe las Mediciones
  const Mediciones = await MedicionesControlador.obtenerMedicionesAcotadas(puntoMin, puntoMax, json.tiempoMins, json.tiempoMin, pool);
  // Se asegura de que no haya errores
  if(!Mediciones) response.status(404).send(`No hay Mediciones`);
  // Devuelve la lista de Mediciones
  response.send(Mediciones);
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
 */
routes.post('/medicion', async (request, response) => {
  // Recibe los sensores
  const medicion = await MedicionesControlador.crearMedicion(request.body, pool);
  // Se asegura de que no haya errores
  if(!medicion) response.status(404).send(`No se ha creado la medicion`);
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
routes.get('/usuario/:id', async (request, response) => {
  // Recibe las Mediciones
  const Mediciones = await UsuariosControlador.obtenerUsuario(request.params.id, pool);
  // Se asegura de que no haya errores
  if(!Mediciones) response.status(404).send(`No hay Mediciones`);
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
 *{
    "id":1,
    "telefono":4532156266,
    "nombre":"Yo Al",
    "password":"1635496033293"
  }
 */
routes.post('/usuario', async (request, response) => {
  // Recibe los sensores
  const usuario = await UsuariosControlador.crearUsuario(request.body, pool);
  // Se asegura de que no haya errores
  if(!usuario) response.status(404).send(`No se ha creado el usuario`);
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
 *{
    "id":1,
    "telefono":4532156266,
    "nombre":"Yo Al",
    "password":"1635496033293"
  }
 */
routes.put('/usuario', async (request, response) => {
  // Recibe los sensores
  const usuario = await UsuariosControlador.actualizarUsuario(request.body, pool);
  // Se asegura de que no haya errores
  if(!usuario) response.status(404).send(`No se ha encontrado el usuario`);
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
 */
routes.put('/usuario/:id', async (request, response) => {
  // Recibe los sensores
  const usuario = await UsuariosControlador.borrarUsuario(request.params.id, pool);
  // Se asegura de que no haya errores
  if(!usuario) response.status(404).send(`No se ha encontrado el usuario`);
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
 * {
      "usuario":"1",
      "estado":"1"
  }
 */
routes.post('/nodo', async (request, response) => {
  // Recibe los sensores
  const nodo = await NodosControlador.crearNodo(request.body, pool);
  // Se asegura de que no haya errores
  if(!nodo) response.status(404).send(`No se ha creado el nodo`);
  // Devuelve la lista de sensores
  response.send(nodo);
});


export default routes;