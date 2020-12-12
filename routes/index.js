const express=require('express');
const router=express.Router();

//Importar express validator

const {body} = require('express-validator');

//Importando controlador
const proyectoController=require('../controllers/proyectosController');


module.exports=function (){

    router.get("/",proyectoController.proyectosHome);
    router.get("/nuevo-proyecto",proyectoController.formularioProyecto);
    router.post("/nuevo-proyecto",
    
        body('nombre').not().isEmpty().trim().escape(),
    
        proyectoController.nuevoProyecto);

    //Listar proyecto

    router.get('/proyectos/:url',proyectoController.proyectosPorUrl)

    //Actualizar proyecto

    router.get('/proyecto/editar/:id', proyectoController.formularioEditar);

    router.post("/nuevo-proyecto/:id",
    
        body('nombre').not().isEmpty().trim().escape(),
    
        proyectoController.actualizarProyecto);

    //Eliminar Proyecto

    router.delete('/proyectos/:url',proyectoController.eliminarProyecto);

    return router;   
}

