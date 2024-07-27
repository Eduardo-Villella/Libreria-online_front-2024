// Login: validate & config

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
};

// Valida contraseña
const password = document.getElementById('password');
const errorPassword = document.getElementById('errorPassword');
password.addEventListener('blur', validatePassword, { passive: true });

function validatePassword() {
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
};

/* ------------------------------------------------------------------------------- */

// Validacion y envio del formulario
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envio del formulario por defecto

    if (validateEmail() && validatePassword()) {
        console.log('Validaciones de formulario pasadas, solicitando configuración del backend...');

        fetch(`http://localhost:3000/api/config`)
            .then(response => {
                console.log('login.js: Respuesta recibida del endpoint /api/config:', response);
                if (!response.ok) {
                    throw new Error('login.js: Error en la respuesta del servidor de configuración');
                }
                return response.json();
            })

            .then(config => {
                console.log('en login.js: Configuración recibida:', config);// BORRAR
                const BACKEND_URL = config.backendUrl;
                console.log('en login.js: Backend URL:', BACKEND_URL);// BORRAR

                // Datos del formulario
                const formData = {
                    email: document.getElementById('email').value.trim(),
                    password: document.getElementById('password').value.trim()// Debe coincidir con lo esperado por el backend, revisar DB
                };
                console.log('en login.js: Datos del formulario enviados al backend:', formData);// BORRAR

                // Envio del formulario al backend
                return fetch(`${BACKEND_URL}/api/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            })
            .then(response => {
                console.log('en login.js: Respuesta recibida del endpoint de login:', response);
                return response.json().then(data => ({
                    status: response.status,
                    body: data
                }));
            })
            .then(data => {
                console.log('en login.js: Respuesta del backend en front:', data);// BORRAR una vez comprobado
                if (data.body.success) {
                    localStorage.setItem('token', data.body.token);
                    if (data.body.isAdmin) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Bienvenido Administrador!',
                            text: 'Por favor, elija una opción:',
                            allowEscapeKey: true,
                            allowOutsideClick: true,
                            showCancelButton: true,
                            showDenyButton: true,
                            confirmButtonText: 'Ir a Administracion',
                            denyButtonText: 'Salir',
                            cancelButtonText: 'Ver catalogo',
                            preConfirm: () => {
                                window.location.href = 'admin_dashboard.html';
                            },
                            preDeny: () => {
                                logout(); // Ejecuta la funcion logout de common.js 
                                return false;
                            }
    
                        }).then((result) => {
                            console.log('Resultado de dismiss:', result.dismiss);//borrar
                            if (result.dismiss === Swal.DismissReason.esc || result.dismiss === Swal.DismissReason.backdrop) {
                                logout();
                                return false;
                                    
                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                window.location.href = 'catalogo.html';
                            }
    
                        });
                       
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Bienvenido!',
                            text: 'Por favor, elija una opción:',
                            allowEscapeKey: true,
                            allowOutsideClick: true,
                            showCancelButton: true,
                            showDenyButton: true,
                            confirmButtonText: 'Ir a Mi Perfil',
                            denyButtonText: 'Salir',
                            cancelButtonText: 'Ver catalogo',
                            preConfirm: () => {
                                window.location.href = 'perfil.html';
                            },
                            preDeny: () => {
                                window.location.href = 'index.html';
                            }

                        }).then((result) => {
                            console.log('Resultado de dismiss:', result.dismiss);//borrar
                            if (result.dismiss === Swal.DismissReason.esc || result.dismiss === Swal.DismissReason.backdrop) {
                                window.location.href = 'index.html';
                                
                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                window.location.href = 'catalogo.html';
                            }

                        });

                    }

                } else if (data.body.error_code === 101) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'El email no está registrado',
                        text: 'Por favor, elija una opción:',
                        allowEscapeKey: true,
                        allowOutsideClick: true,
                        showCancelButton: true,
                        showDenyButton: true,
                        confirmButtonText: 'Registrarse',
                        denyButtonText: 'Probar otro email',
                        cancelButtonText: 'Salir',
                        preConfirm: () => {
                            window.location.href = 'registro.html';
                        },
                        preDeny: () => {
                            email.classList.add('is-invalid');
                            errorEmail.textContent = 'Este email no está registrado. Por favor, ingrese otro email.';
                        }

                    }).then((result) => {
                        console.log('Resultado de dismiss:', result.dismiss);//borrar
                        if (result.dismiss === Swal.DismissReason.esc || result.dismiss === Swal.DismissReason.backdrop) {
                            window.location.href = 'index.html';
                                    
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            window.location.href = 'catalogo.html';
                        }

                    });

                } else if (data.body.error_code === 102) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Usuario o contraseña incorrecto',
                        text: 'Por favor, elija una opción:',
                        allowEscapeKey: true,
                        allowOutsideClick: true,
                        showCancelButton: true,
                        showDenyButton: true,
                        confirmButtonText: 'Recuperar contraseña',
                        denyButtonText: 'Reintentar',
                        cancelButtonText: 'Salir',
                        preConfirm: () => {
                            window.location.href = 'nosotros.html';
                        },
                        preDeny: () => {
                            password.classList.add('is-invalid');
                            errorPassword.textContent = 'Verifique su contraseña. Por favor, inténtelo de nuevo.';
                        }
    
                    }).then((result) => {
                        console.log('Resultado de dismiss:', result.dismiss);//borrar
                        if (result.dismiss === Swal.DismissReason.esc || result.dismiss === Swal.DismissReason.backdrop) {
                            window.location.href = 'index.html';
                                        
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            window.location.href = 'catalogo.html';
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
                
            })
        
            .catch(error => {
                console.error('en login.js: Error en el proceso de login:', error);
                alert('en login.js: Hubo un problema con el login. Inténtelo de nuevo.');
            });

    } else {
        console.log('en login.js: Validaciones de formulario fallidas');// Aqui mostrar error que empieza en validator.js pasa a controller y lo dispara al front en .json
    }

    
});

