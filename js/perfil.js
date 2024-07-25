// Perfil: request, validate & config

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');// Obtiene token desde localStorange guardado alli en el momento de login o registro

        if (!token) {
            throw new Error('1 en perfil: No hay token disponible');// Borrar Manejar error para mostar al usuario
        }

        const configResponse = await fetch('http://localhost:3000/api/config');//Obtiene la configuracion del backend desde front.static.routes.js
        if (!configResponse.ok) {
            throw new Error('en perfil js  error:  Error en la respuesta del servidor de configuración');
        }

        const config = await configResponse.json();
        const BACKEND_URL = config.backendUrl;
        console.log(' perfil.js 1.s : ruta  BACKEND_URL:', BACKEND_URL);// borrar
        const perfilResponse = await fetch(`${BACKEND_URL}/api/users/perfil`, { 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!perfilResponse.ok) {
            throw new Error('perfil.js, perfilResponse con fetch hace GET para traer datos al formulario:  Error al obtener los datos del usuario');
        }

        const data = await perfilResponse.json();
        console.log('en perfil.js: Datos recibidos:', data);// borrar
        console.log(JSON.stringify(data, null, 2));

        if (Array.isArray(data) && data.length > 0) {
            const userData = data[0];
            console.log('perfil.js userData:', userData); // Imprime los datos de usuario para ver qué contiene

            document.getElementById('usuario').textContent = userData.usuario;
            console.log('usuario element:', document.getElementById('usuario'), userData.usuario);// borrar
            document.getElementById('email').textContent = userData.email;
            console.log('usuario element:', document.getElementById('email'), userData.email);// borrar
            //document.getElementById('password').textContent = userData.password;
            //console.log('usuario element:', document.getElementById('password'), userData.password);// borrar

            document.getElementById('id').textContent = userData.id_usuarios;
            console.log('usuario element:', document.getElementById('id'), userData.id_usuarios);// borrar 
            document.getElementById('rol').textContent = userData.rol;
            console.log('usuario element:', document.getElementById('rol'), userData.rol);// borrar
            document.getElementById('status').textContent = userData.status;
            console.log('usuario element:', document.getElementById('status'), userData.status);// borrar

            document.getElementById('nombre').value = userData.nombre || '';
            console.log('usuario element:', document.getElementById('nombre'), userData.nombre);// borrar
            document.getElementById('apellido').value = userData.apellido || '';
            console.log('usuario element:', document.getElementById('apellido'), userData.apellido || '');// borrar
            document.getElementById('fecha_nacimiento').value = userData.fecha_nacimiento || '';
            console.log('usuario element:', document.getElementById('fecha_nacimiento'), userData.fecha_nacimiento);// borrar
            document.getElementById('telefono').value = userData.telefono || '';
            console.log('usuario element:', document.getElementById('telefono'), userData.telefono );// borrar
            document.getElementById('direccion').value = userData.direccion || '';
            console.log('usuario element:', document.getElementById('direccion'), userData.direccion);// borrar
            document.getElementById('ciudad').value = userData.ciudad || '';
            console.log('usuario element:', document.getElementById('ciudad'), userData.ciudad);// borrar
            document.getElementById('provincia').value = userData.provincia || '';
            console.log('usuario element:', document.getElementById('provincia'), userData.provincia);// borrar
            document.getElementById('pais').value = userData.pais || '';
            console.log('usuario element:', document.getElementById('pais'), userData.pais);// borrar
            document.getElementById('codigo_postal').value = userData.codigo_postal || '';
            console.log('usuario element:', document.getElementById('codigo_postal'), userData.codigo_postal);// borrar
            document.getElementById('imagen_perfil').value = userData.imagen_perfil || '';
            console.log('usuario element:', document.getElementById('imagen_perfil'), userData.imagen_perfil);// borrar
        } else {
            console.error('en perfil.js el if de data: El formato de los datos no es correcto o los datos están vacíos.');
            console.log('perfil.js data.result que no entra al if:', data); // Imprime data.result para verificar qué contiene
        }

        const perfilForm = document.getElementById('perfilForm');

        perfilForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const usuario = document.getElementById('usuario') ? document.getElementById('usuario').textContent.trim() : '';
            const email = document.getElementById('email') ? document.getElementById('email').textContent.trim() : '';
            //const passwor = document.getElementById('password') ? document.getElementById('password').textContent.trim() : '';// habilitar si se habilita en htmlñ y mas arriba donde se muestran los datos
            
            //const id_usuarios = document.getElementById('id_usuarios') ? document.getElementById('id_usuarios').textContent.trim() : '';/*admin*/ // No permitido en DB
            const rol = document.getElementById('rol') ? document.getElementById('rol').textContent.trim() : '';/*admin*/
            const status = document.getElementById('status') ? document.getElementById('status').textContent.trim() : '';/*admin*/

            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const fechaNacimiento = document.getElementById('fecha_nacimiento').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const direccion = document.getElementById('direccion').value.trim();
            const ciudad = document.getElementById('ciudad').value.trim();
            const provincia = document.getElementById('provincia').value.trim();
            const pais = document.getElementById('pais').value.trim();
            const codigoPostal = document.getElementById('codigo_postal').value.trim();
            const imagen_perfil = document.getElementById('imagen_perfil').value.trim();

            const formData = {
                usuario,
                email,
                //password: password || undefined, // Activar si se activa en html
                //id_usuarios,// No permitido en DB - Eliminar
                rol,
                status,

                nombre: nombre || undefined,
                apellido: apellido || undefined,
                fecha_nacimiento: fechaNacimiento || undefined,
                telefono: telefono || undefined,
                direccion: direccion || undefined,
                ciudad: ciudad || undefined,
                provincia: provincia || undefined,
                pais: pais || undefined,
                codigo_postal: codigoPostal || undefined,
                imagen_perfil: imagen_perfil || undefined
            };

            // Filtrar datos vacíos para no enviarlos
            const filteredDataToUpdate = Object.fromEntries(
                Object.entries(formData).filter(([_, value]) => value !== undefined)
            );

            // Envio del formulario al backend
            return fetch(`${BACKEND_URL}/api/users/customer/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filteredDataToUpdate)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(result => {// Entra aqui cuando no se puedo actualizar el perfil y lanza el error
                        throw new Error(result.message || 'Error en la respuesta del servidor');
                    });
                }
                return response.json();// Parsea la respuesta como JSON si es OK
            })
            .then(result => {
                if (result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Perfil guardado con éxito',
                        text: 'Elija una opción',
                        allowEscapeKey: true,
                        allowOutsideClick: true,
                        showCancelButton: true,
                        showDenyButton: true,
                        confirmButtonText: 'Ir a catalogo',
                        denyButtonText: 'Ir a Inicio',
                        cancelButtonText: 'Salir',
                        preConfirm: () => {
                            window.location.href = 'catalogo.html';
                        },
                        preDeny: () => {
                            window.location.href = 'index.html';
                        }

                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.esc || result.dismiss === Swal.DismissReason.backdrop) {
                            window.location.href = 'index.html';

                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            logout(); // Ejecuta la funcion logout de common.js 
                            return false;
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Error al guardar el perfil',
                        text: result.message || 'Por favor, revise los cambios.',
                        showCancelButton: true,
                        confirmButtonText: 'Revisar Perfil',
                        cancelButtonText: 'Volver después',
                        preConfirm: () => {
                            // Para cerrar el cuadro de mensaje y permanecer en la misma pagina, no es necesario agregar nada aqui.
                        },
                        preDeny: () => {
                            window.location.href = 'catalogo.html';
                        }
                    });
                }
            })

            .catch(error => {
                console.error('Error en el proceso de perfil:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un problema con el perfil',
                    text: 'Inténtelo de nuevo.',
                    confirmButtonText: 'OK'
                });
            });

        });

    } catch (error) {
        console.error('Error al guardar el perfil:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error en la conexión',
            text: 'Hubo un problema al comunicarse con el servidor. Por favor, inténtelo de nuevo más tarde.',
            showCancelButton: true,
            confirmButtonText: 'Revisar Perfil',
            cancelButtonText: 'Volver después',
            preConfirm: () => {
                // Para cerrar el cuadro de mensaje y permanecer en la misma pagina, no es necesario agregar nada aqui.
            },
            preDeny: () => {
                window.location.href = 'catalogo.html';
            }
        });
    }


});

