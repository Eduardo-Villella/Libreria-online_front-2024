// Registro: validate & config

// Valida usuario
const usuario = document.getElementById('usuario');
const errorUsuario = document.getElementById('errorUsuario');
usuario.addEventListener('blur', validateUsuario, { passive: true });// blur metodo para la escucha dinamica al cambiar campo: presenta el error si lo hay. Se agrega { passive: true } como tercer parmetro para prevenir que el navegador detenga el normal flujo

function validateUsuario() {
    const usuarioValue = usuario.value.trim();
    if (usuarioValue.length < 5 || !/^[\wñÑ\s._-]+$/.test(usuarioValue) || /\s{2,}/.test(usuarioValue)) {// Regex (!/^[\wñÑ\s._-]+$/) -regular expresion- su uso es excelente para determinar filtros
        errorUsuario.textContent = 'El nombre de usuario debe tener al menos 5 caracteres, solo puede contener: letras, números, espacio entre caracteres (no dos espacios seguidos), guión bajo, guión medio y/o punto.';
        usuario.classList.add('is-invalid');
        return false;
    } else {
        errorUsuario.textContent = '';// Limpia mensaje de error si es valido
        usuario.classList.remove('is-invalid');
        return true;
    }
}

// Valida email
const email = document.getElementById('email');
const errorEmail = document.getElementById('errorEmail');
email.addEventListener('blur', validateEmail, { passive: true });

function validateEmail() {
    const emailValue = email.value.trim();
    if (!/^[\wñÑ](?:[\wñÑ._-]*[\wñÑ])?@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/.test(emailValue)) {
        errorEmail.textContent = 'El email debe ser válido: contener "@", sin espacios en blanco solo se permiten punto, guión medio, guión bajo y no se permiten dos juntos. Controle la finalzación "puntoAlgo" debe ser válida';
        email.classList.add('is-invalid');
        return false;
    } else {
        errorEmail.textContent = '';
        email.classList.remove('is-invalid');
        return true;
    }
}

// Valida contraseña
const password = document.getElementById('password');
const errorpassword = document.getElementById('errorpassword');
password.addEventListener('blur', validatepassword, { passive: true });

function validatepassword() {
    const passwordValue = password.value.trim();
    if (passwordValue.length < 8) {
        errorpassword.textContent = 'La contraseña debe tener al menos 8 caracteres.';
        password.classList.add('is-invalid');
        return false;
    } else {
        errorpassword.textContent = '';
        password.classList.remove('is-invalid');
        return true;
    }
}

// Valida confirmación de contraseña
const confirmpassword = document.getElementById('confirmpassword');
const errorConfirmpassword = document.getElementById('errorConfirmpassword');
confirmpassword.addEventListener('blur', validateConfirmpassword, { passive: true });

function validateConfirmpassword() {
    const confirmpasswordValue = confirmpassword.value.trim();
    const passwordValue = password.value.trim();
    if (confirmpasswordValue !== passwordValue || confirmpasswordValue === '') {
        errorConfirmpassword.textContent = 'Las contraseñas no coinciden.';
        confirmpassword.classList.add('is-invalid');
        return false;
    } else {
        errorConfirmpassword.textContent = '';
        confirmpassword.classList.remove('is-invalid');
        return true;
    }
}

// Validacion y envio del formulario
document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envio del formulario por defecto

    if (validateUsuario() && validateEmail() && validatepassword() && validateConfirmpassword()) {
        console.log('en pérfil.js: Validaciones de formulario pasadas, solicitando configuración del backend...');

        fetch(`http://localhost:3000/api/config`)
            .then(response => {
                console.log('en pérfil.js: Respuesta recibida del endpoint /api/config:', response);
                if (!response.ok) {
                    throw new Error('en pérfil.js: Error en la respuesta del servidor de configuración');
                }
                return response.json();
            })

            .then(config => {
                console.log('en pérfil.js: Configuración recibida:', config);// BORRAR
                const BACKEND_URL = config.backendUrl;
                console.log('en pérfil.js: Backend URL:', BACKEND_URL);// BORRAR

                // Datos del formulario
                const formData = {
                    usuario: document.getElementById('usuario').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    password: document.getElementById('password').value.trim()// Debe coincidir con lo esperado por el backend, revisar DB
                };
                console.log('en pérfil.js: Datos del formulario:', formData);// BORRAR

                // Envio del formulario al backend
                return fetch(`${BACKEND_URL}/api/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            })
            .then(response => {
                console.log('en perfil.js: Respuesta recibida del endpoint de registro:', response);
                return response.json().then(data => ({
                    status: response.status,
                    body: data
                }));
            })
            .then(data => {
                console.log('Respuesta del backend:', data);
                if (data.body.success) {
                    localStorage.setItem('token', data.body.token);
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario registrado exitosamente',
                        showConfirmButton: true,
                        timer: 30000
                    }).then(() => {
                        window.location.href = 'perfil.html';
                    });

                } else {
                    if (data.body.success === false) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'El email ya está registrado',
                            text: 'Por favor, elija una opción:',
                            allowEscapeKey: true,
                            allowOutsideClick: true,
                            showCancelButton: true,
                            showDenyButton: true,
                            confirmButtonText: 'Ir a login',
                            denyButtonText: 'Probar otro email',
                            cancelButtonText: 'Ir a productos',
                            preConfirm: () => {
                                window.location.href = 'login.html';
                            },
                            preDeny: () => {
                                email.classList.add('is-invalid');
                                errorEmail.textContent = 'Este email ya está registrado. Por favor, ingrese otro email.';
                            }
                        }).then((result) => {
                            console.log('Resultado de dismiss:', result.dismiss);//borrar
                            if (result.dismiss === Swal.DismissReason.esc || result.dismiss === Swal.DismissReason.backdrop) {
                                    window.location.href = 'index.html';
                                    
                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                window.location.href = 'productos.html';
                            }
                        });

                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error en el registro',
                            text: data.body.message,
                            confirmButtonText: 'OK'
                        })
                        
                    }
                }
            })

            .catch(error => {
                console.error('Error en el proceso de registro:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un problema con el registro',
                    text: 'Inténtelo de nuevo.',
                    confirmButtonText: 'OK'
                });
            });

    } else {
        console.log('Validaciones de formulario fallidas');
    }

});

