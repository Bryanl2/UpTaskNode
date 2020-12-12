const slug = require('slug');
const Proyectos=require('../models/Proyectos');

exports.proyectosHome=async(req,res)=>{
    const proyectos= await Proyectos.findAll();
    res.render("index",{
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto=  async (req,res)=>{
    
    const proyectos= await Proyectos.findAll();


    res.render('nuevoProyecto',{
        nombrePagina:'Nuevo Proyecto',
        proyectos
        
    })
}

exports.nuevoProyecto= async (req,res)=>{

    const proyectos= await Proyectos.findAll();

    //Enviar a la consola lo que el usuario escriba

    //Validar que tengamos algo en el input

    const {nombre}=req.body;

    let errores=[]

    if(!nombre){
        errores.push({'texto':'Agrega un nombre al proyecto'});
    }

    //Si hay errores

    if(errores.length>0){
        res.render('nuevoProyecto',{
            nombrePagina:'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //const resultado= Proyectos.create({nombre});
        //resultado.then(()=>console.log("Insertado correctamente"))
        //.catch(error=>console.log(error));

        
        const proyecto= await Proyectos.create({nombre})
        res.redirect('/');

        
    } 
}

exports.proyectosPorUrl=async (req,res,next)=>{
    const proyectos= await Proyectos.findAll();

    const proyecto = await Proyectos.findOne({
        where:{
            url: req.params.url,
        }
    })

    if(!proyecto)return next();
    

    //Render a la vista

    res.render('tareas',{
        nombrePagina:"Tareas del Proyecto",
        proyecto,
        proyectos
    })
    
}


exports.formularioEditar= async (req,res)=>{

    const proyectosPromise=  Proyectos.findAll();

    const proyectoPromise=  Proyectos.findOne({
        where:{
            id:req.params.id
        }
    });

    const [proyectos,proyecto]= await Promise.all([proyectosPromise,proyectoPromise])
    //Render la vista
    res.render('nuevoProyecto',{
        nombrePagina:'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto= async (req,res)=>{

    const proyectos= await Proyectos.findAll();

    //Enviar a la consola lo que el usuario escriba

    //Validar que tengamos algo en el input

    const {nombre}=req.body;

    let errores=[]

    if(!nombre){
        errores.push({'texto':'Agrega un nombre al proyecto'});
    }

    //Si hay errores

    if(errores.length>0){
        res.render('nuevoProyecto',{
            nombrePagina:'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //const resultado= Proyectos.create({nombre});
        //resultado.then(()=>console.log("Insertado correctamente"))
        //.catch(error=>console.log(error));

        
        const proyecto= await Proyectos.update(
            {nombre: nombre},
            {where:{id:req.params.id}}
            );
        res.redirect('/');

        
    } 
}

exports.eliminarProyecto= async (req,res,next)=>{

    //Req, params query
    //console.log(req.params);

    const {urlProyecto}=req.query;

    const resultado=await Proyectos.destroy({where:{url:urlProyecto}});



    if(!resultado){
        return next();
    }

    res.status(200).send('Proyecto eliminado Correctamente')

}