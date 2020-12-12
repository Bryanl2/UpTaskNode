const express=require('express');
const routes=require('./routes/index')
const path=require('path');
const bodyParser=require('body-parser');

//Helpers con algunas funciones
const helpers = require('./helpers');

//Crear la conexión a la base de datos

const db= require('./config/db');
require('./models/Proyectos');

db.sync()
    .then(()=>console.log("Conectado al servidor"))
    .catch(error=> console.log(error))

//Crear una app de express
const app= express();

//Pasar vardum a la aplicación

app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
   
    next();
});

//Habilitar body parser para leer datos del formulario
app.use(bodyParser.urlencoded({extended:true}))


//Ruta para el Home

app.use("/",routes())

//Definiendo los archivos estáticos

app.use(express.static("public"))

//Habilitando en template

app.set('view engine','pug')

//Habilitando las rutas de las vistas

app.set("views",path.join(__dirname,"./views"));



app.listen(3001);