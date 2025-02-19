const Sequelize=require('sequelize');
const db=require('../config/db');
const Proyectos=require('./Proyectos');
const Tareas= db.define('tareas',{

    id:{
        type:Sequelize.INTEGER(70),
        primaryKey:true,
        autoIncrement:true,
    },
    tarea:Sequelize.STRING(100),
    estado:Sequelize.INTEGER(1),
});

Tareas.belongsTo(Proyectos);
//Proyectos.hasMany(Tareas);

module.exports=Tareas;