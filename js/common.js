/* Archivo de funciones y script comunes a todos los html : */
    // logout
    // icono ojo contraseña
    // icono perfil usuario
    // sidebar administracion
    // validacion de email y contraseña
    // recuperar contraseña

/* ------------------------------------------------------------------------------------------- */

// Funcion para logout: elimina token del localStorage y redirige
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}
document.addEventListener('DOMContentLoaded', function() {
    let logoutLink = document.getElementById('logoutButton');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault(); // Evita que el enlace redirija antes
            logout();
        });
    }
});

/* ------------------------------------------------------------------------------------------- */

// Funcion para alternar mostrar u ocultar contraseña y confirmacion de contraseña
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordIcon = document.getElementById('passwordIcon');
    const confirmPasswordIcon = document.getElementById('confirmPasswordIcon');

    function togglePasswordVisibility() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordIcon.classList.remove('fa-eye');
            passwordIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            passwordIcon.classList.remove('fa-eye-slash');
            passwordIcon.classList.add('fa-eye');
        }
    }

    function toggleConfirmPasswordVisibility() {
        if (confirmPasswordInput && confirmPasswordInput.type === 'password') {
            confirmPasswordInput.type = 'text';
            confirmPasswordIcon.classList.remove('fa-eye');
            confirmPasswordIcon.classList.add('fa-eye-slash');
        } else if (confirmPasswordInput) {
            confirmPasswordInput.type = 'password';
            confirmPasswordIcon.classList.remove('fa-eye-slash');
            confirmPasswordIcon.classList.add('fa-eye');
        }
    }

    if (togglePassword && passwordIcon) {
        togglePassword.addEventListener('click', togglePasswordVisibility);
    }

    if (toggleConfirmPassword && confirmPasswordInput && confirmPasswordIcon) {
        toggleConfirmPassword.addEventListener('click', toggleConfirmPasswordVisibility);
    }
});

/* ------------------------------------------------------------------------------------------- */

