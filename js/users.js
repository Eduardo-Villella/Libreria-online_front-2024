const baseUrl = 'http://localhost:3000/api';
const usersEndpoint = `${baseUrl}/users/admin`; // Este endpoint sirve tambien para verificar el rol

// Funcion para VER TODOS los usuarios
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const token = localStorage.getItem('token'); // Obtengo el token almacenado en localStorage
        console.log('en users.js, datos del token y tipo de datos', token, typeof(token));//borrar

        if (!token) { // Verifico si el token existe
            Swal.fire({
                icon: 'error',
                title: 'No estás logueado',
                text: 'Por favor, inicia sesión.',
                confirmButtonText: 'OK'
            }).then(() => {
                localStorage.removeItem('token'); // cerrar sesion
                window.location.href = 'login.html'; // Redirijo al login si no hay token
            })
            return;
        }
        
        const headers = new Headers(); // Configuro los headers para la solicitud con el token
        headers.append('Authorization', `Bearer ${token}`);
        
        const usersResponse = await fetch(usersEndpoint, { 
            method: 'GET',
            headers: headers
        });

        const sessionValid = await sesionTokenError(usersResponse);// Funcion en common.js para manejar cualquier error de token en la respuesta
        if (!sessionValid) return;

        console.log('en front users.js: Respuesta al obtener usuarios:', usersResponse); // borrar Log de la respuesta de usuarios

        // Si no hay errores, continua con el codigo
        const data = await usersResponse.json();
        console.log('en front users.js: Datos de los usuarios:', data); //borrar Log de los datos de los usuarios

        const usersTableBody = document.getElementById('usersTableBody'); // Obtengo el cuerpo de la tabla
        usersTableBody.innerHTML = ''; // Limpia cualquier contenido previo
        
        data.result.forEach(user => { // Itera sobre los usuarios y crea las filas de la tabla
            const row = document.createElement('tr');
            // Formatea la fecha de nacimiento
            const fechaNacimientoISO = user.fecha_nacimiento;
            const fechaFormateada = moment(fechaNacimientoISO).format('dddd D [de] MMMM [de] YYYY');
            row.innerHTML = `
                <td>
                    <button class="btn btn-primary btn-sm" data-user-id="${user.id_usuarios}" data-bs-toggle="modal" data-bs-target="#viewUserModal" id="viewAllUsers" onclick="console.log('button viewUser ID:', this.getAttribute('data-user-id'));">
                        <i class="fas fa-eye"></i> Ver
                    </button>

                    <button class="btn btn-warning btn-sm" data-user-id="${user.id_usuarios}" data-bs-toggle="modal" data-bs-target="#editUserModal" id="viewThisUser" onclick="console.log('button editUser ID:', this.getAttribute('data-user-id'));">
                        <i class="fas fa-edit"></i> Editar
                    </button>

                    <button class="btn btn-danger btn-sm" data-user-id="${user.id_usuarios}" id="deleteUser" onclick="console.log('button deleteThisUser ID:', this.getAttribute('data-user-id'));">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </td>
                <td><img src="${baseUrl}/4.Upload/users/${user.imagen_name}" alt="Imagen de ${user.usuario}" style="width: 50px; height: 50px; border-radius: 50%;"></td>
                <td><a href="${user.imagen_name}" target="_blank">${user.imagen_name}</a></td>
                <td>${user.id_usuarios}</td>
                <td>${user.usuario}</td>
                <td>${user.email}</td>
                <td>${'*'.repeat(user.password.length)}</td>
                <td>${user.nombre}</td>
                <td>${user.apellido}</td>
                <td>${fechaFormateada}</td>
                <td>${user.telefono}</td>
                <td>${user.direccion}</td>
                <td>${user.ciudad}</td>
                <td>${user.provincia}</td>
                <td>${user.pais}</td>
                <td>${user.codigo_postal}</td>
                <td>${user.rol}</td>
                <td>${user.status}</td>
            `;
            usersTableBody.appendChild(row);
        });
        
    } catch (error) {
        console.error('en users.js viewAll: Error al verificar el token:', error);//borrar
        Swal.fire({
            icon: 'error',
            title: 'Se ha producido un error',
            text: 'Por favor, intenta de nuevo.',
            confirmButtonText: 'OK'
        }).then(() => {
            localStorage.removeItem('token'); // cerrar sesion
            window.location.href = 'login.html'; // Redirijo al login en caso de error
        });
    }

});

