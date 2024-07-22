/* Archivo de funciones y script comunes a todos los html */

// Funcion para logout: elimina token del localStorage y redirige
function logout() {
    localStorage.removeItem('token'); // Elimina token del localStorage
    window.location.href = 'index.html'; // Redirige a la pagina de inicio
}
document.getElementById('logoutButton').addEventListener('click', logout);

/* ---------------------------------------------------------------------- */

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

/* ---------------------------------------------------------------------- */

