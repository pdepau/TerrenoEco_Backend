// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Funciones para los objetos Medicion de la base de datos
// Creado: 06/10/2021
// -----------------------------------------------------------------

import {pool, medicion} from '../dbconfig.js';
import interpolateArray from '2d-bicubic-interpolate';
var nurbs = require('nurbs');

class MedicionesControlador {
      /**
       * getTodasLasMediciones -> [JSON]
       * Devuelve un JSON con todas las Mediciones
       *
       * @return {promise} promesa de los datos
       * 
       */
      static obtenerTodasLasMediciones() {
            // Recibe las Mediciones
            return new Promise(result => {

                  var queryString = "SELECT * from " + medicion;

                  pool.getConnection((err, connection) => {
                        if(err) throw err;
                        console.log('connected as id ' + connection.threadId);
                        connection.query(queryString, (err, rows) => 
                        {
                              connection.release(); // devuelve la conexion al pool
                              // Si hay un error devuelve el error
                              if(err) throw err;
                              result(rows);
                        });
                  });
            });
      }

      /**
       *                obtenerUltimaMedicion()
       * Medicion <-
       * Devuelve un JSON con la ultima medicion
       *
       * @return {promise} promesa de JSON con la medicion
       * 
       */
       static obtenerUltimaMedicion() {
            return new Promise(result => {

                  var queryString = "SELECT MAX(ID) as id, latitud, longitud, valor FROM "+medicion+";";

                  pool.getConnection((err, connection) => {
                        if(err) throw err;
                        console.log('connected as id ' + connection.threadId);
                        connection.query(queryString, (err, rows) => 
                        {
                              connection.release(); // devuelve la conexion al pool
                              // Si hay un error devuelve el error
                              if(err) throw err;
                              result(rows);
                        });
                  });
            });
      }
      /**
       * Medicion:Medicion -> 
       *                crearMedicion() ->
       * resultado:texto <-
       * 
       * Crea una nueva Medicion en la base de datos con los datos recibidos
       *
       * @param {text} json con los datos de la Medicion
       * @return {promise} promesa
       * 
       */
      static crearMedicion(json) {
            
            return new Promise(result => {
                  
                  // ID es NULL porque la base da datos lo asigna como valor autoincremental
                  const queryString = "INSERT INTO `"+medicion+"` (`ID`, `valor`, `latitud`, `longitud`, `tipo`, `tiempo`, `nodo`, `usuario`) VALUES (NULL, '"+json.valor+"', '"+json.latitud+"', '"+json.longitud+"', '"+json.tipo+"', '"+json.tiempo+"', '"+json.nodo+"', '"+json.usuario+"');"
    
                  pool.getConnection((err, connection) => {
                        if(err) throw err;
                        console.log('connected as id ' + connection.threadId);
                        connection.query(queryString, (err, rows) => 
                        {
                              connection.release(); // devuelve la conexion al pool
                              // Si hay un error devuelve el error
                              if(err) throw err;
                              result(rows);
                        });
                  });
            });
      }

      /**
       * 
       * mediciones:json -> 
       *                interpolarMediciones3d()
       * datos:<interpolada> <-
       * 
       * Interpola una lista de mediciones y crea valores entre los resultados obtenidos
       * 
       * @param {string} mediciones acotadas
       * @param {number} factor de interpolacion
       * @returns curve nurb object
       */
      static interpolarMediciones3d(mediciones, factor) {

            let points = [];
            const j_mediciones = JSON.parse(mediciones);
            j_mediciones.forEach(medicion => {
                  points.push([medicion.latitud, medicion.longitud, medicion.valor]);
            });

            let curve = nurbs(points);

            return curve;
      }
}

export default MedicionesControlador;