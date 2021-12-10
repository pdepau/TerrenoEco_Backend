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
 */
//TODO: obtener datos
function obtenerDatos(URL, municipio) {
  return new Promise(async (resolve,reject) => {
    let pasos = 0;
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
      const gandia = []
      // --------------------------------------------
      // Creamos el listener para esperar los datos
      // --------------------------------------------
      //await page.setRequestInterception(true);
      page.on('request', async request => {
        if (request.resourceType() == 'xhr') {
          console.debug("Paso: " + pasos);
          if(pasos == 1) {
            pasos += 1;
            // Se espera a que el request finalice
            await page.waitForResponse(response => response.status() === 200)
            // Pilla los datos del request
            const resultado = request.response();
            console.debug("Conseguido. Cerrando buscador");
            request.abort();
        
            gandia.push(await resultado.json());
            resolve(gandia);
            await browser.close(); 
          }
          if(pasos==0) {
            pasos += 1;
            let botones = 0;
            while(botones < 1) {
              botones = await estacion(page, municipio);
            }
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
 * Función privada auciliar para pulsar el boton de la estacion, queda más limpio el
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

    // Buscamos el boton de la estacion despues de detectar el municipio pulsado
    console.debug("Continua con la estacion")
    const elHandleArray2  = await page.$$('#idEstacionMunicipio');
    console.debug("Botones tomados: " + elHandleArray2.length)
    if(elHandleArray2.length < 1) {
      console.error("No se han encontrado botones")
      resolve(0);
    }
    for (let i = 0; i < elHandleArray2.length; i++) {
      // Comprueba los nombre de cada municipio de la lista
      const nombre = await (await elHandleArray2[i].getProperty('innerText')).jsonValue();
      // Vamos a buscar Gandia
      if(nombre == municipio) {
        // Pulsa el boton
        // ERROR: no se pulsa el boton correctamente, no envia request 
        //give time to extra rendering time
        await page.waitForTimeout(2000);
        elHandleArray2[i].click();
        console.debug("Boton pulsado de la estacion")
        resolve(1);
      } // if
    } // for
  }) // Promise
}

export {obtenerDatos}