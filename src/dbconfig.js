var mysql = require('mysql');

const pool = mysql.createPool({
    host : "127.0.0.1",
    user : "root",
    password : "",
    database : "eco_terreno"
});

const medicion = "medida";
const usuario = "usuario";
const nodo_estado = "estado";
const medalla = "medalla";
const nodo = "nodo";
const sitio = "sitio";
const medicion_tipo = "tipo";
const usuario_medalla = "usuario_medalla";

export {pool, medicion, usuario, nodo_estado, medalla, nodo, sitio, medicion_tipo, usuario_medalla};