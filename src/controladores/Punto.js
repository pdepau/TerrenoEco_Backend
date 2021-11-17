// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Funciones para un objeto Punto en coordenadas cartesianas
// Creado: 17/11/2021
// -----------------------------------------------------------------

class Punto {
    /**
     * Crea un punto con X e Y en ejes cartesianos
     * 
     * @param {number} lat del punto
     * @param {number} lon del punto
     */
    constructor(lat,lon) {
        this.lat = lat;
        this.lon = lon;
    }

    /**
     * Calcula la distancia entre dos puntos dados
     * 
     * @param {Punto} punto para calcular la distancia
     * @returns number con la distancia
     */
    distancia(punto) {
        return Math.sqrt(Math.pow(this.lat-punto.lat,2)+Math.pow(this.lon-punto.lon,2))
    }
}

export default Punto;