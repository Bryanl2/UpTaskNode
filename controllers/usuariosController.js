const Usuarios=require('../models/Usuarios');
const enviarEmail=require('../handlers/email')

exports.formCrearCuenta=(req,res)=>{
    res.render('crearCuenta',{
        nombrePagina:'Crear Cuenta en UpTask'
    })
}

exports.formIniciarSesion=(req,res)=>{
    console.log(res.locals.mensajes);
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion',{
        nombrePagina:'Iniciar Sesión en UpTask',
        error:error
    })
}

exports.crearCuenta= async (req,res)=>{
    //Leer los datos

    const {email,password}=req.body;

    try{
        
        //Crear los usuarios
        await Usuarios.create({
            email,
            password,
        });
        //Crear una url de confirmar
        const confirmarUrl=`http://${req.headers.host}/confirmar/${email}`;

        

        //Crear el objeto de usuario
        const usuario={
            email
        }

        //Enviar Email
        await enviarEmail.enviar({
            usuario,
            subject:'Confirma tu cuenta Uptask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        })

        

        //Redirigir al usuario
        req.flash('correcto','Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');

    }catch(error){
        console.log('THIS IS THE ERROR'+error)
        req.flash('error',error.errors.map(error => error.message))
        res.render('crearCuenta',{
            mensajes:req.flash(),
            nombrePagina:'Crear Cuenta en Uptask',
            msg:'Usuario ya registrado',
            email,
            password
        })
    }
   
}

exports.formRestablecerPassword=(req,res)=>{
    res.render('reestablecer',{
        nombrePagina:'Restablecer tu contraseña'
    })
};
//Cambia el estado de una cuenta
exports.confirmarCuenta=async(req,res)=>{
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}