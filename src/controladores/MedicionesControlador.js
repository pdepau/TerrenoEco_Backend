// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Funciones para los objetos Medicion de la base de datos
// Creado: 06/10/2021
// -----------------------------------------------------------------

import {pool, medicion} from '../dbconfig.js';

class MedicionesControlador {
      // -----------------------------------------------------------------
      //#region get
      // -----------------------------------------------------------------
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
      // -----------------------------------------------------------------
      //#endregion
      // -----------------------------------------------------------------
      // -----------------------------------------------------------------
      //#region post
      // -----------------------------------------------------------------
      /**
       * Medicion:Medicion -> 
       *                crearMedicion() ->
       * json <-
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
      // -----------------------------------------------------------------
      //#endregion
      // -----------------------------------------------------------------

}
export default MedicionesControlador;