import Swal from 'sweetalert2';
import Axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click',e =>{
        
        const urlProyecto=e.target.dataset.proyectoUrl;
        

        Swal.fire({
        title: '¿Deseas eliminar este proyecto?',
        text: "Un proyecto eliminado no se puede recuperar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, Borrar',
        cancelButtonText:'No, Cancelar'
        }).then((result) => {
        if (result.value) {

            //Enviar Petición a Axios
            const url=`${location.origin}/proyectos/${urlProyecto}`

            Axios.delete(url,{params:{urlProyecto}})
                .then(function(respuesta){
                    
                    Swal.fire(
                        'Eliminado!',
                        'Tu proyecto ha sido eliminado.',
                        'success'
                        )
                     setTimeout(()=>{
                            window.location.href="/"
                        },2000)
                })     
                .catch(()=>{
                    Swal.fire({
                        type:'error',
                        title:'Hubo un error',
                        text:'No se pudo eliminar el Proyecto'
                    })
                })       
        }
        });       
})
}

export default btnEliminar;
