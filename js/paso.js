// Fetch all categories to fill select field
async function fetchCategories() {
    const response = await fetch(categoriesEndpoint);
    const data = await response.json();
    return data;
}

async function fillCategoriesOnAddBookModal() {
    const data = await fetchCategories();
    const bookCategorySelect = document.getElementById('addBookCategory');
    bookCategorySelect.innerHTML = '';

    data.result.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id_categoria;
        option.text = category.nombre_cat;
        bookCategorySelect.appendChild(option);
    });
}

async function fillCategoriesOnEditBookModal() {
    const data = await fetchCategories();
    const bookCategorySelect = document.getElementById('editBookCategory');
    bookCategorySelect.innerHTML = '';

    data.result.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id_categoria;
        option.text = category.nombre_cat;
        bookCategorySelect.appendChild(option);
    });
}

/* async function fillCategoriesOnAddBookModal() {
    const categorias = await fetchCategories();
    const cargarCategorias = (selectElement) =>{
        categorias.result.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id_categoria; // Obtenemos el id
            option.textContent = category.nombre_cat; // Obtenemos el nombre
            selectElement.appendChild(option);
        });
    }
    // Carga las categorias en ambos select
    cargarCategorias(document.getElementById('editBookCategory'));
    cargarCategorias(document.getElementById('addBookCategory'));
} */

    fillCategoriesOnAddBookModal();

    // Funcion para cargar categorias en los select y modal
    async function booksCategoryModal() {
        try {
            const token = localStorage.getItem('token'); // Obtengo el token almacenado en localStorage
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'No estás logueado',
                    text: 'Por favor, inicia sesión.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html'; // Redirijo a login si no hay token
                });
                return;
            }

            const categoriesResponse = await fetch(categoriesEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const sessionValid = await sesionTokenError(categoriesResponse); // Validación de sesion y token en common.js
            if (!sessionValid) return;

            if (!categoriesResponse.ok) {
                throw new Error('Error al obtener las categorías');
            }

            const categorias = await categoriesResponse.json();

            const cargarCategorias = (selectElement) => {
                categorias.result.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id_categoria; // Obtenemos el id
                    option.textContent = category.nombre_cat; // Obtenemos el nombre
                    selectElement.appendChild(option);
                });
            };

            // Carga las categorias en ambos select
            if (categorias && categorias.result) {
                cargarCategorias(document.getElementById('editBookCategory'));
                cargarCategorias(document.getElementById('addBookCategory'));
            } else {
                throw new Error('Formato de categorías no válido');
            }

            console.log('en books categorias return :', categorias);
            return categorias;

        } catch (error) {
            console.error('Error al cargar categorías:', error);
            Swal.fire({
                icon: 'error',
                title: 'Se ha producido un error con las categorias',
                text: 'Por favor, intenta de nuevo.',
                confirmButtonText: 'OK'
            });
        }
    }
    //booksCategoryModal(); // borrar Llamada a la funcion

    // Manejar la apertura del modal desde el archivo de libros
document.addEventListener('DOMContentLoaded', () => {
    const openModalButton = document.getElementById('botonAdminCategory'); // ID del botón que abre el modal
    if (openModalButton) {
        openModalButton.addEventListener('click', () => {
            const adminCategoryModal = new bootstrap.Modal(document.getElementById('adminCategoryModal'));
            adminCategoryModal.show(); // Mostrar el modal al hacer clic en el botón
        });
    }
});