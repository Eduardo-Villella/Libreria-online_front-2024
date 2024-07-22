// Registro: validate & config

// Valida usuario
const usuario = document.getElementById('usuario');
const errorUsuario = document.getElementById('errorUsuario');
usuario.addEventListener('blur', validateUsuario, { passive: true });// blur metodo para la escucha dinamica al cambiar campo: presenta el error si lo hay. Se agrega { passive: true } como tercer parmetro para prevenir que el navegador detenga el normal flujo

function validateUsuario() {
    const usuarioValue = usuario.value.trim();
    if (usuarioValue.length < 5 || !/^[\wñÑ\s._-]+$/.test(usuarioValue) || /\s{2,}/.test(usuarioValue)) {// Regex (!/^[\wñÑ\s._-]+$/) -regular expresion- su uso es excelente para determinar filtros
        errorUsuario.textContent = 'El nombre de usuario debe tener al menos 5 caracteres';
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
        errorEmail.textContent = 'El email debe ser válido: SI "@ . - _" y NO "espacios blancos" ';
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
const errorPassword = document.getElementById('errorPassword');
password.addEventListener('blur', validatepassword, { passive: true });

function validatepassword() {
    const passwordValue = password.value.trim();
    if (passwordValue.length < 8) {
        errorPassword.textContent = 'La contraseña debe tener al menos 8 caracteres.';
        password.classList.add('is-invalid');
        return false;
    } else {
        errorPassword.textContent = '';
        password.classList.remove('is-invalid');
        return true;
    }
}

// Valida confirmación de contraseña
const confirmPassword = document.getElementById('confirmPassword');
const errorConfirmPassword = document.getElementById('errorConfirmPassword');
confirmPassword.addEventListener('blur', validateConfirmPassword, { passive: true });

function validateConfirmPassword() {
    const confirmPasswordValue = confirmPassword.value.trim();
    const passwordValue = password.value.trim();
    if (confirmPasswordValue !== passwordValue || confirmPasswordValue === '') {
        errorConfirmPassword.textContent = 'Las contraseñas no coinciden.';
        confirmPassword.classList.add('is-invalid');
        return false;
    } else {
        errorConfirmPassword.textContent = '';
        confirmPassword.classList.remove('is-invalid');
        return true;
    }
}

// Validacion y envio del formulario
document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envio del formulario por defecto

    if (validateUsuario() && validateEmail() && validatepassword() && validateConfirmPassword()) {
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
                console.log('en registro.js: Respuesta del backend:', data);// borrar
                if (data.body.success) {
                    localStorage.setItem('token', data.body.token);
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario registrado exitosamente',
                        text: 'Por favor, elija una opción:',
                        allowEscapeKey: true,
                        allowOutsideClick: true,
                        showCancelButton: true,
                        showDenyButton: true,
                        confirmButtonText: 'Completa tu Perfil',
                        denyButtonText: 'Login',
                        cancelButtonText: 'Ver Productos',
                        preConfirm: () => {
                            window.location.href = 'perfil.html';
                        },
                        preDeny: () => {
                            window.location.href = 'login.html';
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

