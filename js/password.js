// Escuchamos el boton "Cambiar contraseña" en script de pagina html
const forgotPasswordButton = document.getElementById('forgotPassword'); // Boton que activa el mensaje swal
console.log('Botón olvidó contraseña encontrado:', forgotPasswordButton);

if (forgotPasswordButton) {
    forgotPasswordButton.addEventListener('click', () => {
    console.log('Botón de recuperar contraseña clickeado');
        // Valida email
        function validateEmail(email, errorEmail) {
            const emailValue = email.value.trim();
            console.log('validate: email and email.value:', email, email.value, 'errorEmail:', errorEmail); // borrar
            if (!/^[\wñÑ](?:[\wñÑ._-]*[\wñÑ])?@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/.test(emailValue)) {
                console.log('Email inválido'); // borrar Verificar si el email es invalido
                errorEmail.textContent = 'El email debe ser válido: SIN "espacios blancos" y CON "@ . - _"';
                email.classList.add('is-invalid');
                return false;
            } else {
                errorEmail.textContent = '';
                email.classList.remove('is-invalid');
                return true;
            }
        };
        // Valida contraseña
        function validatePassword(password, errorPassword) {
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
        // Valida confirmacion de contraseña
        function validateConfirmPassword(confirmPassword, password, errorConfirmPassword) {
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
        // Envio de confirmacion de email
        // Primer Swal: Solicitar email
        Swal.fire({
        title: 'Por favor, ingrese su email.',
        html: `
            <form id="swal2-form">
                <input id="swalChangeEmail" class="swal2-input" placeholder="ejemplo@email.com" type="text" autocomplete="new-email" />
                <small id="swalChangeErrorEmail" class="invalid-feedback" style="color: red;"></small>
            </form>
        `,
        confirmButtonText: 'Continuar',
        didOpen: () => {
        // Captura los elementos después de abrir el Swal
            const swalContainer = Swal.getHtmlContainer();
            const email = swalContainer.querySelector('#swalChangeEmail');
            const errorEmail = swalContainer.querySelector('#swalChangeErrorEmail');
            const confirmButton = Swal.getConfirmButton();
            
            console.log('didOpen: email:', email, 'errorEmail:', errorEmail); // borrar

            confirmButton.disabled = true;// Asegura que el boton "Continuar" este inicialmente deshabilitado

            // Funcion de validacion para llamar funcion de validacion y boton Continuar
            const checkEmailValidity = () => {
                const isValid = validateEmail(email, errorEmail);
                confirmButton.disabled = !isValid;
                email.style.borderColor = isValid ? '' : 'red';
            };

            // Validacion cuando el campo pierde el foco (blur)
            email.addEventListener('blur', () => {
                console.log('Evento blur activado'); // borrar
                checkEmailValidity();
            });

            // Validacion en tiempo real mientras se escribe (input)
            email.addEventListener('input', () => {
                console.log('Evento input activado'); // borrar
                checkEmailValidity();
            });
        },
        preConfirm: () => {
            const swalContainer = Swal.getHtmlContainer();
            const email = swalContainer.querySelector('#swalChangeEmail');
            const errorEmail = swalContainer.querySelector('#swalChangeErrorEmail');
            console.log('preConfirm: email and // email.value:', email, email.value, '// errorEmail:', errorEmail); // borrar

            const emailValid = validateEmail(email, errorEmail);
            console.log('preConfirm: email.value:', email.value); // borrar
            console.log('preConfirm: emailValid:', emailValid); // borrar Verifica el estado de la validación

            if (!emailValid) {
                Swal.showValidationMessage('Por favor, ingrese un email válido.');
                return false;// Aqui return false evita que se cierre el modal del mensaje
            }

            // Verificar si el email existe en la base de datos
            return fetch(`http://localhost:3000/api/users/isEmail/${email.value.trim()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(response => {
                console.log('Respuesta del servidor, response.status: ', response.status);// borrar
                if (response.status === 204) {// Usuario no encontrado, status 204
                    Swal.showValidationMessage('El email no está registrado. Por favor, verifique e intente nuevamente.');
                    return false;
                } else if (response.ok) {
                    return email.value.trim(); // Si la respuesta es exitosa (status 200), continua
                } else {
                    throw new Error('Error al verificar el email');
                }
            }).catch(error => {
                // Maneja cualquier error que pueda ocurrir durante la solicitud
                console.error('Error:', error);
                Swal.showValidationMessage('Ocurrió un error al verificar el email. Por favor, intente nuevamente.');
                return false;
            });
        }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const verifiedEmail = result.value;
                console.log('Email verificado:', verifiedEmail);

                // Segunda Swal: Solicitar nueva contraseña y confirmación
                Swal.fire({
                    title: 'Cambiar Contraseña',
                    html: `
                        <form id="swal2-form">
                            <div>
                                <input id="swalChangePassword" class="swal2-input" placeholder="mínimo 8 carácteres" type="password" autocomplete="new-password" />
                                <small id="swalChangeErrorPassword" class="invalid-feedback" style="color: red;"></small>
                            </div>
                            <div>
                                <input id="swalConfirmPassword" class="swal2-input" placeholder="Repita la contraseña" type="password" autocomplete="new-password" />
                                <small id="swalErrorConfirmPassword" class="invalid-feedback" style="color: red;"></small>
                            </div>
                        </form>
                    `,
                    confirmButtonText: 'Continuar',
                    focusConfirm: false,
                    didOpen: () => {
                        // Captura los elementos después de abrir el Swal
                        const swalContainer = Swal.getHtmlContainer();
                        const password = swalContainer.querySelector('#swalChangePassword');
                        const errorPassword = swalContainer.querySelector('#swalChangeErrorPassword');
                        const confirmPassword = swalContainer.querySelector('#swalConfirmPassword');
                        const errorConfirmPassword = swalContainer.querySelector('#swalErrorConfirmPassword');
                        const confirmButton = Swal.getConfirmButton();

                        console.log('didOpen 2: password:', password, 'errorPassword:', errorPassword); // borrar
                        console.log('didOpen 2: confirmPassword:', confirmPassword, 'errorConfirmPassword:', errorConfirmPassword); // borrar

                        confirmButton.disabled = true;// Asegura que el boton "Continuar" este inicialmente deshabilitado

                        // Funcion de validacion para llamar funciones de validacion y boton Continuar
                        const checkFormValidity = () => {
                            const isPassValid = validatePassword(password, errorPassword);
                            const isConfirmValid = validateConfirmPassword(confirmPassword, password, errorConfirmPassword);
                            const isAllValid = isPassValid && isConfirmValid;
                            confirmButton.disabled = !isAllValid;
                            password.style.borderColor = isAllValid ? '' : 'red';
                            confirmPassword.style.borderColor = isAllValid ? '' : 'red';
                        };

                        // Agrega event listeners para validación en tiempo real
                        password.addEventListener('input', () => {
                            console.log('Evento input activado'); // borrar
                            checkFormValidity();
                        });

                        confirmPassword.addEventListener('input', () => {
                            console.log('Evento input activado'); // borrar
                            checkFormValidity();
                        });
                    },
                    preConfirm: () => {
                        const swalContainer = Swal.getHtmlContainer();
                        const password = swalContainer.querySelector('#swalChangePassword');
                        const errorPassword = swalContainer.querySelector('#swalChangeErrorPassword');
                        const confirmPassword = swalContainer.querySelector('#swalConfirmPassword');
                        const errorConfirmPassword = swalContainer.querySelector('#swalErrorConfirmPassword');

                        console.log('preConfirm 2: password:', password, 'errorPassword:', errorPassword); // borrar
                        console.log('preConfirm 2: confirmPassword:', confirmPassword, 'errorPassword:', password, 'errorConfirmPassword:', errorConfirmPassword); // borrar

                        const passwordValid = validatePassword(password, errorPassword);
                        const confirmPasswordValid = validateConfirmPassword(confirmPassword, password, errorConfirmPassword);

                        if (!passwordValid) {
                            Swal.showValidationMessage('Por favor, ingrese una contraseña válida.');
                            return false;
                        }

                        if (!confirmPasswordValid) {
                            Swal.showValidationMessage('Las contraseñas no coinciden.');
                            return false;
                        }

                        return {
                            password: password.value.trim()
                        };
                    }
                }).then((passwordResult) => {
                    if (passwordResult.isConfirmed && passwordResult.value) {
                        const newPassword = passwordResult.value.password;
                        console.log('Nueva contraseña ingresada:', newPassword);

                        // Tercera Swal: Codigo de recepcion de nueva contraseña (esto simula un envio por email al usuario)
                        Swal.fire({
                            title: 'Código de Verificación',
                            html: `
                                <form id="verifyForm">
                                    <div>
                                        <input type="password" id="verifyPassword" class="swal2-input" placeholder="Ingrese el código recibido" required autocomplete="new-password" style="width: 80%;">
                                        <div id="errorVerifyPassword" class="invalid-feedback" style="color: red;"></div>
                                    </div>
                                </form>
                            `,
                            confirmButtonText: 'Enviar',
                            focusConfirm: false,
                            didOpen: () => {
                                const verifyPassword = document.getElementById('verifyPassword');
                                const errorVerifyPassword = document.getElementById('errorVerifyPassword');

                                verifyPassword.addEventListener('blur', () => {
                                    if (verifyPassword.value.trim() !== newPassword) {
                                        errorVerifyPassword.textContent = 'El código no corresponde..';
                                        verifyPassword.classList.add('is-invalid');
                                        document.querySelector('.swal2-confirm').disabled = true;
                                    } else {
                                        errorVerifyPassword.textContent = '';
                                        verifyPassword.classList.remove('is-invalid');
                                        document.querySelector('.swal2-confirm').disabled = false;
                                    }
                                });

                                // Inicializa el estado del botón "Enviar"
                                document.querySelector('.swal2-confirm').disabled = true;
                            },
                            preConfirm: () => {
                                const verifyPassword = document.getElementById('verifyPassword');
                                const errorVerifyPassword = document.getElementById('errorVerifyPassword');

                                if (verifyPassword.value.trim() !== newPassword) {
                                    Swal.showValidationMessage('El código no corresponde..');
                                    return false;
                                }

                                return verifyPassword.value.trim();
                            }
                        }).then((verifyResult) => {
                            if (verifyResult.isConfirmed) {
                                // Enviar solicitud para actualizar la contraseña
                                fetch('http://localhost:3000/api/users/updatePass', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer '
                                    },
                                    body: JSON.stringify({
                                        email: verifiedEmail,
                                        newPassword: verifyResult.value
                                    })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        Swal.fire('Éxito', 'Su nueva contraseña ha sido activada', 'success').then(() => {
                                            window.location.href = 'login.html';
                                        });
                                    } else {
                                        Swal.fire('Error', data.message || 'No se pudo actualizar la contraseña.', 'error');
                                    }
                                })
                                .catch(error => {
                                    Swal.fire('Error', 'No se pudo actualizar la contraseña.', 'error');
                                    console.error('Error al actualizar la contraseña:', error);
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}

