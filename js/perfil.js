// Perfil: request, validate & config
const baseUrl = 'http://localhost:3000/api';
const usersEndpoint = `${baseUrl}/users`; // Este endpoint sirve tambien para verificar el rol

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');// Obtiene token desde localStorange guardado alli en el momento de login o registro

        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Sesión caducada',
                text: 'Tu sesión ha caducado. Por favor, inicia sesión nuevamente.',
                confirmButtonText: 'Iniciar sesión'
            }).then(() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
            });
        }

        const perfilResponse = await fetch(`${usersEndpoint}/perfil`, { 
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const sessionValid = await sesionTokenError(perfilResponse);// Funcion en common.js para manejar cualquier error de token en la respuesta
        if (!sessionValid) return;

        if (!perfilResponse.ok) {
            throw new Error('perfil.js, perfilResponse con fetch hace GET para traer datos al formulario:  Error al obtener los datos del usuario');
        }

        const data = await perfilResponse.json();
        console.log('en perfil.js: Datos recibidos del GET:', data);// borrar
        console.log('en perfil estructura de Data, JSON.stringify(data, null, 2): ',JSON.stringify(data, null, 2));// borrar

        const userData = data[0];
        console.log('perfil.js userData:', userData); // Imprime los datos de usuario para ver qué contiene

        if (Array.isArray(data) && data.length > 0) {
            document.getElementById('id_usuarios').innerText = userData.id_usuarios || '';
            document.getElementById('usuario').value = userData.usuario || '';
            document.getElementById('email').innerText = userData.email;
            document.getElementById('currentUserImage').src = `${baseUrl}/4.Upload/users/${userData.imagen_name}`;
                    document.getElementById('currentUserImage').alt = "User Image";
                    document.getElementById('currentUserImage').style.maxWidth = "100px";
                    document.getElementById('currentUserImage').style.maxHeight = "100px";
            document.getElementById('nombre').value = userData.nombre || '';
            document.getElementById('apellido').value = userData.apellido || '';
                    const fechaNacimientoISO = userData.fecha_nacimiento;
                    const fechaFormateada = moment(fechaNacimientoISO).format('dddd D [de] MMMM [de] YYYY');// Se carga el formato que se mostrara
            document.getElementById('fecha_nacimiento').value = fechaFormateada;
            document.getElementById('telefono').value = userData.telefono || '';
            document.getElementById('direccion').value = userData.direccion || '';
            document.getElementById('ciudad').value = userData.ciudad || '';
            document.getElementById('provincia').value = userData.provincia || '';
            document.getElementById('pais').value = userData.pais || '';
            document.getElementById('codigo_postal').value = userData.codigo_postal || '';
            document.getElementById('imagen_name').value = userData.imagen_name || '';
            //document.getElementById('rol').value = userData.rol || '';//No mostrar en perfil, es solo vista Cliente y no Administrador
            //document.getElementById('status').value = userData.status|| '';//No mostrar en perfil, es solo vista Cliente y no Administrador

        } else {
            console.error('en perfil.js el if de data: El formato de los datos no es correcto o los datos están vacíos.');
            console.log('perfil.js data.result que no entra al if:', data); // Imprime data.result para verificar qué contiene
        }

        document.getElementById('perfilForm').addEventListener('submit', async function (event) {
            event.preventDefault();;
            try {
                const formData = new FormData();// Crear un objeto FormData
                console.log('en perfil,submit new formData y tipo:', formData, typeof(formData));// borrar

                formData.append('type', 'user');// Se agrega esta linea para orientar a multer en que tipo de archivo se trabaja, en este caso: user
                formData.append('id_usuarios', document.getElementById('id_usuarios').value);
                formData.append('email', document.getElementById('email').value);
                formData.append('imagen_name', document.getElementById('imagen_name').value);
                //formData.append('password', document.getElementById('editUserPass').value);// No reenviar password, se envia lo que ve el admin
                formData.append('usuario', document.getElementById('usuario').value);
                formData.append('nombre', document.getElementById('nombre').value);
                formData.append('apellido', document.getElementById('apellido').value);
                formData.append('fecha_nacimiento', document.getElementById('fecha_nacimiento').value);
                formData.append('telefono', document.getElementById('telefono').value);
                formData.append('direccion', document.getElementById('direccion').value);
                formData.append('ciudad', document.getElementById('ciudad').value);
                formData.append('provincia', document.getElementById('provincia').value);
                formData.append('pais', document.getElementById('pais').value);
                formData.append('codigo_postal', document.getElementById('codigo_postal').value);
                //formData.append('rol', document.getElementById('rol').value);// No dar posibilidad de cambio a Cliente
                //formData.append('status', document.getElementById('status').value);// No dar posibilidad de cambio a Cliente

            // Desde aqui, se maneja el formData.append del file para new upload y cambios
                const fileInput = document.getElementById('file');
                console.log("en perfil ~ fileInput:", fileInput);// borrar
                if (fileInput.files.length > 0) {
                    const originalFileName = fileInput.files[0].name;// Nombre del archivo subido
                    console.log("en perfil if file 1 ~ originalFileName:", originalFileName);// borrar
                    const filename = `${originalFileName.replace(/ /g, '_')}`;// Remplaza espacios blancos por guion bajo
                    console.log("en perfil if file 2 ~ filename:", filename);// borrar
                    const imagen_name = userData.imagen_name;// Nombre de la ruta actual
                    console.log("en perfil if file 3 ~ imagen_name:", imagen_name);// borrar

                    if (filename !== 'user-anonymous.png') {// Compara el nombre del archivo subido con el nombre del archivo por defecto
                        if (filename === imagen_name) {// Compara el nombre del archivo subido con el nombre del archivo viejo
                            const { isConfirmed, isDenied, isDismissed } = await Swal.fire({
                                title: 'Imagen duplicada',
                                text: 'El nombre de la imagen ya existe. ¿Qué deseas hacer?',
                                icon: 'warning',
                                showCancelButton: true,
                                showDenyButton: true,
                                confirmButtonText: 'Reemplazar existente',
                                denyButtonText: 'Cambiar nombre, agregando la fecha',
                                cancelButtonText: 'Subir otra imagen'
                            });
                
                            if (isConfirmed) {// Reemplazar existente
                                formData.append('file', fileInput.files[0]);
                                formData.append('originalFileName', fileInput.files[0].name);
                            } else if (isDenied) {// Cambiar nombre agregando una marca de tiempo
                                const newFileName = `${filename}_${Date.now()}`;
                                const renamedFile = new File([fileInput.files[0]], newFileName, { type: fileInput.files[0].type });
                                formData.append('file', renamedFile);
                                formData.append('originalFileName', newFileName);
                            } else if (isDismissed) {// Subir otra imagen (no hacer nada y permitir al usuario seleccionar otro archivo)
                                fileInput.value = '';// Limpiar el campo de archivo
                                Swal.fire('Acción cancelada', 'Puedes subir una nueva imagen.', 'info');
                                return;// Salir de la funcion para permitir al usuario subir otro archivo
                            }
                        } else {
                            formData.append('file', fileInput.files[0]);
                            formData.append('originalFileName', fileInput.files[0].name);
                        }                        

                    } else {
                        fileInput.value = ''; // Limpiar el campo de archivo
                            Swal.fire({
                                title: 'Acción cancelada',
                                text: 'Lo siento, no puede usar ese nombre de archivo. Por favor cambie el nombre o suba otra imagen.',
                                icon: 'warning',
                                confirmButtonText: 'Aceptar'
                            });
                            return; // Salir de la función para permitir al usuario subir otro archivo
                    }

                }
                console.log('en users.js entre 7 y 8 dentro de submit desp if formData y tipo:', formData, typeof(formData));// borrar
                console.log('en users.js entre 7 y 8 dentro de submit desp if fileInput y tipo:', fileInput.files[0], typeof(fileInput.files[0]));// borrar
                console.log('en users.js entre 7 y 8 dentro de submit desp if fileInput.feles y tipo:', fileInput.files, typeof(fileInput.files));// borrar
            // Hasta aqui, el manejo el formData.append del file

                    const filteredFormData = new FormData();

                    formData.forEach((value, key) => {
                        if (value !== null && value !== '' && value !== undefined) {
                            filteredFormData.append(key, value);
                        }
                    });
                    console.log('en users.js entre 7 y 8 dentro de submit en forEach formData y tipo:', formData, typeof(formData));// borrar
                    console.log('en users.js entre 7 y 8 dentro de submit en forEach filteredFormData y tipo:', filteredFormData, typeof(filteredFormData));// borrar
                    console.log('en users.js en editUsers PRE 8 despues de filteredFormData muestro cada campo:');//borrar
                    for (let [key, value] of filteredFormData.entries()) {// borrar
                        console.log(`${key}: ${value}`);//borrar
                    }//borrar
                    console.log('en users.js en editUsers PRE 8 despues de filteredFormData FIN MUESTREO');//borrar

                // Envio del formulario al backend
                const response = await fetch(`${usersEndpoint}/customer/update`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: filteredFormData
                });

                console.log('en perfil.js, PUT fetch editResponse, const y tipo: ', response, typeof(response));//borrar
                console.log('en perfil.js, PUT fetch filteredFormData, const y tipo: ', filteredFormData, typeof(filteredFormData));//borrar

                const sessionValid = await sesionTokenError(response); // Función en common.js para manejar cualquier error de token en la respuesta
                if (!sessionValid) return;

                if (!response.ok) {
                    const result = await response.json();// Entra aqui cuando no se puedo actualizar el perfil y lanza el error
                    throw new Error(result.message || 'Error en la respuesta del servidor');
                }
                    
                const result = await response.json();// Parsea la respuesta como JSON si es OK
                
                
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
            
            } catch(error) {
                console.error('Error en el proceso de perfil:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un problema con el perfil',
                    text: 'Inténtelo de nuevo.',
                    confirmButtonText: 'OK'
                });
            };

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

