/* Archivo de funciones y script comunes a todos los html : */
    // logout
    // icono ojo contraseña
    // icono perfil usuario
    // sidebar administracion
    // manejo de sesion y token en peticiones y/o envios http
    // manejo y formato de fechas
    // validacion de datos
    // manejo dinamico de topbar y tabla allUsers
    // seleccion de una flia de la tabla allusers

    // ya no estan:
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
    
    const baseUrl = 'http://localhost:3000/api/4.Upload/users';
    const isLoggedIn = localStorage.getItem('token');// Verifica si el usuario esta logueado
    const token = localStorage.getItem('token');// Verifica si el usuario esta logueado

    if (!token) {
        localStorage.removeItem('token');// Elimina el token invalido del almacenamiento local
        Swal.fire({
            icon: 'warning',
            title: 'La sesión expiró o no estás logueado',
            timer: 1500, // Se cerrara automaticamente despues de ... "1000" = 1 segundo
            showConfirmButton: false, // Oculta el botón de confirmacion
            toast: true, // Opcion para que sea mas pequeño como un toast
            position: 'center' // Posicion de la notificacion
        });
        
    }

    if (isLoggedIn) {
        // Realizamos una solicitud para obtener la informacion del usuario
        const response = await fetch('http://localhost:3000/api/users/perfil', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${isLoggedIn}` // Enviar el token en la cabecera
            }
        })
        
        if (!response.ok) {
            try{
                if (response.status === 401 || response.status === 401) {
                    localStorage.removeItem('token');// Elimina el token invalido del almacenamiento local
                    Swal.fire({
                        icon: 'warning',
                        title: 'La sesión expiró',
                        text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                        confirmButtonText: 'Iniciar sesión'
                    }).then(() => {
                        window.location.href = 'login.html';
                    });

                    return; // Salimos si hay un error
                }
                
                console.error(`Error: ${response.statusText}`);// borrar
                

            } catch (error) {
                console.error('Error en el manejo de la respuesta:', error.message);
            }

            return; // Salimos si hay un error

        }

        const data = await response.json();// Devuelve la respuesta como un objeto JSON
            console.log('en common primer then if response y tipo: :', response, typeof(response)); //borrar Log de los datos del usuario
            console.log('en common primer then if data y tipo: :', data, typeof(data)); //borrar Log de los datos del usuario
        const user = data[0];// Tomamos de la respuesta objeto el elemento 0 correspondiente al  array de datos usuario
            console.log('en common primer then if user y tipo: :', user, typeof(user)); //borrar Log de los datos del usuario
        
        // Mostrar imagen de perfil del usuario
        perfilPic.src = `${baseUrl}/${user.imagen_name}`; // '../image/user_icons8-usuario-de-género-neutro.gif'; // Cambia por la foto del perfil del usuario (a futuro, por ahora cambia a gif)
            console.log('Base URL:', baseUrl);// borrar
            console.log('Image Path:', user.imagen_name);// borrar
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
                { text: 'Perfil', href: 'perfil.html' }, // Visible para todos los roles
                ...(  user.rol === 'Administrador' 
                        ? [
                            { text: 'Administración', href: 'admin_dashboard.html' },
                            { text: 'Gestión de usuarios', href: 'admin_users.html' }
                            // Al finalizar, completar con todas las gestiones
                    ]
                    : user.rol === 'Cliente'
                        ? [
                            { text: 'Mis compras', href: 'mis_compras.html' },
                            { text: 'Historial de compras', href: 'historial_compras.html' }
                    ]
                    :     [// Caso de otro rol por defecto
                            { text: 'Otros', href: 'index.html' }
                    ]
                ), 
                { text: 'Cerrar sesión', action: () => {// Visible para todos los roles
                    localStorage.removeItem('token');
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
            dropdownMenu.style.transform = 'translateX(-60%)'; // Desplazar a la izquierda la mitad de su ancho
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
            window.location.href = 'login.html';//redige a login
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

// Funcion para manejar respuestas de token y sesiones en peticiones y/o envios http
async function sesionTokenError(response) {
    if (response.ok) {
        return true;// Si la respuesta es OK, continuar normalmente
    }

    // Si no es ok, manejo de diferentes tipos de errores
    let title = '';
    let text = '';
    let redirectUrl = '';

    switch (response.status) {
        case 401:
            title = 'Debe estar logueado';
            text = 'Por favor, inicie sesión para continuar.';
            redirectUrl = 'login.html';
            break;
        case 400:
            title = 'Su sesión no es válida';
            text = 'Será redirigido a la página principal.';
            redirectUrl = 'index.html';
            break;
        case 403:
            title = 'No tienes permisos adecuados';
            text = 'Por favor, loguéese correctamente.';
            redirectUrl = 'login.html';
            break;
        case 500:
            title = 'Hubo un error';
            text = 'Por favor, inténtelo nuevamente.';
            redirectUrl = 'login.html';
            break;
        case 422: // Manejo el error de validacion aqui
        const errorData = await response.json();
        await Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            text: `Datos inválidos: ${errorData.error}`,
            confirmButtonText: 'OK'
        });
        return false; // Detiene el flujo si es un error de validacion
        default:
            title = 'Se encontró un error';
            text = 'Un error inesperado, ha ocurrido. Vuelva a intentarlo';
            redirectUrl = 'index.html';
            break;
    }

    // Muestra la alerta y espera a que el usuario la cierre antes de redirigir
    await Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        confirmButtonText: 'OK'
    }).then(() => {
        // Despues de que se cierra la alerta, redirige al usuario
        localStorage.removeItem('token'); // cerrar sesion
        window.location.href = redirectUrl;
    });

    return false; // Interrumpir el flujo original
}

/* ------------------------------------------------------------------------------------------- */

// Funcion para manejar fechas y su formato con Pikaday
function formatDatePika(elementId) {
    var element = document.getElementById(elementId);
    
    if (element) {
        var picker = new Pikaday({
            field: document.getElementById(elementId),
            format: 'DD-MM-YYYY', // Formato de fecha
            i18n: {
                previousMonth: 'Mes anterior',
                nextMonth: 'Mes siguiente',
                months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
            },
            toString(date, format) {
                return moment(date).format('dddd D [de] MMMM [de] YYYY');// Aqui en format se personaliza como se muestra la fecha en el input
            }
        });
    } else {
        console.warn(`Elemento con ID ${elementId} no encontrado.`);
    }
}

function formatDatePikaDay(elementIds) {// Funcion para inicializar multiples datepickers
    elementIds.forEach(id => formatDatePika(id));
}

document.addEventListener('DOMContentLoaded', function() {
    formatDatePikaDay([
        'viewUserDate',
        'editUserFechaNacimiento',
        'addUserFechaNacimiento', 
        'fecha_nacimiento'
    ]);
});

/* ------------------------------------------------------------------------------------------- */

//FUNCIONES DE VALIDACION DE DATOS INGRESADOS
// Valida usuario
function validateUsuario(event) {
    if (!event) {
        console.error("en common.js El evento USUARIO no fue pasado correctamente");
        return false;
    }
        console.log("en common.js Evento USUARIO blur capturado", event);  // borrar Verifica que el evento se captura
    const usuario = event.target; // Escucha el input que dispara el evento
    const errorUsuario = document.getElementById(`error${usuario.id.charAt(0).toUpperCase() + usuario.id.slice(1)}`);// Obtengo el error basado en el id del campo de usuario
        console.log('en common.js Validando usuario:', usuario.value); // borrar Ver el valor ingresado
        console.log('en common.js Clase del usuario antes de validación:', usuario.classList); // Ver clases aplicadas
    const usuarioValue = usuario.value.trim();
    if (usuarioValue.length < 5 || !/^[\wñÑ\s._-]+$/.test(usuarioValue) || /\s{2,}/.test(usuarioValue)) {// Regex (!/^[\wñÑ\s._-]+$/) -regular expresion- su uso es excelente para determinar filtros
        errorUsuario.textContent = 'El nombre de usuario debe tener al menos 5 caracteres';
        usuario.classList.add('is-invalid');
            console.log('en common.js Clase del usuario después de validación fallida:', usuario.classList); // borrar Ver clases tras fallo
        return false;
    } else {
        errorUsuario.textContent = '';// Limpia mensaje de error si es valido
        usuario.classList.remove('is-invalid');
            console.log('en common.js Clase del usuario después de validación exitosa:', usuario.classList); // borrar Ver clases tras éxito
        return true;
    }
}
// Valida email
function validateEmail(event) {
    if (!event) {
        console.error("en common.js El evento EMAIL no fue pasado correctamente");
        return false;
    }
        console.log("en common.js Evento EMAIL blur capturado", event);  // borrar Verifica que el evento se captura
    const email = event.target; // Escucha el input que dispara el evento
    const errorEmail = document.getElementById('errorEmail');
    const emailValue = email.value.trim();
        console.log('en common.js Validando email:', email.value); // borrar Ver el valor ingresado
    if (!/^[\wñÑ](?:[\wñÑ._-]*[\wñÑ])?@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/.test(emailValue)) {
        errorEmail.textContent = 'El email debe ser válido, SI "@ . - _" y NO "espacios blancos" ';
        email.classList.add('is-invalid');
        return false;
    } else {
        errorEmail.textContent = '';
        email.classList.remove('is-invalid');
        return true;
    }
}
// Valida contraseña
function validatePassword(event) {
    if (!event) {
        console.error("en common.js El evento PASSWORD no fue pasado correctamente");
        return false;
    }
    console.log("en common.js Evento PASSWORD blur capturado", event);  // borrar Verifica que el evento se captura
    const password = event.target;
    const errorPassword = document.getElementById('errorPassword');
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
function validateConfirmPassword(event) {
    if (!event) {
        console.error("en common.js El evento CONFIRMPASSWORD no fue pasado correctamente");
        return false;
    }
    console.log("en common.js Evento CONFIRMPASSWORD blur capturado", event);  // borrar Verifica que el evento se captura
    const confirmPassword = event.target;
    const errorConfirmPassword = document.getElementById('errorConfirmPassword');
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

/* ------------------------------------------------------------------------------------------- */

// MANEJO DINAMICO ENCABEZADO Y TABLA ALLUSERS
window.addEventListener('DOMContentLoaded', function() {
    // Selecciona la topbar, el thead de la tabla y margin del contenedor mt-5
    const topbar = document.getElementById('topbar');
    const tableHead = document.querySelector('.table thead th');
    const marginElement = document.querySelector('.mt-5'); // Selecciona el elemento con la clase .mt-5

    // Si topbar y marginElement existen, calcula su altura
    if (topbar && tableHead && marginElement) {
        const topbarHeight = topbar.offsetHeight; // Altura de la topbar
        const marginTop = parseFloat(getComputedStyle(marginElement).marginTop) || 0; 
        
        // Asigna la suma de totalTopbarHeight y marginTop a la propiedad CSS 'top' usando una variable CSS
        document.documentElement.style.setProperty('--dynamic-top', `${topbarHeight + marginTop}px`);
    }
});

// Selecciona todas las filas del cuerpo de la tabla
document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.querySelector('.table tbody');
    if (tableBody) { // Verifica que el elemento existe
        tableBody.addEventListener('click', function(event) {
            // Verifica que el clic proviene de un TD
            if (event.target.tagName === 'TD') {
                const clickedRow = event.target.parentNode; // Obtener la fila (tr) desde la celda (td)
                
                // Quitar la clase 'selected' de todas las filas
                document.querySelectorAll('.table tbody tr').forEach(row => row.classList.remove('selected'));
                
                // Agregar la clase 'selected' a la fila clicada
                clickedRow.classList.add('selected');
            }
        });
    }
});