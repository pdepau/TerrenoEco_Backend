// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Funciones para los objetos Nodo de la base de datos
// Creado: 03/11/2021
// -----------------------------------------------------------------

import {pool, nodo} from '../dbconfig.js';

/**
 * 
 */
class NodosControlador {
    static crearNodo(json) {
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