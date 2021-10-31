// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Funciones para los objetos Usuario de la base de datos
// Creado: 31/10/2021
// -----------------------------------------------------------------

import pool from '../dbconfig.js';

class usuariosControlador {
// -----------------------------------------------------------------
      //#region post
      // -----------------------------------------------------------------
      /**
       * usuario:Usuario -> postUsuario() -> respuesta:JSON
       * 
       * Crea una nueva usuario en la base de datos con los datos recibidos
       *
       * @param {text} json con los datos de la usuario
       * @return {text} JSON con la usuario
       * 
       */
       static postUsuario(usuario) {
            
        return new Promise(result => {
              
              // ID es NULL porque la base da datos lo asigna como valor autoincremental
              const queryString = "INSERT INTO `usuarios` (`ID`, `Nombre`, `Telefono`, `Password`) VALUES (NULL, '"+usuario.nombre+"', '"+usuario.telefono+"', '"+usuario.password+"');"

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

export default usuariosControlador;