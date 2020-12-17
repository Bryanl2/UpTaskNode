const express=require('express');
const routes=require('./routes/index');
const path=require('path');
const bodyParser=require('body-parser');
const flash=require('connect-flash');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const passport=require('./config/passport');


//Importar las variables entorno
require('dotenv').config({path:'variables.env'})


//Helpers con algunas funciones
const helpers = require('./helpers');

//Crear la conexión a la base de datos

const db= require('./config/db');
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');


db.sync()
    .then(()=>console.log("Conectado al servidor"))
    .catch(error=> console.log(error))

//Crear una app de express
const app= express();

//Habilitar body parser para leer datos del formulario
app.use(bodyParser.urlencoded({extended:true}))

//Agregar flash messages
app.use(flash());

app.use(cookieParser());

//sessions permite navegar por distintas páginas sin volverse a autenticar
app.use(session({
    secret:'supersecreto',
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar vardum a la aplicación

app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes=req.flash();
    res.locals.usuario={...req.user} || null;
    console.log(res.locals.usuario); 
    next();
});



//Ruta para el Home

app.use("/",routes());

//Definiendo los archivos estáticos

app.use(express.static("public"));

//Habilitando en template

app.set('view engine','pug');

//Habilitando las rutas de las vistas

app.set("views",path.join(__dirname,"./views"));


require('./handlers/email');

//Servidor y Puerto

const host=process.env.HOST || '0.0.0.0'
const port=process.env.PORT || 3001;

app.listen(port,host,()=>{
    console.log("El sevidor está funcionando");
})