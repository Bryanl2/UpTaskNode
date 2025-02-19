const slug = require('slug');
const Proyectos=require('../models/Proyectos');
const Tareas=require('../models/Tareas');

exports.proyectosHome=async(req,res)=>{
    //const usuarioId=res.locals.usuario.id;
    const usuarioId=res.locals.usuario.id;
    const proyectos= await Proyectos.findAll({where:{usuarioId}});
    res.render("index",{
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto=  async (req,res)=>{
    
    const usuarioId=res.locals.usuario.id;
    const proyectos= await Proyectos.findAll({where:{usuarioId}});


    res.render('nuevoProyecto',{
        nombrePagina:'Nuevo Proyecto',
        proyectos
        
    })
}

exports.nuevoProyecto= async (req,res)=>{

    const usuarioId=res.locals.usuario.id;
    const proyectos= await Proyectos.findAll({where:{usuarioId}});

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

        const usuarioId=res.locals.usuario.id;
        const proyecto= await Proyectos.create({nombre,usuarioId})
        res.redirect('/');

        
    } 
}

exports.proyectosPorUrl=async (req,res,next)=>{
    const usuarioId=res.locals.usuario.id;
    const proyectos= await Proyectos.findAll({where:{usuarioId}});
    

    const proyecto = await Proyectos.findOne({
        where:{
            url: req.params.url,
            usuarioId
        }
    })

    //Consultar tareas del Proyecto actual

    const tareas= await Tareas.findAll({
        where:{
            proyectoId: proyecto.id
        },
        //include:[
          //  {model:Proyectos}
        //]
    });

    console.log(tareas);

    if(!proyecto)return next();
    

    //Render a la vista

    res.render('tareas',{
        nombrePagina:"Tareas del Proyecto",
        proyecto,
        proyectos,
        tareas
    })
    
}


exports.formularioEditar= async (req,res)=>{

    const usuarioId=res.locals.usuario.id;
    const proyectosPromise=  Proyectos.findAll({where:{usuarioId}});

    

    const proyectoPromise=  Proyectos.findOne({
        where:{
            id:req.params.id,usuarioId
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

    const usuarioId=res.locals.usuario.id;
    const proyectos= await Proyectos.findAll({where:{usuarioId}});

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