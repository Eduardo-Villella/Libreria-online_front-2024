const baseUrl = 'http://localhost:3000/api';
const booksEndpoint = `${baseUrl}/books`;
const categoriesEndpoint = `${baseUrl}/categories`;

if (window.location.pathname.includes('admin_books.html')) { // Codigo especifico para la pagina de administracion
   
// Funcion para VER TODOS los Libros
    document.addEventListener('DOMContentLoaded', async function () {
        try {
            const token = localStorage.getItem('token'); // Obtengo el token almacenado en localStorage
            console.log('en books.js, datos del token y tipo de datos', token, typeof(token));//borrar

            if (!token) { // Verifico si el token existe
                Swal.fire({
                    icon: 'error',
                    title: 'No estás logueado',
                    text: 'Por favor, inicia sesión.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    localStorage.removeItem('token'); // cerrar sesion
                    window.location.href = 'login.html'; // Redirijo a login si no hay token
                })
                return;
            }

            const booksResponse = await fetch(booksEndpoint, { // Si hay token se solicitan todos los libros
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const sessionValid = await sesionTokenError(booksResponse);// Funcion en common.js para manejar cualquier error de token en la respuesta
            if (!sessionValid) return;

            // Si no hay errores, continua con el codigo
            console.log('en front books.js: Respuesta al obtener libros en booksResponse:', booksResponse); // borrar Log de la respuesta de LIBROS
            const data = await booksResponse.json();
            console.log('en front users.js: Datos de los libros en data:', data); //borrar Log de los datos de los libros
            const booksTableBody = document.getElementById('booksTableBody'); // Obtengo el cuerpo de la tabla
            booksTableBody.innerHTML = ''; // Limpia cualquier contenido previo

            /* Saco: data-bs-toggle="modal" data-bs-target="#viewBookModal", de los atributos del boton de viewBook, que esta a continuacion. para manejar
            manualmente desde la funcion viewBook la apertura y cierre del modal y que no sea Bootstrap lo maneje (evita conflictos de doble manejo asi) */

            data.result.forEach(book => { // Itera sobre los libros y crea las filas de la tabla
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="viewBook(${book.id_libros})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button data-id="${book.id_libros}" class="btn btn-warning btn-sm editar-btn" >
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id_libros})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                    <td><img src="${baseUrl}/4.Upload/books/${book.imagen_link}" alt="Imagen de ${book.nombre}" style="width: 50px; height: 50px; border-radius: 2%;"></td>
                    <td><a href="${book.imagen_link}" target="_blank">${book.imagen_link}</a></td>
                    <td>${book.id_libros}</td>
                    <td>${book.nombre}</td>
                    <td>${book.nombre_cat}</td>
                    <td>${book.editorial}</td>
                    <td>${formatCurrency(book.precio)}</td>
                    <td>${book.stock}</td>
                    <td>${book.descripcion}</td>
                    <td>${book.status}</td>
                `;
                booksTableBody.appendChild(tr);
            });
            
        } catch (error) {
            console.error('en books.js viewAll: Error al verificar el token:', error);//borrar
            Swal.fire({
                icon: 'error',
                title: 'Se ha producido un error',
                text: 'Por favor, intenta de nuevo.',
                confirmButtonText: 'OK'
            }).then(() => {
                localStorage.removeItem('token'); // cerrar sesion
                window.location.href = 'login.html'; // Redirijo a login en caso de error
            });
        }

    });
// Fin funcion ver todos los libros

// ------ Funcion Ver un libro en particular al final de este archivo fuera de administradores ----- //

// -- Funcion Categorias editar y agregar libro, y Administrar categorias desde: admin_categoriesModal.html y categoriesModal.js -- //
    document.addEventListener('DOMContentLoaded', async () => { // Esperar a que se carguen las categorias antes de proceder
        console.log('1 books.js en domContentLoaded BOTON MODAL CATEGORIAS DOM completamente cargado y parseado'); // borrar Verificar que se cargó el DOM
        // Cargar el contenido del modal dinamicamente
        const openModalButton = document.getElementById('botonAdminCategory'); // ID del botón que abre el modal
        console.log('2 books.js en domContentLoaded BOTON MODAL CATEGORIAS Buscando botón con ID "botonAdminCategory"');// borrar
        if (openModalButton) {
            console.log('3 books.js en domContentLoaded BOTON MODAL CATEGORIAS Botón encontrado:', openModalButton); // borrar Verificar si el botón fue encontrado
            openModalButton.addEventListener('click', async () => {
                console.log('4 books.js en domContentLoaded BOTON MODAL CATEGORIAS Botón "botonAdminCategory" fue clicado cargando modal...');// borrar
                await initializeModal()// LLama la funcion en categoriesModal.js desde el boton en admin_books.html
                // Mostrar el modal despues de cargarlo
                const adminCategoryModalElement = document.getElementById('adminCategoryModal');
                console.log('5 books.js en domContentLoaded BOTON MODAL CATEGORIAS segundo buscando modal con ID "adminCategoryModal"');// borrar
                if (adminCategoryModalElement) {
                    console.log('6 books.js en domContentLoaded BOTON MODAL CATEGORIAS Modal encontrado:', adminCategoryModalElement); // borrar Verificar si el modal fue encontrado
                    const adminCategoryModal = new bootstrap.Modal(adminCategoryModalElement);
                    console.log('7 books.js en domContentLoaded BOTON MODAL CATEGORIAS Instanciando modal con bootstrap.Modal:', adminCategoryModal); // borrar Verificar la creación del modal
                    adminCategoryModal.show(); // Mostrar el modal al hacer clic en el botón
                    console.log('8 books.js en domContentLoaded BOTON MODAL CATEGORIAS Mostrando el modal');// borrar

                } else {// borrar
                    console.log('9 books.js en domContentLoaded BOTON MODAL CATEGORIAS Modal con ID "adminCategoryModal" no encontrado');// borrar
                }// borrar
            });

        } else {//borrar
            console.log('10 books.js en domContentLoaded BOTON MODAL CATEGORIAS Botón con ID segunda vez openModalButton "botonAdminCategory" no encontrado');//borrar
        }// borrar
        // fin abrir modal categorias    
    
    // Funcion para EDITAR un Libro
        try {
            const editBookCategorySelect = document.getElementById('editBookCategory');
            if (editBookCategorySelect) {
                await cargarCategoriasEnSelect(editBookCategorySelect);
                console.log('en books.js, editBook , cargarCategorySelect: Select: ', editBookCategorySelect);//borrar
            }
       
            async function cargarFormEdit(id) {
                try{
                    const token = localStorage.getItem('token'); // Obtengo el token almacenado en localStorage
                    console.log('en books.js, datos del token y tipo de datos', token, typeof(token));//borrar

                    if (!token) { // Verifico si el token existe
                        Swal.fire({
                            icon: 'error',
                            title: 'No estás logueado',
                            text: 'Por favor, inicia sesión.',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            localStorage.removeItem('token'); // cerrar sesion
                            window.location.href = 'login.html'; // Redirijo a login si no hay token
                        })
                        return;
                    }

                    const respuesta = await fetch(`${booksEndpoint}/${id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })

                    if (!respuesta.ok){
                        throw new Error('Error al obtener los datos del libro')
                    }

                    const libro = await respuesta.json();
                    console.log('en books.js, editBook, despues de fetch libro: ', libro);//borrar

                    const selectCategorias = document.getElementById('editBookCategory');
                    console.log('en books.js, editBook, selectCategorias: ', selectCategorias);//borrar
                    if (!selectCategorias) {
                        throw new Error('El select de categorías no se ha encontrado');
                    }

                    const categories = await cargarCategoriasEnSelect(selectCategorias);
                    console.log('en books.js, editBook, categories: ', categories);//borrar
                    
                    selectCategorias.innerHTML = '';
                    categories.result.forEach(categorie =>{
                        const option = document.createElement('option');
                        option.value = categorie.id_categoria;
                        option.text = categorie.nombre_cat;
                        if (option.value == libro.categoria_id){
                            option.setAttribute('selected', 'selected')
                        }
                        selectCategorias.appendChild(option);
                    })

                    document.getElementById('editar-id').value = libro.id_libros
                    document.getElementById('bookTitle1').value = libro.nombre
                    document.getElementById('bookEditorial1').value = libro.editorial
                    document.getElementById('bookPrice1').value = parseFloat(libro.precio) 
                    document.getElementById('bookStock1').value = libro.stock
                    document.getElementById('bookDescription1').value = libro.descripcion

                    // Load image book preview
                    const imagePreview = document.getElementById('image-preview-edit');
                    if (libro.imagen) {
                        imagePreview.src = libro.imagen;
                        imagePreview.style.display = 'block';
                    } else {
                        imagePreview.style.display = 'none';
                    }

                    const modal = document.getElementById('editBookModal');
                    const modalBootstrap = new bootstrap.Modal(modal);
                    modalBootstrap.show();

                }catch(error){
                    console.error('Error al cargar los datos del libro', error);
                }
            }
            document.getElementById('editBookForm').addEventListener('submit', async (e) => {
                e.preventDefault();


                const id = document.getElementById('editar-id').value;
                // const id_libro = document.getElementById('editar-id');
                //const id = id_libro ? id_libro.value : null;
                const titulo = document.getElementById('bookTitle1').value;
                const selectCategorias = document.getElementById('editBookCategory');
                const categorias = Array.from(selectCategorias.selectedOptions).map(option => option.value);
                const editorial = document.getElementById('bookEditorial1').value;
                const precio = document.getElementById('bookPrice1').value;
                const stock = document.getElementById('bookStock1').value;
                const descripcion = document.getElementById('bookDescription1').value;
                const imagen = document.getElementById('editBookImage').files[0];

                // borrar Debugging: Print values to console
                console.log({
                    id,
                    titulo,
                    categorias,
                    editorial,
                    precio,
                    stock,
                    descripcion,
                    imagen
                });

                const formData = new FormData();
                //formData.append('id', id)
                formData.append('nombre', titulo);
                formData.append('editorial', editorial);
                formData.append('precio', parseInt(precio));
                formData.append('categoria_id', selectCategorias.value);
                formData.append('stock', parseInt(stock));
                formData.append('descripcion', descripcion);

                if (imagen) {
                    formData.append('imagen', imagen);
                }

                try {
                    const response = await fetch(`${booksEndpoint}/${id}`, {
                        method: 'PUT',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    // Log the response status and body
                    console.log('Response status:', response.status);
                    const responseBody = await response.text();
                    console.log('Response body:', responseBody);

                    if (responseBody.ok) {
                        Swal.fire({
                            title: "Libro modificado",
                            text: "El libro ha sido modificado correctamente",
                            icon: "success"
                        }).then(async() => {
                            await fetchBooks().then(async() => {
                                await addEventEdit();
                            });
                            document.querySelector('#editBookModal .btn-close').click();
                            document.getElementById('image-preview-edit').style.display = 'none';
                            e.target.reset();
                        });
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: `Ha ocurrido un error: ${responseBody}`,
                            icon: "error"
                        });
                        console.error('Error:', responseBody);
                    }

                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: `Error en la solicitud: ${error.message}`,
                        icon: "error"
                    });
                    console.error('Error:', error);
                }
            });


            // Preview Image loaded
            document.getElementById('bookImage').addEventListener('change', function () {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.getElementById('image-preview').src = e.target.result;
                        document.getElementById('image-preview').style.display = 'block';
                    }
                    reader.readAsDataURL(file);
                } else {
                    document.getElementById('image-preview').src = '';
                    document.getElementById('image-preview').style.display = 'none';
                }
            });

            document.getElementById('editBookImage').addEventListener('change', function () {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.getElementById('image-preview-edit').src = e.target.result;
                        document.getElementById('image-preview-edit').style.display = 'block'
                    }
                    reader.readAsDataURL(file);
                } else {
                    document.getElementById('image-preview-edit').src = '';
                    document.getElementById('image-preview-edit').style.display = 'none';
                }
            });

            // Initialize
            document.addEventListener('click', async (e) => {
                if (e.target.closest('.editar-btn')) {  // Delegacion de eventos
                    const boton = e.target.closest('.editar-btn');  // Selecciona el boton
                    const id = boton.getAttribute('data-id');  // Obtiene el ID del libro
                    await cargarFormEdit(id);  // Llama a la funcion de edicion
                }
            });


        // Add a new book
            document.getElementById('addBookForm').addEventListener('submit', async (e) => {
                e.preventDefault();

                const addBookCategorySelect = document.getElementById('addBookCategory');
                if (addBookCategorySelect) {
                    await cargarCategoriasEnSelect(addBookCategorySelect);
                    console.log('en books.js, editBook , cargarCategorySelect: addBookCategorySelect: ', addBookCategorySelect);//borrar
                }

                const formData = new FormData(e.target);
                const response = await fetch(booksEndpoint, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    Swal.fire({
                        title: "Libro creado",
                        text: "El libro ha sido guardado correctamente",
                        icon: "success"
                    }).then(() => {
                        fetchBooks().then(()=>{
                            addEventEdit();
                        })
                        document.querySelector('#addBookModal .btn-close').click();
                        document.getElementById('image-preview').style.display = 'none';
                        e.target.reset();
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: `ah ocurrido algun error`,
                        icon: "error"
                    });

                    console.log(await response.json());
                }
            });


        // Delete book
            async function deleteBook(id) {
                Swal.fire({
                    title: `¿Esta seguro que desea eliminar el registro con id: ${id}?`,
                    text: "este cambio no sera reversible!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si, Eliminarlo!"
                }).then((result) => {
                    if (result.isConfirmed) {

                        (async () => {
                            const response = await fetch(`${booksEndpoint}/${id}`, {
                                method: 'DELETE'
                            });

                            if (response.ok) {
                                (async () => {
                                    await fetchBooks();
                                })();
                            }
                        }
                        )();

                        Swal.fire({
                            title: "Eliminado!",
                            text: "El libro ha sido eliminado",
                            icon: "success"
                        });
                    }
                });
            }

        } catch (error) {
            console.error('en books.js , categorias: Error al cargar categorias en los select:', error);
        }

    });

}

