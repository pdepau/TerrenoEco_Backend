// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Funciones para los objetos Nodo de la base de datos
// Creado: 03/11/2021
// -----------------------------------------------------------------

import {nodo} from '../dbconfig.js';

class NodosControlador {
      /**
       * json:Nodo -> 
       *                crearNodo() ->
       * resultado:texto <-
       * 
       * Crea un nuevo nodo con los datos insertados
       * 
       * @param {texto} json con el nodo
       * @param {pool} pool de la base de datos
       * @returns {promise} promesa del resultado
       */
      static crearNodo(json, pool) {
            return new Promise(result => {
                        
                  // ID es NULL porque la base da datos lo asigna como valor autoincremental
                  const queryString = "INSERT INTO `"+nodo+"` (`ID`, `usuario`, `estado`) VALUES (NULL, '"+json.usuario+"', '"+json.estado+"');"

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
}

export default NodosControlador;