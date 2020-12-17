const tareas=document.querySelector('.listado-pendientes');
import Axios from 'axios';
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';


if(tareas){

    tareas.addEventListener('click', e =>{
        if(e.target.classList.contains('fa-check-circle')){
            
            const icono=e.target;
            const idTarea=icono.parentElement.parentElement.dataset.tarea;

            //Request hacia /tareas/:id

            const url=`${location.origin}/tareas/${idTarea}`
            
            Axios.patch(url,{idTarea})
                .then(function(respuesta){
                    if(respuesta.status===200){
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash-alt')){
            
            const tareaHTML=e.target.parentElement.parentElement;
            const idTarea=tareaHTML.dataset.tarea;

            Swal.fire({
                title: '¿Deseas eliminar esta tarea?',
                text: "Una tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, Borrar',
                cancelButtonText:'No, Cancelar'
                }).then((result) => {
                if (result.value) {

                    const url=`${location.origin}/tareas/${idTarea}`;
                    Axios.delete(url,{params:{idTarea}})
                        .then(function(respuesta){
                            if(respuesta.status===200){
                                console.log(respuesta);
                                //Eliminar el Nodo
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                //Opcional una alerta
                                Swal.fire(
                                    'Tarea eliminada',
                                    respuesta.data,
                                    'success'
                                )
                                actualizarAvance();
                            }
                        })

                }
            })
                
        }
    })

}

export default tareas;