// Codigo comun para las paginas de administracion y de catalogo
// Funcion para VER un libro especifico
async function viewBook(id, isAdmin = false) {
    try {
        const bookResponse = await fetch(`${booksEndpoint}/${id}`);
        
        if (!bookResponse.ok) {  // Verifica si la respuesta es exitosa
            throw new Error(`Error al obtener el libro: ${bookResponse.status}`);
        }

        const book = await bookResponse.json();
        console.log(book);

        // Actualizar los elementos del DOM con los datos del libro
        document.getElementById('viewBookID').innerText = book.id_libros;
        document.getElementById('viewBookName').innerText = book.nombre;
        document.getElementById('viewBookCategory').innerText = book.nombre_cat;
        document.getElementById('viewBookPublisher').innerText = book.editorial;
        document.getElementById('viewBookPrice').innerText = formatCurrency(book.precio);
        document.getElementById('viewBookStock').innerText = book.stock;
        document.getElementById('viewBookDescription').innerText = book.descripcion;
        document.getElementById('viewBookStatus').innerText = book.status;
        document.getElementById('viewBookImagen').innerHTML = `<img src="${baseUrl}/4.Upload/books/${book.imagen_link}">`;
        document.getElementById('viewBookImagenName').innerText = book.imagen_link;

        //$('#viewBookModal').modal('show'); // Muestra el modal usando JQuery
        
        const modal = new bootstrap.Modal(document.getElementById('viewBookModal')); // Muestra el modal usando Bootstrap 5
        modal.show();

        // Si es administrador, muestra controles adicionales (opcional)
        if (isAdmin) {
            // Agregar opciones adicionales para administracion
            document.getElementById('adminControls').style.display = 'block';
        }

    } catch (error) {
        console.error('Error al visualizar el libro:', error);
        alert('Se ha producido un error al intentar obtener los detalles del libro.');
    }

}

// Funcion para manejar precios en Argentina (viewBook, editBook y addBook)
function formatCurrency(value) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(value);
}

