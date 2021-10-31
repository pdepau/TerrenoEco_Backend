// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Funciones para los objetos Medida de la base de datos
// Creado: 06/10/2021
// -----------------------------------------------------------------

import pool from '../dbconfig.js';

class MedidasControlador {
      // -----------------------------------------------------------------
      //#region get
      // -----------------------------------------------------------------
      /**
       * getTodasLasMedidas -> [JSON]
       * Devuelve un JSON con todas las medidas
       *
       * @return {text} JSON con las medidas
       * 
       */
      static getTodasLasMedidas() {
            // Recibe las medidas
            return new Promise(result => {

                  var queryString = "SELECT * from medidas";

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
       * getUltimaMedida -> [JSON]
       * Devuelve un JSON con la ultima medida
       *
       * @return {text} JSON con la medida
       * 
       */
      static getUltimaMedida() {
            // Recibe la medida
            return new Promise(result => {

                  var queryString = "SELECT MAX(ID) as id, latitud, longitud, valor FROM medidas;";

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
       * medida:Medida -> postMedida() -> respuesta:JSON
       * 
       * Crea una nueva medida en la base de datos con los datos recibidos
       *
       * @param {text} json con los datos de la medida
       * @return {text} JSON con la medida
       * 
       */
      static postMedida(medida) {
            
            return new Promise(result => {
                  
                  // ID es NULL porque la base da datos lo asigna como valor autoincremental
                  const queryString = "INSERT INTO `medidas` (`ID`, `Valor`, `Latitud`, `Longitud`, `Fecha`, `Sensor`) VALUES (NULL, '"+medida.valor+"', '"+medida.latitud+"', '"+medida.longitud+"', '"+medida.fecha+"', '"+medida.sensor_id+"');"
    
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
export default MedidasControlador;