// Funcion para VER un usuario especifico
document.getElementById('viewUserModal').addEventListener('show.bs.modal', async function(event) {
    const button = event.relatedTarget; // Boton que activa el modal
    const userId = button.getAttribute('data-user-id'); // Obtener el id del usuario desde el boton td

    if (userId) {
        console.log('en users.js viewUser if userId: ', userId);// borrar
        try {
            const token = localStorage.getItem('token');
            const headers = new Headers();
            headers.append('Authorization', `Bearer ${token}`);

            const userResponse = await fetch(`${usersEndpoint}/${userId}`, {
                method: 'GET',
                headers: headers 
            });

            const sessionValid = await sesionTokenError(userResponse);// Funcion en common.js para manejar cualquier error de token en la respuesta
            if (!sessionValid) return;

            const data = await userResponse.json();

            console.log('en front users.js viewUser: TIPO de datos del usuarioID:', typeof(data)); //borrar Log de los datos del usuario
            console.log('en front users.js viewUser: Datos del usuarioID:', data); //borrar Log de los datos del usuario
            const user = data[0];
            console.log('en view: viendo user', user); // borrar Log de los datos del usuario

            // Actualiza el DOM con los datos del usuario
                // Comienzo de formateo de fecha y carga de fecha de nacimiento
            moment.locale('es');// Configurar moment para español
            const fechaNacimientoISO = user.fecha_nacimiento;
            const fechaFormateada = moment(fechaNacimientoISO).format('dddd D [de] MMMM [de] YYYY');// Se carga el formato que se mostrara
            document.getElementById('viewUserDate').innerText = fechaFormateada;// Se toma el valor de la constante formateada anteriormente con moment
                // Finaliza el formateo de fecha y carga de fecha de nacimiento
            // Continua la carga de otros campos
            document.getElementById('viewUserImage').innerHTML = `<img src="${baseUrl}/4.Upload/users/${user.imagen_name}" alt="User Image" style="max-width: 100px; max-height: 100px;">`;
            document.getElementById('viewUserLink').innerText = user.imagen_name;
            document.getElementById('viewUserID').innerText = user.id_usuarios;
            document.getElementById('viewUserUser').innerText = user.usuario;
            document.getElementById('viewUserEmail').innerText = user.email;
            document.getElementById('viewUserPass').innerText = '*'.repeat(user.password.length);// Cambiar por user.password si se desea ver la contraseña hasheada
            document.getElementById('viewUserNombre').innerText = user.nombre;
            document.getElementById('viewUserUserName').innerText = user.apellido;
            document.getElementById('viewUserTelephone').innerText = user.telefono;
            document.getElementById('viewUserAndrew').innerText = user.direccion;
            document.getElementById('viewUserCity').innerText = user.ciudad;
            document.getElementById('viewUserProvince').innerText = user.provincia;
            document.getElementById('viewUserCountry').innerText = user.pais;
            document.getElementById('viewUserPostalCode').innerText = user.codigo_postal;
            document.getElementById('viewUserRol').innerText = user.rol;
            document.getElementById('viewUserStatus').innerText = user.status;

        } catch (error) {
            console.error('en front users.js view catch: Error al visualizar el usuario:', error);
            alert('en front users.js viewUser CATCH: Se ha producido un error al intentar obtener la información del usuario.');
        }
    }

});

/* -- FUNCIONES EDITAR Y CREAR USUUARIOS -- */
/* -- AGREGAN EVENLISTENER de las funciones de validacion en common.js a todas las funciones de users.js -- */
/* blur metodo para la escucha dinamica al cambiar campo: presenta el error si lo hay. Se agrega { passive: true } como tercer parmetro para prevenir que el navegador detenga el normal flujo */
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('editUserUser').addEventListener('blur', (event) => validateUsuario(event), { passive: true });
    
