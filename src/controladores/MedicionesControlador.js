// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Funciones para los objetos Medicion de la base de datos
// Creado: 06/10/2021
// -----------------------------------------------------------------

import {medicion} from '../dbconfig.js';
import Punto from './Punto.js';

class MedicionesControlador {
      /**
       * getTodasLasMediciones -> [JSON]
       * Devuelve un JSON con todas las Mediciones
       *
       * @param {pool} pool de la base de datos
       * @return {promise} promesa de los datos
       * 
       */
      static obtenerTodasLasMediciones(pool) {
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
       * getTodasLasMediciones -> [JSON]
       * Devuelve un JSON con todas las Mediciones
       *
       * @param {pool} pool de la base de datos
       * @return {promise} promesa de los datos
       * 
       */
             static obtenerUltimasMedicionesDeUsuario(pool,idUsuario,cuantas) {
                  // Recibe las Mediciones
                  return new Promise(result => {
      
                        var queryString = "SELECT * FROM `"+medicion+"` WHERE `usuario`="+idUsuario+" ORDER BY `tiempo` DESC LIMIT "+cuantas;
      
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
       * posicion1:Posicion,
       * posicion2:Posicion,
       * t_inicio:Z,
       * t_final:Z,
       * tipo:Z =>
       *       obtenerMedicionesAcotadas()
       * [Medicion] <=
       * 
       * Recibes datos para acotar una medicion segun la posicion, el tiempo y el tipo
       * 
       * @param {Punto} puntoMin 
       * @param {Punto} puntoMax 
       * @param {number} tiempoMin 
       * @param {number} tiempoMax 
       * @param {number} tipo de la medida
       * @param {pool} pool de la base de datos
       * @returns {promise} promesa de los datos
       */
      static obtenerMedicionesAcotadas(puntoMin, puntoMax, tiempoMin, tiempoMax, tipo, pool) {
            return new Promise(result => {
                  
                  var queryString = "SELECT * FROM medida WHERE ";
                  // Si uno de los valores no es null lo pone en el query
                  if(puntoMin != null && puntoMax != null) {
                        queryString+=(`${medicion}.latitud < ${puntoMax.lat} AND ${medicion}.latitud > ${puntoMin.lat} AND `)
                        queryString+=(`${medicion}.longitud < ${puntoMax.lon} AND ${medicion}.longitud > ${puntoMin.lon} AND `)
                        
                  } else {
                        result('Los puntos no son válidos, deben ser objetos Punto');
                  }
                  if(tiempoMin != null && tiempoMax != null) {
                        queryString+=(`${medicion}.tiempo < ${tiempoMax} AND ${medicion}.tiempo > ${tiempoMin} AND `)
                  } else {
                        result('Los tiempos no son válidos, deben estar en milisegundos');
                  }
                  if(tipo != null) {
                        queryString+=(`${medicion}.tipo = ${tipo}`)
                  } else {
                        result('El tipo no es válido, debe ser un numero');
                  }
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
       * @param {pool} pool de la base de datos
       * @return {promise} promesa de JSON con la medicion
       * 
       */
      static obtenerUltimaMedicion(pool) {
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
       * @param {pool} pool de la base de datos
       * @return {promise} promesa
       * 
       */
      static crearMedicion(json, pool) {
            var a;

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
       *                interpolarMediciones()
       * datos:[interpolados] <-
       * 
       * Interpola una lista de mediciones y crea valores entre los resultados obtenidos
       * 
       * Datos devueltos:
       * [{
       *    latitud: -0.3452,
       *    longitud: 0.262462,
       *    valor: 43
       * },
       * {
       *    latitud: -0.3352,
       *    longitud: 0.222462,
       *    valor: 32
       * }]
       * 
       * @param {string} mediciones acotadas
       * @param {number} factor de interpolacion
       * @returns array de puntos interpolados
       */
      static interpolarMediciones(mediciones, factor) {
            let interpolados = [];
            let points = [];
            // No es necesario
            // const j_mediciones = JSON.parse(mediciones);
            mediciones.forEach(medicion => {
                  points.push([medicion.latitud, medicion.longitud, medicion.valor]);
                  // Insertamos los valores de la entrada en la misma salida
                  interpolados.push({
                        lat: medicion.latitud,
                        lng: medicion.longitud,
                        valor: medicion.valor
                  })
            });

            // Toma valores de las mediciones minimo y maximo para acotar la interpolacion
            // por el factor
            const LatMax = Math.max.apply(Math, mediciones.map(function(o) { return o.latitud; }))
            const LonMax = Math.max.apply(Math, mediciones.map(function(o) { return o.longitud; }))
            const LatMin = Math.min.apply(Math, mediciones.map(function(o) { return o.latitud; }))
            const LonMin = Math.min.apply(Math, mediciones.map(function(o) { return o.longitud; }))

            // Crea los valores de lat y lon para los datos discretos, el factor es la
            // cantidad de medidas de salida entre medidas de entrada
            const cantidad = mediciones.length * factor;
            const diferencia = LonMax - LonMin;

            const escalon = diferencia/cantidad;

            // Para cada latitud
            for (let i = 0; i < cantidad; i++) {
                  // Para cada longitud
                  for (let j = 0; j < cantidad; j++) {
                        // Averiguamos la distancia del punto actual respecto a los puntos
                        // input
                        // Punto actual, calculado a partir del punto minimo y sumando escalones
                        let nPunto = new Punto(LatMin + escalon * i,
                              LonMin + escalon * j);

                        // Para cada punto input averiguamos la distancia y despues
                        // calculamos la media ponderada usando pesos         
                        let total = 0;
                        let totalPesos = 0;
                        points.forEach(p => {
                              let aPunto = new Punto(p[0],p[1]);
                              let distancia = nPunto.distancia(aPunto);
                              // Calcula el peso que tiene aPunto en el que estamos
                              // calculando, que es inversamente proporcional a la
                              // cantidad de nodos por los que pasa antes de llegar a
                              // nPunto
                              // p[2] es la magnitud
                              total += p[2]*(distancia/escalon);
                              totalPesos += (distancia/escalon)
                        });

                        let mediaPonderada = total/totalPesos;
                        
                        interpolados.push({
                              lat: LatMin + escalon * i,
                              lng: LonMin + escalon * j,
                              valor: mediaPonderada
                        });
                  } // for j
            } // for i

            return interpolados;
      }
}

export default MedicionesControlador;