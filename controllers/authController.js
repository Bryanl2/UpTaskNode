const Sequelize=require('sequelize')
const passport=require('passport');
const Usuarios=require('../models/Usuarios')
const Op=Sequelize.Op
const crypto=require('crypto');
const bcrypt=require('bcrypt-nodejs');
const enviarEmail=require('../handlers/email')


exports.autenticarUsuario=passport.authenticate('local',{ //primer parámetro es la estrategia a utilizar
    successRedirect:'/',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Ambos campos son Obligatorios'

})

//FUnción para revisar si el usuario esta logueado o no

exports.usuarioAutenticado=(req,res,next)=>{
    //Si el usuario esta autenticado , adelante

    if(req.isAuthenticated()){
        return next();
    }

    //Sino está autenticado , redirigir formulario
    res.redirect('/iniciar-sesion');
}

//Función para cerrar sesión

exports.cerrarSesion=(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');//al cerrar sesión
    })
}

//Genera un token si el usuario es válido

exports.enviarToken= async (req,res)=>{

    //Verificar que el usuario existe
    const{email}=req.body
    const usuario=await Usuarios.findOne({where:{email}})

    //Si no existe el usuario

    if(!usuario){
        req.flash('error','No existe esa cuenta')
        res.redirect('/reestablecer'); 
    }

    //Usuario existe
    usuario.token=crypto.randomBytes(20).toString('hex');
    usuario.expiracion=Date.now()+3600000
    //console.log(token)
    //console.log(expiracion)

    //Guardarlos en la base de datos
    await usuario.save();

    //url de reset
    const resetUrl=`http://${req.headers.host}/reestablecer/${usuario.token}`;
    //res.redirect(resetUrl);

    //Rnviar el correo con el token

    await enviarEmail.enviar({
        usuario,
        subject:'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    })

    req.flash('correcto','Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');


}

exports.validarToken=async (req,res)=>{
    const usuario= await Usuarios.findOne({where:{token:req.params.token}});

    //Si no encuentra el usuario

    if(!usuario){
        res.flash('error','No válido')
        res.redirect('/reestablecer');
    }

    //Formulario para generar el password
    res.render('resetPassword',{
        nombrePagina:'Reestablecer Contraseña'
    })
}

//Cambia el password por uno nuevo
exports.actualizarPassword=async(req,res)=>{
    //Verifica el token valido pero tambien la fecha de expiración
    const usuario=await Usuarios.findOne({where:{
        token: req.params.token,
        expiracion:{
            [Op.gte]:Date.now()
        }
    }})
    //Verificamos si el usuario existe
    if(!usuario){
        req.flash('error','No válido')
        res.redirect('/reestablecer');
    }

    //Hashear el nuevo password
    usuario.password= bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
    usuario.token=null;
    usuario.expiracion=null;

    //Guardar el nuevo password
    await usuario.save();

    req.flash('correcto','Tu password se ha modificado correctamente')
    res.redirect('/iniciar-sesion');

};

