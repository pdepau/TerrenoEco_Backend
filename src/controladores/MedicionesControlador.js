// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Funciones para los objetos Medicion de la base de datos
// Creado: 06/10/2021
// -----------------------------------------------------------------

import {pool, medicion} from '../dbconfig.js';
import Punto from './Punto.js';

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
       *                interpolarMediciones()
       * datos:[interpolados] <-
       * 
       * Interpola una lista de mediciones y crea valores entre los resultados obtenidos
       * 
       * @param {string} mediciones acotadas
       * @param {number} factor de interpolacion
       * @returns array de puntos interpolados
       */
      static interpolarMediciones(mediciones, factor) {
            let interpolados = [];
            let points = [];
            const j_mediciones = JSON.parse(mediciones);
            j_mediciones.forEach(medicion => {
                  points.push([medicion.latitud, medicion.longitud, medicion.valor]);
                  // Insertamos los valores de la entrada en la misma salida
                  interpolados.push({
                        latitud: medicion.latitud,
                        longitud: medicion.longitud,
                        valor: medicion.valor
                  })
            });

            // Toma valores de las mediciones minimo y maximo para acotar la interpolacion
            // por el factor
            const LatMax = Math.max.apply(Math, j_mediciones.map(function(o) { return o.latitud; }))
            const LonMax = Math.max.apply(Math, j_mediciones.map(function(o) { return o.longitud; }))
            const LatMin = Math.min.apply(Math, j_mediciones.map(function(o) { return o.latitud; }))
            const LonMin = Math.min.apply(Math, j_mediciones.map(function(o) { return o.longitud; }))

            // Crea los valores de lat y lon para los datos discretos, el factor es la
            // cantidad de medidas de salida entre medidas de entrada
            const cantidad = j_mediciones.length * factor;
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
                              latitud: LatMin + escalon   * i,
                              longitud: LonMin + escalon * j,
                              valor: mediaPonderada
                        });
                  } // for j
            } // for i

            return interpolados;
      }
}

export default MedicionesControlador;