/* Archivo de funciones y script comunes a todos los html */
// logout
// icono ojo contraseña
// icono perfil usuario
// sidebar administracion

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
document.addEventListener('DOMContentLoaded', () => {
    const perfilPic = document.getElementById('perfilPic');
    const perfilHoverMessage = document.getElementById('perfilHoverMessage');
    
    const isLoggedIn = localStorage.getItem('token');// Verifica si el usuario esta logueado
    
    if (isLoggedIn) {
        perfilPic.src = '../image/user_icons8-usuario-de-género-neutro.gif'; // Cambia por la foto del perfil del usuario (a futuro, por ahora cambia a gif)
        perfilHoverMessage.textContent = 'Perfil';
        perfilPic.addEventListener('click', () => {
            window.location.href = 'perfil.html';
        });
    } else {
        perfilPic.src = '../image/user_account_circle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png';// Imagen por defecto
        perfilHoverMessage.textContent = 'Ingresar';
        perfilPic.addEventListener('click', () => {
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

