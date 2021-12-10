import puppeteer from "puppeteer";


/**
 * URL:texto,
 * municipio,texto =>
 *      obtenerDatos()
 * datos:JSON <=
 * 
 * 
 * Funcion del web scraping que consigue los datos de la pagina de la GVA
 * 
 * Este programa es una liada, procede con cuidado
 * 
 * @param {string} URL de la pagina
 * @returns datos seleccionados de la pagina
 * 
 * Formato
[
  {
    estacion: [ [Object] ],
    datos: {
      longitudGoogleMaps: '-0.19109882',
      longitudDegrees: '-0.19109882',
      latitudDegrees: '38.96797739',
      altitud: '22 m',
      descMunicipio: 'Gandia',
      estacion: [Object],
      latitudGoogleMaps: '38.96797739',
      listMagnitudes: [Array]
    }
  }
]
 */
function obtenerDatos(URL, municipio) {
  return new Promise(async (resolve,reject) => {
    console.debug(URL);
    const browser = await puppeteer.launch({headless: true, devtools: true});
    console.debug("Buscador creado");
    const page = await browser.newPage();
    console.debug("Página abierta");
    await page.goto(URL, { waitUntil: "networkidle2" })
    console.debug("Página cargada");
    try {
      // Buscamos la lista de municipios
      const elHandleArray  = await page.$$('.li-lista-municipios');
      var estaciones = []
      let estacionDatos = 0;
      let datosFrame;
      var pasos = 0;
      let botones = 0;
      // --------------------------------------------
      // Creamos el listener para esperar los datos
      // --------------------------------------------
      //await page.setRequestInterception(true);
      page.on('request', async request => {
        if (request.resourceType() == 'xhr') {
          console.debug("Paso: " + pasos);
          // ERROR: No devuelve ningun dato ahora, se queda encallado. Hay que encontrar
          // otra forma de hacerlo seguramente
          // Municipio
          if(pasos==0) {
            pasos += 1;
            let botones = 0;
            const [response] = await Promise.all([
              page.waitForResponse(response => response.url().includes('obtenerEstacionesPorMunicipio')),
              botones = await estacion(page, municipio)
            ]);
          }
          // Estación
          if(pasos == 1) {
            pasos += 1;
            // Se espera a que el request finalice
            const [response] = await Promise.all([
              page.waitForRequest(
                (response) =>
                response.url().includes('obtenerEstacionesPorMunicipio') && response.status() === 200
              )
            ]);
            const dataObj = await response.json();
            estaciones.push(dataObj);
          }
          // Relleno
          if(pasos==2){
            pasos+=1;
            const [response] = await Promise.all([
              page.waitForResponse(response => response.url().includes('obtenerEstacionesPorMunicipio'))
            ]);
            const dataObj = await response.json();
            estaciones.push(dataObj);
          }
          // Datos
          if(pasos==3){
            pasos += 1;
            // Se espera a que el request finalice
            const [response] = await Promise.all([
              page.waitForResponse(response => response.url().includes('obtenerTablaPestanyaDatosOnline'))
            ]);
            const dataObj = await response.json();
            estaciones.push(dataObj);
            resolve(estaciones);
            console.debug("Conseguido. Cerrando buscador");
            await browser.close(); 
          }
        } // if
        request.continue();
      }); // page.request()
      // Buscamos el boton del municipio para pulsarlo
      for (let i = 0; i < elHandleArray.length; i++) {
        // Comprueba los nombre de cada municipio de la lista
        const nombre = await (await elHandleArray[i].getProperty('innerText')).jsonValue();
        // Vamos a buscar Gandia
        if(nombre == municipio) {
          // Pulsa el boton
          elHandleArray[i].click();
          console.debug("Boton pulsado")
        }
      } //for

    } catch (error) { // try
      reject(error);
    }


  }); // Promise
}; // obtenerDatos

/**
 * 
 * Función privada auxiliar para pulsar el boton de la estacion, queda más limpio el
 * código
 * 
 * @param {string} page object 
 * @param {string} municipio 
 * @returns number (1 is correct, 0 is error)
 */
function estacion (page, municipio) {
  return new Promise (async (resolve, reject) => {
    // request for js resource
    console.debug("Request municipio detectado")   
    let i = 0;
    while(i < 20) {
      // Buscamos el boton de la estacion despues de detectar el municipio pulsado
      console.debug("Continua con la estacion")
      const elHandleArray2  = await page.$$('#idEstacionMunicipio');
      console.debug("Botones tomados: " + elHandleArray2.length)
      if(elHandleArray2.length < 1) {
        console.error("No se han encontrado botones")
        i++;
      } else {
        break;
      }
    }
    for (let i = 0; i < elHandleArray2.length; i++) {
      // Comprueba los nombre de cada municipio de la lista
      const nombre = await (await elHandleArray2[i].getProperty('innerText')).jsonValue();
      // Vamos a buscar Gandia
      if(nombre == municipio) {
        // Pulsa el boton
        //give time to extra rendering time
        await page.waitForTimeout(2000);
        elHandleArray2[i].click();
        console.debug("Boton pulsado de la estacion")
        resolve(1);
      } // if
    } // for
  }) // Promise
}

async function asignarDatos() {
  const resultado = request.response();
  return await resultado.json();
}

export {obtenerDatos}