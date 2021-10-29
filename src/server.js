// -----------------------------------------------------------------
// Autor: Luis Belloch
// Descripcion: Servidor de la API
// Creado: 15/09/2021
// -----------------------------------------------------------------

import express from 'express';
import bodyParser from 'body-parser';
import routes from './rutas/index';
const cors = require("cors")
// Instantiate express
const app = express();
// Set our port
const port = process.env.PORT || 8000;
// Configure app to user bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    res.setHeader('Content-Type', 'application/json');

    // Pass to next layer of middleware
    next();
});

// Register our routes in app
app.use('/', routes);
app.use(express.json());
app.use(cors())
// Start our server
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
// Export our app for testing purposes
export default app;

