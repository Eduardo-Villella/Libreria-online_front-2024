document.addEventListener('DOMContentLoaded', async function () {
    try {
        /* ---------------- Para mas adelante con Administrador ---------------
        const token = localStorage.getItem('token'); // Obtengo el token almacenado en localStorage
        
        if (!token) {// Verifico si el token existe
            alert('No estás autenticado. Por favor, inicia sesión.');
            window.location.href = 'login.html'; // Redirijo al login si no hay token
            return;
        }
        
        const headers = new Headers();// Configuro los headers para la solicitud con el token
        headers.append('Authorization', `Bearer ${token}`);
        */
        
        const response = await fetch('http://localhost:3000/api/users/', {// Realizo la solicitud al backend para obtener todos los usuarios//remplazar http://34.46.27.106:3000 por http://localhost:3000
            method: 'GET',
            //headers: headers// Para admin
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }
        
        const data = await response.json();
        
        const usersTableBody = document.getElementById('usersTableBody');// Obtengo el cuerpo de la tabla donde se agregaran los usuarios
        usersTableBody.innerHTML = ''; // Limpia cualquier contenido previo
        
        data.result.forEach(user => {// Itera sobre los usuarios y crea las filas de la tabla data es el objeto recibido result la propiedad que es un array con los datos
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id_usuarios}</td>
                <td>${user.usuario}</td>
                <td>${user.email}</td>
                <td>${user.password}</td>
                <td>${user.nombre}</td>
                <td>${user.apellido}</td>
                <td>${user.fecha_nacimiento}</td>
                <td>${user.telefono}</td>
                <td>${user.direccion}</td>
                <td>${user.ciudad}</td>
                <td>${user.provincia}</td>
                <td>${user.pais}</td>
                <td>${user.codigo_postal}</td>
                <td>${user.rol}</td>
                <td>${user.status}</td>
                <td>
                    <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editUserModal">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar los usuarios. Inténtalo de nuevo.');
    }
});

/* ejemplo pára validar y requerir datos */
/*
<form id="registrationForm">
  <input type="text" name="usuario" id="usuario" required>
  <input type="email" name="email" id="email" required>
  <input type="password" name="password" id="password" required>
  <input type="text" name="nombre" id="nombre">
  <input type="text" name="apellido" id="apellido">
  <input type="date" name="fecha_nacimiento" id="fecha_nacimiento">
  <input type="text" name="telefono" id="telefono">
  <input type="text" name="direccion" id="direccion">
  <input type="text" name="ciudad" id="ciudad">
  <input type="text" name="provincia" id="provincia">
  <input type="text" name="pais" id="pais">
  <input type="text" name="codigo_postal" id="codigo_postal">
  <button type="submit">Register</button>
</form>

<script>
document.getElementById('registrationForm').addEventListener('submit', function(event) {
  // Realizar validaciones adicionales aquí
  const usuario = document.getElementById('usuario').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if (!usuario || !email || !password) {
    alert('Usuario, email y password son obligatorios.');
    event.preventDefault(); // Prevenir el envío del formulario
  }
});
</script>
*/