// Funcion para EDITAR/ACTUALIZAR un usuario
    document.getElementById('editUserModal').addEventListener('show.bs.modal', async function(event) {
        const button = event.relatedTarget; // Botón que activa el modal
        console.log('en user.js, editUser 1, const button y tipo: ', button, typeof(button));//borrar
        const userId = button.getAttribute('data-user-id'); // Obtener el ID del usuario
        console.log('en user.js, editUser 2, const userId y tipo: ', userId, typeof(userId));//borrar

        if (userId) {
            try {
                const token = localStorage.getItem('token');
                console.log('en user.js, editUser 3 if userId, const token y tipo: ', token, typeof(token));//borrar
                const headers = new Headers();
                headers.append('Authorization', `Bearer ${token}`);

                console.log('en user.js, editUser 3/4 try token, usersEndpoint: ', usersEndpoint, typeof(usersEndpoint));//borrar
                console.log('en user.js, editUser 3/4 try token, userId: ', userId, typeof(userId));//borrar
                const userResponse = await fetch(`${usersEndpoint}/${userId}`, {
                    method: 'GET',
                    headers: headers 
                });

                const sessionValid = await sesionTokenError(userResponse);// Funcion en common.js para manejar cualquier error de token en la respuesta
                if (!sessionValid) return;

                console.log('en user.js, editUser 4 userResponse, const y tipo: ', userResponse, typeof(userResponse));//borrar

                const data = await userResponse.json();
                const user = data[0];
                console.log('en user.js, editUser 6 data, const y tipo: ', data, typeof(data));//borrar
                console.log('en user.js, editUser 7 user, const y tipo: ', user, typeof(user));//borrar

                // Rellena el formulario de edición con los datos del usuario
                document.getElementById('currentUserImage').src = `${baseUrl}/4.Upload/users/${user.imagen_name}`;
                        document.getElementById('currentUserImage').alt = "User Image";
                        document.getElementById('currentUserImage').style.maxWidth = "100px";
                        document.getElementById('currentUserImage').style.maxHeight = "100px";
                document.getElementById('editUserLink').value = user.imagen_name;
                document.getElementById('editUserID').value = user.id_usuarios;
                document.getElementById('editUserUser').value = user.usuario;
                document.getElementById('editUserEmail').value = user.email;
                document.getElementById('editUserPassword').value = user.password; // cambiar por: '*'.repeat(user.password.length); sino quiere mostrar
                document.getElementById('editUserNombre').value = user.nombre;
                document.getElementById('editUserApellido').value = user.apellido;
                        const fechaNacimientoISO = user.fecha_nacimiento;
                        const fechaFormateada = moment(fechaNacimientoISO).format('dddd D [de] MMMM [de] YYYY');// Se carga el formato que se mostrara
                document.getElementById('editUserFechaNacimiento').value = fechaFormateada;
                document.getElementById('editUserTelefono').value = user.telefono;
                document.getElementById('editUserDireccion').value = user.direccion;
                document.getElementById('editUserCiudad').value = user.ciudad;
                document.getElementById('editUserProvincia').value = user.provincia;
                document.getElementById('editUserPais').value = user.pais;
                document.getElementById('editUserCodigoPostal').value = user.codigo_postal;
                document.getElementById('editUserRol').value = user.rol;
                document.getElementById('editUserStatus').value = user.status;

                // Inicializa Pikaday para formatear la fecha en español // No fue necesario al usar moment locale (es)
                //formatDatePika('viewUserDate'); // Reutiliza la función desde common.js

                // Maneja el envio del formulario
                document.getElementById('editUserForm').addEventListener('submit', async (e) => {
                    e.preventDefault();

                    const isUsuarioValid = validateUsuario({ target: document.getElementById('editUserUser') });
                    if (isUsuarioValid) {
                            console.log('en pérfil.js: Validaciones de formulario pasadas, solicitando configuración del backend...');

                        const formData = new FormData();// Crear un objeto FormData
                        console.log('en users.js entre 7 y 8 dentro de submit en new formData y tipo:', formData, typeof(formData));// borrar

                        formData.append('type', 'user');// Se agrega esta linea para orientar a multer en que tipo de archivo se trabaja, en este caso: user
                    // Desde aqui, se maneja el formData.append del file
                        const fileInput = document.getElementById('editUserFile');
                        if (fileInput.files.length > 0) {
                            const originalFileName = fileInput.files[0].name;// Nombre del archivo subido
                            const filename = `${originalFileName.replace(/ /g, '_')}`;// Remplaza espacios blancos por guion bajo
                            const imagen_name = user.imagen_name;// Nombre de la ruta actual

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
                        //formData.append('imagen_name', document.getElementById('editUserLink').value);// no reenviar para permitir guardar nuevo link
                        formData.append('id_usuarios', document.getElementById('editUserID').value);
                        formData.append('email', document.getElementById('editUserEmail').value);
                        //formData.append('password', document.getElementById('editUserPass').value);// No reenviar password, se envia lo que ve el admin
                        formData.append('usuario', document.getElementById('editUserUser').value);
                        formData.append('nombre', document.getElementById('editUserNombre').value);
                        formData.append('apellido', document.getElementById('editUserApellido').value);
                        formData.append('fecha_nacimiento', document.getElementById('editUserFechaNacimiento').value);
                        formData.append('telefono', document.getElementById('editUserTelefono').value);
                        formData.append('direccion', document.getElementById('editUserDireccion').value);
                        formData.append('ciudad', document.getElementById('editUserCiudad').value);
                        formData.append('provincia', document.getElementById('editUserProvincia').value);
                        formData.append('pais', document.getElementById('editUserPais').value);
                        formData.append('codigo_postal', document.getElementById('editUserCodigoPostal').value);
                        formData.append('rol', document.getElementById('editUserRol').value);
                        formData.append('status', document.getElementById('editUserStatus').value);

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

                        try {
                            const token = localStorage.getItem('token');
                                // Imprime la URL que se usará en la solicitud
                                console.log('en user.js, editUser 8.1 URL de la solicitud: ', `${usersEndpoint}/${userId}`, typeof(`${usersEndpoint}/${userId}`));
                                
                                // Imprime el método de la solicitud
                                console.log('en user.js, editUser 8.1 Método de la solicitud: ', 'PUT', typeof('PUT'));
                                
                                // Imprime el token para asegurarte de que está presente
                                console.log('en user.js, editUser 8.1 Token: ', token, typeof(token));
                                
                                // Imprime las cabeceras de la solicitud
                                const headers = {
                                    'Authorization': `Bearer ${token}`
                                };
                                console.log('en user.js, editUser 8.1 Cabeceras: ', headers, typeof(headers));

                                // Imprime el contenido de filteredFormData
                                console.log('en user.js, editUser 8.1 Cuerpo de la solicitud (filteredFormData):');
                                for (let [key, value] of filteredFormData.entries()) {
                                    console.log(`${key}: ${value}`);
                                }

                            const editResponse = await fetch(`${usersEndpoint}/${userId}`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                },
                                body: filteredFormData // Enviar el filteredFormData en lugar de: JSON.stringify(filteredDataToUpdate)
                            });
                            console.log('en user.js, editUser 9 try fetch editResponse, const y tipo: ', editResponse, typeof(editResponse));//borrar
                            console.log('en user.js, editUser 10 try fetch filteredFormData, const y tipo: ', filteredFormData, typeof(filteredFormData));//borrar

                            const sessionValid = await sesionTokenError(editResponse);// Funcion en common.js para manejar cualquier error de token en la respuesta
                            if (!sessionValid) return;
                            
                            alert('Usuario editado correctamente.');
                            const editUserModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
                            editUserModal.hide();
                            location.reload(); // Recarga la página para ver los cambios
                    
                        } catch (error) {
                            console.error('primer catch Error al editar el usuario:', error);
                            alert('primer catch Se ha producido un error al intentar editar el usuario.');
                        }
                        
                    } else {
                        console.log('Validaciones de formulario fallidas');
                    }
                });
                
            } catch (error) {
                console.error('ultimo catch Error al editar el usuario:', error);
                alert('ultimo catch Se ha producido un error al intentar obtener la información del usuario.');
            }
        }

    });