// Funcion para manejar icono perfil usuario
document.addEventListener('DOMContentLoaded', async function () {
    const perfilPic = document.getElementById('perfilPic');
    const perfilHoverMessage = document.getElementById('perfilHoverMessage');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    const baseUrl = 'http://localhost:3000/api';
    const isLoggedIn = localStorage.getItem('token');// Verifica si el usuario esta logueado

    if (isLoggedIn) {
        // Realizamos una solicitud para obtener la informacion del usuario
        const response = await fetch('http://localhost:3000/api/users/perfil', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${isLoggedIn}` // Enviar el token en la cabecera
            }
        })
        
        if (!response.ok) {
            //const errorMessage = await response.text();
            //console.error('en common.js, !token: Error al obtener el usuario:', errorMessage);
            //alert('No se pudo obtener la información del usuario.');
            if (response.status === 401) {
                localStorage.removeItem('token');// Elimina el token invalido del almacenamiento local
               Swal.fire({
                    icon: 'warning',
                    title: 'Sesión caducada',
                    text: 'Tu sesión ha caducado. Por favor, inicia sesión nuevamente.',
                    confirmButtonText: 'Iniciar sesión'
                }).then(() => {
                    window.location.href = 'login.html';
                });
                throw new Error(`Error: ${response.statusText}`);
            }
        
            //return; // Salimos si hay un error
        }

        const data = await response.json();// Devuelve la respuesta como un objeto JSON
            console.log('en common primer then if response y tipo: :', response, typeof(response)); //borrar Log de los datos del usuario
            console.log('en common primer then if data y tipo: :', data, typeof(data)); //borrar Log de los datos del usuario
        const user = data[0];// Tomamos de la respuesta objeto el elemento 0 correspondiente al  array de datos usuario
            console.log('en common primer then if user y tipo: :', user, typeof(user)); //borrar Log de los datos del usuario
        
        // Mostrar imagen de perfil del usuario
        perfilPic.src = `${baseUrl}/${user.imagen_link}`; // '../image/user_icons8-usuario-de-género-neutro.gif'; // Cambia por la foto del perfil del usuario (a futuro, por ahora cambia a gif)
            console.log('Base URL:', baseUrl);// borrar
            console.log('Image Path:', user.imagen_link);// borrar
            console.log('Full Image URL:', perfilPic.src);// borrar
        perfilHoverMessage.textContent = 'Perfil';
    

        // Mostrar el email y usuario al pasar el mouse
        perfilPic.addEventListener('mouseenter', () => {
            perfilHoverMessage.textContent = `${user.usuario}\n${user.email}`;
        });

        // Crear y mostrar el menu 
        perfilPic.addEventListener('click', () => {
            dropdownMenu.innerHTML = '';// Limpia el menu existente, elimina contenido previo
            
            console.log('en common primer then user.rol y tipo: ', user.rol, typeof(user.rol)); //borrar Log de los datos del usuario
            const userRol = user.rol; // Tomamos el rol
                console.log('en common primer then userRol y tipo: :', userRol, typeof(userRol)); //borrar Log de los datos del usuario
            //const menu = document.createElement('div'); // Creamos un div dinámicamente para contener el menú de opciones
            //menu.className = 'dropdown-menu'; // Clase para formato CSS del menú

            // Crear opciones del menu
            const opciones = [
                { text: 'Perfil', href: 'perfil.html' },
                ...(userRol === 'Administrador' 
                    ? [{ text: 'Administración', href: 'admin_dashboard.html' }] 
                    : [{ text: 'Otros', href: 'index.html' }]),
                { text: 'Cerrar sesión', action: () => {
                    localStorage.removeItem('token'); // Cerrar sesion
                    window.location.href = 'index.html';
                }}
            ];

            opciones.forEach(opcion => {
                const item = document.createElement('div');
                item.className = 'dropdown-item'; // Clase para formato css de cada opcion
                item.textContent = opcion.text;

                if (opcion.href) {
                    item.addEventListener('click', () => {
                        window.location.href = opcion.href;
                    });
                } else if (opcion.action) {
                    item.addEventListener('click', opcion.action);
                }

                dropdownMenu.appendChild(item);
                console.log('ver estructura del menu appendClid; ', dropdownMenu.outerHTML);// borrar Ver estructura del menu
            });

            dropdownMenu.style.display = 'block';// Muestra el menu

            //document.getElementById('perfilContainer').appendChild(menu); // Agrega el menu al body
            console.log('Ver donde se renderiza el menu: ', dropdownMenu.outerHTML);//borrar Comprueba si el menu se renderiza donde se espera
            console.log('despues de document.body.appendChild(menu) : ', dropdownMenu);//borrar
            // Posiciona el menu cerca del icono
            const rect = perfilPic.getBoundingClientRect();
            console.log('Posicion del menu:', rect); // borrar Log para verificar la posicion
            
            dropdownMenu.style.position = 'absolute';
            dropdownMenu.style.top = `${rect.bottom}}px`;
            dropdownMenu.style.left = '50%'; // Centrar horizontalmente
            dropdownMenu.style.transform = 'translateX(-50%)'; // Desplazar a la izquierda la mitad de su ancho
            console.log('Menú creado:', dropdownMenu); // borrar Verifica si el menú se crea correctamente
            console.log('Menu en el DOM:', document.body.contains(dropdownMenu)); // borrar Verifica si el menú está en el DOM

            // Oculta el menu al hacer clic en otro lugar
            const hideDropdownMenu = (event) => {
                if (!dropdownMenu.contains(event.target) && event.target !== perfilPic) {
                    dropdownMenu.style.display = 'none'; // Elimina el menú
                    document.removeEventListener('click', hideDropdownMenu); // Elimina el listener para evitar múltiples ejecuciones
                }
            };

            document.addEventListener('click', hideDropdownMenu);// Agrega el listener solo despues de abrir el menu

        });

    } else {
        perfilPic.src = '../image/user_account_circle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png';// Imagen por defecto
        perfilHoverMessage.textContent = 'Ingresar';
        perfilPic.addEventListener('click', () => {
            localStorage.removeItem('token');//cerrar sesion
            window.location.href = 'login.html';
        });
    }

});

/* ------------------------------------------------------------------------------------------- */

// Funcion para manejar sidebar boton de alternancia en Administracion
const toggleBtn = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('sidebar-hidden');
});

/* ------------------------------------------------------------------------------------------- */

// Funciones para validar email, contraseña y confirmación de contraseña
/*
// Valida email
function validateEmailSwal(emailElement, errorElement) {
    const emailValue = emailElement.value.trim();
    if (!/^[\wñÑ](?:[\wñÑ._-]*[\wñÑ])?@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/.test(emailValue)) {
        errorElement.textContent = 'El email debe ser válido: SI "@ . - _" y NO "espacios blancos" ';
        emailElement.classList.add('is-invalid');
        return false;
    } else {
        errorElement.textContent = '';
        emailElement.classList.remove('is-invalid');
        return true;
    }
}

// Valida password
function validatePasswordSwal(passwordElement, errorElement) {
    const passwordValue = passwordElement.value.trim();
    if (passwordValue.length < 8) {
        errorElement.textContent = 'La contraseña debe tener al menos 8 caracteres.';
        passwordElement.classList.add('is-invalid');
        return false;
    } else {
        errorElement.textContent = '';
        passwordElement.classList.remove('is-invalid');
        return true;
    }
}

// Valida confirmacion de password
function validateConfirmPasswordSwal(confirmPasswordElement, passwordElement, errorElement) {
    const confirmPasswordValue = confirmPasswordElement.value.trim();
    const passwordValue = passwordElement.value.trim();
    if (confirmPasswordValue !== passwordValue || confirmPasswordValue === '') {
        errorElement.textContent = 'Las contraseñas no coinciden.';
        confirmPasswordElement.classList.add('is-invalid');
        return false;
    } else {
        errorElement.textContent = '';
        confirmPasswordElement.classList.remove('is-invalid');
        return true;
    }
}

// Función para habilitar o deshabilitar el botón "Continuar"
function checkFormValidity(emailSwal, passwordSwal, confirmPasswordSwal, errorEmailSwal, errorPasswordSwal, errorConfirmPasswordSwal) {
    const emailValid = validateEmailSwal(emailSwal, errorEmailSwal);
    const passwordValid = validatePasswordSwal(passwordSwal, errorPasswordSwal);
    const confirmPasswordValid = validateConfirmPasswordSwal(confirmPasswordSwal, passwordSwal, errorConfirmPasswordSwal);

    // Deshabilita o habilita el botón "Continuar" según la validez de los campos
    const confirmButton = document.querySelector('.swal2-confirm');
    if (confirmButton) {
        confirmButton.disabled = !(emailValid && passwordValid && confirmPasswordValid);
    }
}

// Envío de recuperación de contraseña
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordButton = document.getElementById('forgotPassword');
    console.log('4 Botón olvidó contraseña encontrado:', forgotPasswordButton);

    if (forgotPasswordButton) {
        forgotPasswordButton.addEventListener('click', function() {
            console.log('5 Botón de recuperar contraseña clickeado');
            
            Swal.fire({
                title: 'Cambiar Contraseña',
                html: `
                <form id="passwordForm">
                <div>
                    <input type="text" id="newEmail" class="swal2-input" placeholder="Ingrese su email" required autocomplete="email" style="width: 80%;">
                    <div id="errorEmail" class="invalid-feedback" style="color: red;"></div>
                </div>
                <div>
                    <input type="password" id="newPassword" class="swal2-input" placeholder="Nueva Contraseña" required autocomplete="new-password" style="width: 80%;">
                    <div id="errorPassword" class="invalid-feedback" style="color: red;"></div>
                </div>
                <div>
                    <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirmar Nueva Contraseña" required autocomplete="new-password" style="width: 80%;">
                    <div id="errorConfirmPassword" class="invalid-feedback" style="color: red;"></div>
                </div>
                </form>
                `,
                confirmButtonText: 'Continuar',
                focusConfirm: false,
                didOpen: () => {
                    // Captura los elementos después de abrir el Swal
                    const emailSwal = document.getElementById('newEmail');
                    const passwordSwal = document.getElementById('newPassword');
                    const confirmPasswordSwal = document.getElementById('confirmPassword');
                    const errorEmailSwal = document.getElementById('errorEmail');
                    const errorPasswordSwal = document.getElementById('errorPassword');
                    const errorConfirmPasswordSwal = document.getElementById('errorConfirmPassword');
                    
                    console.log('didOpen: Elementos capturados');
                    console.log('didOpen 1 emailSwal.value: ', emailSwal.value);// borrar
                    console.log('didOpen 1 passwordSwal.value : ', passwordSwal.value);// borrar
                    console.log('didOpen 1 confirmPasswordSwal.value  :', confirmPasswordSwal.value);// borrar
                    console.log('didOpen 1 errorEmailSwal.value :', errorEmailSwal.value);// borrar
                    console.log('didOpen 1 errorPasswordSwal.value :', errorPasswordSwal.value);// borrar
                    console.log('didOpen 1 errorConfirmPasswordSwal.value, :', errorConfirmPasswordSwal.value);// borrar

                    // Agrega event listeners para validación en tiempo real
                    emailSwal.addEventListener('blur', () => {
                        validateEmailSwal(emailSwal, errorEmailSwal);
                        checkFormValidity(emailSwal, passwordSwal, confirmPasswordSwal, errorEmailSwal, errorPasswordSwal, errorConfirmPasswordSwal);
                    });
                
                    passwordSwal.addEventListener('blur', () => {
                        validatePasswordSwal(passwordSwal, errorPasswordSwal);
                        checkFormValidity(emailSwal, passwordSwal, confirmPasswordSwal, errorEmailSwal, errorPasswordSwal, errorConfirmPasswordSwal);
                    });
                
                    confirmPasswordSwal.addEventListener('blur', () => {
                        validateConfirmPasswordSwal(confirmPasswordSwal, passwordSwal, errorConfirmPasswordSwal);
                        checkFormValidity(emailSwal, passwordSwal, confirmPasswordSwal, errorEmailSwal, errorPasswordSwal, errorConfirmPasswordSwal);
                    });

                    // LLamamos a la función para habilitar o deshabilitar el botón "Continuar"
                    checkFormValidity(emailSwal, passwordSwal, confirmPasswordSwal, errorEmailSwal, errorPasswordSwal, errorConfirmPasswordSwal);
                },
                preConfirm: () => {
                    console.log('PRECONFIRM: Formulario en preConfirm');
                    const emailSwal = document.getElementById('newEmail');
                    const passwordSwal = document.getElementById('newPassword');
                    const confirmPasswordSwal = document.getElementById('confirmPassword');

                    const emailValid = validateEmailSwal(emailSwal, document.getElementById('errorEmail'));
                    const passwordValid = validatePasswordSwal(passwordSwal, document.getElementById('errorPassword'));
                    const confirmPasswordValid = validateConfirmPasswordSwal(confirmPasswordSwal, passwordSwal, document.getElementById('errorConfirmPassword'));

                    if (!emailValid) {
                        Swal.showValidationMessage('El email no es válido.');
                        return false;
                    }
            
                    if (!passwordValid) {
                        Swal.showValidationMessage('La contraseña no es válida.');
                        return false;
                    }
            
                    if (!confirmPasswordValid) {
                        Swal.showValidationMessage('Las contraseñas no coinciden.');
                        return false;
                    }

                    return {
                        email: emailSwal.value,
                        password: passwordSwal.value
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Ingrese el código de verificación',
                        html: `<form></form><input type="password" id="verifyPassword" class="swal2-input" placeholder="Código de verificación"></form>`,
                        confirmButtonText: 'Enviar',
                        preConfirm: () => {
                            const verifyPassword = document.getElementById('verifyPassword').value;
                            if (verifyPassword !== result.value.password) {
                                Swal.showValidationMessage('El código no es correcto');
                                return false;
                            }

                            return verifyPassword;
                        }
                    }).then((verifyResult) => {
                        if (verifyResult.isConfirmed) {
                            fetch('http://localhost:3000/api/users/updatePass', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                },
                                body: JSON.stringify({
                                    email: result.value.email,
                                    password: verifyResult.value
                                })
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    Swal.fire('Éxito', 'Su nueva contraseña ha sido activada', 'success').then(() => {
                                        window.location.href = 'login.html';
                                    });
                                } else {
                                    Swal.fire('Error', data.message, 'error');
                                }
                            })
                            .catch(error => {
                                Swal.fire('Error', 'No se pudo actualizar la contraseña', 'error');
                            });
                        }
                    });
                }
            });
        });
    }
});
*/
/* ------------------------------------------------------------------------------------------- */

