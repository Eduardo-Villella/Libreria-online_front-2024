const baseUrl = 'http://localhost:3000/api';
const usersEndpoint = `${baseUrl}/users/admin`; // Este endpoint es para verificar el rol

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const token = localStorage.getItem('token'); // Obtengo el token almacenado en localStorage
        
        if (!token) { // Verifico si el token existe
            alert('en front users.js: No estás autenticado. Por favor, inicia sesión.');
            window.location.href = 'login.html'; // Redirijo al login si no hay token
            return;
        }
        
        const headers = new Headers(); // Configuro los headers para la solicitud con el token
        headers.append('Authorization', `Bearer ${token}`);
            
            const usersResponse = await fetch(usersEndpoint, { 
                method: 'GET',
                headers: headers
            });

            console.log('en front users.js: Respuesta al obtener usuarios:', usersResponse); // borrar Log de la respuesta de usuarios
        
            if (!usersResponse.ok) {
                const errorMessage = await usersResponse.text(); // Obtiene el mensaje de error
                console.error('en front users.js: Error al obtener los usuarios:', errorMessage);//borrar
                alert('No tienes autorización para acceder a esta página.');
                window.location.href = 'login.html'; // Redirijo al login si no tiene permiso
                return;
            }
        
            const data = await usersResponse.json();
            console.log('en front users.js: Datos de los usuarios:', data); //borrar Log de los datos de los usuarios

            const usersTableBody = document.getElementById('usersTableBody'); // Obtengo el cuerpo de la tabla
            usersTableBody.innerHTML = ''; // Limpia cualquier contenido previo
        
            data.result.forEach(user => { // Itera sobre los usuarios y crea las filas de la tabla
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
        console.error('en front users.js: Error al verificar el token:', error);
        alert('en front users.js: Se ha producido un error. Por favor, intenta de nuevo.');
        window.location.href = 'login.html'; // Redirijo al login en caso de error
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
// Fetch all users
/*async function fetchUsers() {
    try {
        const response = await fetch(usersEndpoint);
        const data = await response.json();
        const userTableBody = document.getElementById('usersTableBody');
        userTableBody.innerHTML = '';

        data.result.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
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
                        <button class="btn btn-primary btn-sm" onclick="viewUser(${user.id_usuarios})" data-bs-toggle="modal" data-bs-target="#viewUserModal">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id_usuarios})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
            userTableBody.appendChild(tr);
        });
    }
    catch (error){
        console.error('Error:', error);
        alert('Hubo un problema al cargar los usuarios. Inténtalo de nuevo.');
    }
    
}
*/
// View User
/*async function viewUser(id) {
    const response = await fetch(`${usersEndpoint}/${id}`);
    const user = await response.json();
    user.result.forEach(user => {
        document.getElementById('viewUserID').innerText = `${user.id_usuarios}`;
        document.getElementById('viewUserUser').innerText = `${user.usuario}`;
        document.getElementById('viewUserEmail').innerText = `${user.email}`;
        document.getElementById('viewUserPass').innerText = `${user.password}`;
        document.getElementById('viewUserNombre').innerText = `${user.nombre}`;
        document.getElementById('viewUserUserName').innerText = `${user.apellido}`;
        document.getElementById('viewUserDate').innerText =  `${user.fecha_nacimiento}`;
        document.getElementById('viewUserTelephone').innerText = `${user.telefono}`;
        document.getElementById('viewUserAndrew').innerText = `${user.direccion}`;
        document.getElementById('viewUserCity').innerText = `${user.ciudad}`;
        document.getElementById('viewUserProvince').innerText = `${user.provincia}`;
        document.getElementById('viewUserCountry').innerText = `${user.pais}`;
        document.getElementById('viewUserPostalCode').innerText = `${user.codigo_postal}`;
        document.getElementById('viewUserRol').innerText = `${user.rol}`;
        document.getElementById('viewUserStatus').innerText = `${user.status}`;
    });

}*/

// Add a new user
/* document.getElementById('addUserForm').addEventListener('submit', async (e) =>{
    e.preventDefault();

    const formData = new FormData(e.target);
    const response = await fetch(`${usersEndpoint}/usuario/register`, {
        method: 'POST',
        body: formData
    })

    if (response.ok) {
        Swal.fire({
            title: "Usuario creado",
            text: "El usuario ha sido guardado correctamente",
            icon: "success"
        }).then(async()=>{
            await fetchUsers();
        })
        document.querySelector('#addUserModal .btn-close').click();
        e.target.reset();
    } else {
        Swal.fire({
            title: "Error",
            text: `ah ocurrido algun error`,
            icon: "error"
        });

        console.log(await response.json());
    }
}) */

// Delete User
/*async function deleteUser(id) {
    Swal.fire({
        title: `¿Esta seguro que desea eliminar el usuario con id: ${id}?`,
        text: "este cambio no sera reversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminarlo!"
    }).then((result) => {
        if (result.isConfirmed) {

            (async () => {
                const response = await fetch(`${usersEndpoint}/${id}`, {
                    method: 'DELETE'
                });


                if (response.ok) {
                    (async () => {
                        await fetchUsers();
                    })();
                }
            }
            )();

            Swal.fire({
                title: "Eliminado!",
                text: "El usuario ha sido eliminado",
                icon: "success"
            });
        }
    });
}

//Initialize
fetchUsers(); // Trae los usuarios

// Toggle btn
document.getElementById('toggle-btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('collapsed');
});*/