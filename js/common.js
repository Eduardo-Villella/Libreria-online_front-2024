/* Archivo de funciones y script comunes a todos los html */

// Funcion para logout: elimina token del localStorage y redirige
function logout() {
    localStorage.removeItem('token'); // Elimina token del localStorage
    window.location.href = 'index.html'; // Redirige a la pagina de inicio
}
document.getElementById('logoutButton').addEventListener('click', logout);

/* ---------------------------------------------------------------------- */