// Funcion para CREAR un usuario nuevo
    // Inicializa el modal
    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
    // Controla la "X" de cerrar modal usando el ID del botón
    const closeModalButton = document.getElementById('closeAddUserModal');
    closeModalButton.addEventListener('click', function() {
        document.getElementById('addUserForm').reset();// Resetea el formulario
        modal.hide();// Cierra el modal manualmente
        location.reload();// Actualiza la página
    });

    document.querySelector('.btn-success').addEventListener('click', async () => {
        const token = localStorage.getItem('token');// Obtiene el token desde localStorage
        const sessionValid = await sesionTokenError({ ok: token !== null });// Verifica la sesion antes de intentar abrir el modal

        if (!sessionValid) {// Detiene el proceso de abrir el modal si la sesion no es valida
            return;
        }

        modal.show();

        document.getElementById('addUserUser').addEventListener('blur',  (event) => validateUsuario(event), { passive: true });
            console.log('Asignando validación para el campo usuario:', document.getElementById('addUserUser').id);
        document.getElementById('addUserEmail').addEventListener('blur', (event) => validateEmail(event), { passive: true });
            console.log('Asignando validación para el campo email:', document.getElementById('addUserEmail').id);
        document.getElementById('password').addEventListener('blur', (event) => validatePassword(event), { passive: true });
        document.getElementById('confirmPassword').addEventListener('blur', (event) => validateConfirmPassword(event), { passive: true });

        const addUserForm = document.getElementById('addUserForm');// Registra el evento submit cuando el modal se abre
        // Verifica si ya existe un evento asociado para evitar duplicados
        if (!addUserForm.dataset.listenerAdded) {
            addUserForm.dataset.listenerAdded = true;
            
            addUserForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Pasamos el evento a cada funcion de validacion
                const isUsuarioValid = validateUsuario({ target: document.getElementById('addUserUser') });
                const isEmailValid = validateEmail({ target: document.getElementById('addUserEmail') });
                const isPasswordValid = validatePassword({ target: document.getElementById('password') });
                const isConfirmPasswordValid = validateConfirmPassword({ target: document.getElementById('confirmPassword') });

                if (isUsuarioValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
                    console.log('en pérfil.js: Validaciones de formulario pasadas, solicitando configuración del backend...');

                    try {
                        const sessionValid = await sesionTokenError({ ok: token !== null });// Verificar nuevamente la sesion antes de enviar el formulario
                        if (!sessionValid) return;

                        // Construyo datos para el envio en formData
                        const formData = new FormData();
                        // Agrego campo type que no esta en formulario
                        formData.append('type', 'user'); // Orienta a multer en el backend sobre el tipo de dato que usara para definir el link
                        // Obtiene los datos del formulario
                        formData.append('usuario', document.getElementById('addUserUser').value);
                        formData.append('email', document.getElementById('addUserEmail').value);
                        formData.append('password', document.getElementById('password').value);
                        formData.append('nombre', document.getElementById('addUserNombre').value);
                        formData.append('apellido', document.getElementById('addUserApellido').value);
                        formData.append('fecha_nacimiento', document.getElementById('addUserFechaNacimiento').value);
                        formData.append('telefono', document.getElementById('addUserTelefono').value);
                        formData.append('direccion', document.getElementById('addUserDireccion').value);
                        formData.append('ciudad', document.getElementById('addUserCiudad').value);
                        formData.append('provincia', document.getElementById('addUserProvincia').value);
                        formData.append('pais', document.getElementById('addUserPais').value);
                        formData.append('codigo_postal', document.getElementById('addUserCodigoPostal').value);
                        formData.append('rol', document.getElementById('addUserRol').value);
                        formData.append('status', document.getElementById('addUserStatus').value);
                        // Obtiene el archivo seleccionado
                        const fileInput = document.getElementById('addUserImage');
                        if (fileInput.files.length > 0) {
                            const originalFileName = fileInput.files[0].name;
                            const filename = `${originalFileName.replace(/ /g, '_')}`;

                            formData.append('file', fileInput.files[0]);
                            formData.append('originalFileName', filename);
                        }
                        console.log('en addUser desp if fileInput y tipo:', fileInput.files[0], typeof(fileInput.files[0]));// borrar
                        console.log('en addUser desp if fileInput.files y tipo:', fileInput.files, typeof(fileInput.files));// borrar
                        
                        console.log('ANTES de for x uni formData y tipo: ',formData, typeof(formData)); // borrar
                        for (let pair of formData.entries()) {// borrar
                            console.log('ANTES de filtro formData',pair[0], pair[1]); 
                        }

                        // Filtra datos vacios antes de enviar
                        const filteredFormData = new FormData();
                        formData.forEach((value, key) => {
                            if (value !== null && value !== '' && value !== undefined) {
                                filteredFormData.append(key, value);
                            }
                        });

                        console.log('DESPUES de filtro formData y tipo: ',formData, typeof(formData));// borrar
                        console.log('en addUser PRE 8 despues de filteredFormData muestro cada campo:');//borrar
                                for (let [key, value] of filteredFormData.entries()) {// borrar
                                    console.log(`${key}: ${value}`);//borrar
                                }//borrar
                                console.log('en adduser PRE 8 despues de filteredFormData FIN MUESTREO');//borrar

                        console.log('ANTES de for x uni filteredFormData y tipo: ',filteredFormData, typeof(filteredFormData));// borrar
                        for (let pair of filteredFormData.entries()) {// borrar
                            console.log('ANTES de fetch filteredFormData ',pair[0], pair[1]); 
                        }

                        // Imprime la URL que se usará en la solicitud
                        console.log('en A user.js, editUser 8.1 URL de la solicitud: ', `${usersEndpoint}`, typeof(`${usersEndpoint}`));
                                                
                        // Imprime el método de la solicitud
                        console.log('en A user.js, editUser 8.1 Método de la solicitud: ', 'POST', typeof('POST'));

                        // Imprime el contenido de filteredFormData
                        console.log('en A user.js, editUser 8.1 Cuerpo de la solicitud (filteredFormData):');
                        for (let [key, value] of filteredFormData.entries()) {
                            console.log(`${key}: ${value}`);
                        }

                        const response = await fetch(`${usersEndpoint}`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            body: filteredFormData // Enviar el filteredFormData en lugar de: JSON.stringify(filteredDataToUpdate)
                        });

                        console.log('DESPUES de fetch response y tipo: ',response, typeof(response));// borrar

                        if (!response.ok) {
                            const errorMessage = await response.text();
                            console.error('Error al crear el usuario:', errorMessage);
                            Swal.fire({
                                title: "Error",
                                text: "Ha ocurrido un error al crear el usuario: " + errorMessage,
                                icon: "error"
                            });
                            return;
                        }
                        
                        Swal.fire({
                            title: "Usuario creado",
                            text: "El usuario ha sido guardado correctamente.",
                            icon: "success"
                        }).then(() => {
                            e.target.reset();// Resetea el formulario
                            modal.hide();// new bootstrap.Modal(document.getElementById('addUserModal')).hide();// Cierra el modal
                            location.reload();// Actualiza la pagina
                        });

                    } catch (error) {
                        console.error('Error en el proceso de creación del usuario:', error);
                        Swal.fire({
                            title: "Error",
                            text: "Se ha producido un error inesperado.",
                            icon: "error"
                        });

                    }

                } else {
                    console.log('Validaciones de formulario fallidas');
                }
            });
        }

    });

});

