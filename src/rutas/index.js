// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Almacena las URL para hacer fetch de la API
// Creado: 06/10/2021
// Estado: DONE
// -----------------------------------------------------------------

import { Router } from 'express';
import MedidasControlador from '../controladores/medidasControlador.js';
import UsuariosControlador from '../controladores/usuariosControlador.js';
import "babel-polyfill"; //regeneratorRuntime error fix
var bodyParser = require('body-parser');
const routes = Router();
// -----------------------------------------------------------------
//#region GET
// -----------------------------------------------------------------
/**
 * 
 * Recibe todas las medidas de la base de datos
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con las medidas
 * 
 * GET /medidas
 * Ejemplo de objeto medida:
  {
    "id":1,
    "nodo":32,
    "tiempo":1635496134293,
    "tipo":2,
    "latitud":32.43635,
    "longitud":-0.3526,
    "valor":43
  }
 */
routes.get('/medidas', async (request, response) => {
  // Recibe las medidas
  const medidas = await MedidasControlador.getTodasLasMedidas();
  // Se asegura de que no haya errores
  if(!medidas) response.status(404).send(`No hay medidas`);
  // Devuelve la lista de medidas
  response.send(medidas);
});

/**
 * Recibe la ultima medida de la base de datos
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con las medidas
 * 
 */
routes.get('/medida/ultima', async (request, response) => {
  // Recibe las medidas
  const medidas = await MedidasControlador.getUltimaMedida();
  // Se asegura de que no haya errores
  if(!medidas) response.status(404).send(`No hay medidas`);
  // Devuelve la lista de medidas
  response.send(medidas);
});

// -----------------------------------------------------------------
//#endregion
// -----------------------------------------------------------------
// -----------------------------------------------------------------
//#region POST
// -----------------------------------------------------------------
/**
 * 
 * Envia una medida a la base de datos para añadirla
 *
 * @param {text} URL
 * @param {text} callback function
 * @return {text} JSON con la medida enviada
 * 
 * POST /medida
 */
routes.post('/medida', async (request, response) => {
  // Recibe los sensores
  const medida = await MedidasControlador.postMedida(request.body);
  // Se asegura de que no haya errores
  if(!medida) response.status(404).send(`No se ha creado la medida`);
  // Devuelve la lista de sensores
  response.send(medida);
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
  const usuario = await UsuariosControlador.postUsuario(request.body);
  // Se asegura de que no haya errores
  if(!usuario) response.status(404).send(`No se ha creado el usuario`);
  // Devuelve la lista de sensores
  response.send(usuario);
});

// -----------------------------------------------------------------
//#endregion
// -----------------------------------------------------------------

export default routes;