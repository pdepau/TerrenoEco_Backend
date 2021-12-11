// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Funciones para la tabla Tipo de la base de datos
// Creado: 11/12/2021
// -----------------------------------------------------------------

import {medicion_tipo} from '../dbconfig.js';

class TipoControlador {

    /**
     * id:Z,
     * pool:pool =>
     *          obtenerTipo()
     * Tipo:texto <=
     * 
     * @param {number} id del tipo
     * @param {*} pool de la base de datos
     * @returns {promise} promesa de los datos
     */
    static obtenerTipo(id, pool) {
    // Recibe un Tipo
    return new Promise(result => {

            var queryString = "SELECT * from " + medicion_tipo + " WHERE `ID`=" + id;

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

export default TipoControlador;