// Funcion para ELIMINAR/DESACTIVAR un usuario
document.getElementById('usersTableBody').addEventListener('click', async function (event) {
    if (event.target.matches('[id^="deleteUser"]')) {
        const button = event.target;// Identifica el boton que activa el mensaje sweetalert
        const userId = parseInt(button.getAttribute('data-user-id'), 10);// Obtener el id del usuario desde el boton td y convertirlo a numero
        console.log('en users.js deleteUser userId y tipo de dato: ', userId, typeof(userId))//borrar

        try {
            const token = localStorage.getItem('token'); // Obtengo el token almacenado en localStorage
            
            if (!token) { // Verifico si el token existe
                const sessionValid = await sesionTokenError(token);// Funcion en common.js para manejar cualquier error de token en la respuesta
                if (!sessionValid) return;
            }

            if (userId) {
                console.log('en users.js deleteUser if userId: ', userId);// borrar

                Swal.fire({
                    icon: 'warning',
                    title: 'Esta por eliminar un usuario.',
                    text: 'Por favor, elija una opción:',
                    allowEscapeKey: true,
                    allowOutsideClick: true,
                    showConfirmButton: false,// Oculta el boton Confirm
                    //confirmButtonText: 'Desactivar',// Saco para usar boton html desactivar
                    showDenyButton: false,// Oculta el boton Deny
                    //denyButtonText: 'Eliminar',// Saco para usar boton html eliminar
                    showCancelButton: false,// Oculta el boton Cancel
                    //cancelButtonText: 'Cancelar',
                    html: `
                        <button class="btn btn-primary btn-sm" id="softDeleteButton">
                            <i class="fas fa-user-slash"></i> Desactivar
                        </button>
                        <button class="btn btn-danger btn-sm" id="deleteButton">
                            <i class="fas fa-trash-alt"></i> Eliminar
                        </button>
                        <button class="btn btn-success btn-sm" id="cancelButton">
                            <i class="fas fa-door-closed"></i> Cancelar
                        </button>
                        `,// Boton Confirm = softDelete, Boton Deny = delete, Boton Cancel = cancel

                    didOpen: async () => {// Para usar boton html en lugar de boton swal2
                        const softDeleteButton = document.getElementById('softDeleteButton');
                        const deleteButton = document.getElementById('deleteButton');
                        const cancelButton = document.getElementById('cancelButton');

                        if (softDeleteButton) {
                            softDeleteButton.addEventListener('click', async () => {
                                const updatedUser = { status: 'inactivo' };// Define el estado directamente, no lo toma de input ni value
                            
                                const filteredDataToUpdate = Object.fromEntries(// Filtra datos vacios
                                    Object.entries(updatedUser).filter(([_, value]) => value !== "" && value !== undefined && value !== null)
                                );

                                const editResponse = await fetch(`${usersEndpoint}/general/${userId}`, {// Realiza el envio de actualizacion de campo
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify(filteredDataToUpdate)
                                });

                                const sessionValid = await sesionTokenError(editResponse);// Funcion en common.js para manejar cualquier error de token en la respuesta
                                if (!sessionValid) return;

                                if (!editResponse.ok) {
                                    const errorMessage = await editResponse.text();
                                    console.error('Error al editar el usuario:', errorMessage);
                                    Swal.fire({
                                        icon: 'warning',
                                        title: 'No se pudo editar el usuario.',
                                        showConfirmButton: true,

                                        preConfirm: () => {
                                            location.reload(); // Recarga la pagina
                                        }
                                    });
                                }

                                Swal.fire({
                                    icon: 'success',
                                    title: 'Usuario Desactivado correctamente.',
                                    showConfirmButton: true,

                                    preConfirm: () => {
                                        location.reload(); // Recarga la pagina
                                    }
                                });

                            });

                        }

                        if (deleteButton) {
                            deleteButton.addEventListener('click', async () => {

                                const password = await Swal.fire({
                                    icon: 'warning',
                                    title: 'Esta por eliminar un usuario de forma permanente, esta acción no se puede deshacer. ¿Está seguro de continuar?',
                                    allowEscapeKey: true,
                                    allowOutsideClick: true,
                                    allowEscapeKey: true,
                                    showConfirmButton: false,// Oculta el boton Confirm
                                    text: 'Por favor, ingrese su contraseña:',
                                    html: ` <form id="swal2-form"><input id="swal2-input-password" class="swal2-input" placeholder="contraseña" type="password" autocomplete="new-password" /></form>
                                            <br>
                                            <button class="btn btn-danger" id="removeButton">
                                                <i class="fas fa-trash-alt"></i> Eliminar
                                            </button>
                                            <button class="btn btn-success" id="leaveButton">
                                                <i class="fas fa-door-closed"></i> Salir
                                            </button>`,

                                    didOpen: async () => {// Para usar boton html remove y leave en lugar de Confirm y cancel de swal2
                                        const removeButton = document.getElementById('removeButton');
                                        const leaveButton = document.getElementById('leaveButton');
                                        console.log('en user.js deleteUser entra el didOpen2');//borrar

                                        if (leaveButton) {// Ejecuta segundo boton cancelar donde esta el input password
                                            leaveButton.addEventListener('click', async () => {
                                                location.reload();
                                            });
                                        } 

                                        if (removeButton) {
                                            removeButton.addEventListener('click', async () => {
                                                //const email = document.getElementById('swal2-input-email').value; // Obtiene el valor del email
                                                const password = document.getElementById('swal2-input-password').value; // Obtiene el valor de la contraseña
                                                //console.log('en user.js delete user didopen 2 email y paswoord del input y tipo: ', email, password, typeof(email), typeof(password));// borrar
                                                console.log('en user.js delete user didopen 2 paswoord del input y tipo: ', password, typeof(password));// borrar
                                                if (!password) {// Si no se ingresa email o no se ingresa contraseña, salir
                                                    return Swal.showValidationMessage('Por favor, ingrese su contraseña.');
                                                } 
                                                Swal.close(); // Cierra el modal para que se pueda manejar la contraseña

                                                const validate = {password: password};
                                                console.log('en usersEndpoint, deleteUser, en remove  validate y tipo: ', validate, typeof(validate));//borrar

                                                const isAdminResponse = await fetch(`${usersEndpoint}/validate`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${token}`
                                                    },
                                                    body: JSON.stringify(validate)
                                                });

                                                const sessionValid = await sesionTokenError(isAdminResponse);// Funcion en common.js para manejar cualquier error de token en la respuesta
                                                if (!sessionValid) return;

                                                const isAdmin = await isAdminResponse.json(); // Obtengo el valor de la respuesta
                                                console.log('en usersEndpoint, deleteUser, remove isAdmin y tipo: ', isAdmin, typeof(isAdmin));//borrar
                                            
                                                if (isAdmin.responseData.success === false) {
                                                    Swal.fire('Usted no tiene permisos para ejecutar esta acción', '', 'error');
                                                    //localStorage.removeItem('token');//cerrar sesion
                                                    setTimeout(() => {
                                                        //window.location.href = 'index.html';
                                                    }, 67000);
                                                    return;
                                                }

                                                if (isAdmin.responseData.success === true) {
                                                    console.log('Procediendo a eliminar al usuario con ID:', userId);
                                                    const deleteResponse = await fetch(`${usersEndpoint}/${userId}`, {
                                                        method: 'DELETE',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'Authorization': `Bearer ${token}`
                                                        }
                                                    });
                                                    const sessionValid = await sesionTokenError(deleteResponse);// Funcion en common.js para manejar cualquier error de token en la respuesta
                                                    if (!sessionValid) return;
                                                    Swal.fire({
                                                        icon: 'success',
                                                        title: 'Usuario Eliminado definitivamente.',
                                                        showConfirmButton: true,
                    
                                                        preConfirm: () => {
                                                            location.reload(); // Recarga la pagina
                                                        }
                                                    });

                                                } else {
                                                    Swal.fire('Acción no permitida.');
                                                }
                                            });
                                        }

                                    }

                                }).then((result) => {
                                    console.log('Resultado de dismiss 1:', result.dismiss);//borrar
                                    if (result.dismiss === Swal.DismissReason.esc || result.dismiss === Swal.DismissReason.backdrop) {
                                        window.location.href = 'admin_users.html';
                                                
                                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                                        window.location.href = 'admin_users.html';
                                    }
                    
                                });

                            });
                        }

                        if (cancelButton) {// Para usar boton html cancel en lugar de cancel swal2
                            cancelButton.addEventListener('click', async () => {
                                location.reload();
                            });
                        } 

                    },

                }).then((result) => {
                    console.log('Resultado de dismiss 2:', result.dismiss);//borrar
                    if (result.dismiss === Swal.DismissReason.esc || result.dismiss === Swal.DismissReason.backdrop) {// Si se presiona Esc o clickea fuera del swal2
                        window.location.href = 'admin_users.html';
                                
                    } else if (result.dismiss === Swal.DismissReason.cancel) {// Si se presiona Cancel en swal2
                        window.location.href = 'admin_users.html';
                    }

                });

            }

        } catch {
            console.error(error);
            Swal.fire('Error', 'Hubo un problema al procesar la solicitud', 'error')
        }

    }
    
});

