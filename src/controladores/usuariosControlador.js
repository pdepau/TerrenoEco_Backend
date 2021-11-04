// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Funciones para los objetos Usuario de la base de datos
// Creado: 31/10/2021
// -----------------------------------------------------------------

import {pool, usuario} from '../dbconfig.js';

class usuariosControlador {
      /**
       * id:Z
       *                obtenerUsuario()
       * [JSON] <-
       * 
       * Devuelve un JSON con el usuario
       *
       * @return {promise} promesa de los datos de usuario
       * 
       */
      static obtenerUsuario(id) {
            return new Promise(result => {

                  var queryString = "SELECT * FROM "+usuario+" WHERE "+usuario+".ID='"+id+"';";

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
       *                obtenerUltimoUsuario()
       * Usuario <-
       * Devuelve un JSON con el ultimo usuario
       *
       * @return {promise} promesa de JSON con los datos
       * 
       */
       static obtenerUltimoUsuario() {
            return new Promise(result => {

                  var queryString = "SELECT MAX(ID) as id, nombre, telefono valor FROM "+usuario+";";

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
       * usuario:Usuario -> 
       *                crearUsuario() -> 
       * respuesta:JSON <-
       * 
       * Crea una nueva usuario en la base de datos con los datos recibidos
       *
       * @param {text} json con los datos de la usuario
       * @return {promise} promesa de los datos
       * 
       */
      static crearUsuario(json) {
            return new Promise(result => {

                  const queryString = "INSERT INTO `"+usuario+"` (`ID`, `nombre`, `telefono`, `password`) VALUES ('NULL', '"+json.nombre+"', '"+json.telefono+"', '"+json.password+"');"
                  
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
       * usuario:Usuario -> 
       *                actualizarUsuario() ->
       * json <- 
       * 
       * Actualiza un usuario en la base de datos con los datos recibidos
       *
       * @param {text} json con los datos de la usuario
       * @return {promise} promesa con la respuesta
       * 
       */
      static actualizarUsuario(json) {
            return new Promise(result => {
                  
                  // ID es NULL porque la base da datos lo asigna como valor autoincremental
                  const queryString = "UPDATE `"+usuario+"` SET `nombre` = '"+json.nombre+"', `telefono` = '"+json.telefono+"', `password` = '"+json.password+"' WHERE `"+usuario+"`.`ID` = "+json.id+";"

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
       * id:Z -> 
       *                borrarUsuario() ->
       * json <- 
       * 
       * Actualiza un usuario en la base de datos con los datos recibidos
       *
       * @param {Z} id del usuario
       * @return {promise} promesa con la respuesta
       * 
       */
      static borrarUsuario(id) {
            return new Promise(result => {
                  
                  // ID es NULL porque la base da datos lo asigna como valor autoincremental
                  const queryString = "UPDATE `"+usuario+"` SET `nombre` = '', `telefono` = '', `password` = '' WHERE `"+usuario+"`.`ID` = "+id+";"

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

export default usuariosControlador;