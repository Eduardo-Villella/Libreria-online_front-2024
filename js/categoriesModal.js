// 1. Función para cargar categorías en un select
async function cargarCategoriasEnSelect(selectElement) {
    try {
        const response = await fetch(categoriesEndpoint);
        const categorias = await response.json();

        if (!categorias || !categorias.result) {
            throw new Error('Formato de categorías no válido');
        }

        selectElement.innerHTML = ''; // Limpiar el select antes de cargar nuevas categorías

        categorias.result.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id_categoria; // ID de la categoría
            option.textContent = category.nombre_cat; // Nombre de la categoría
            selectElement.appendChild(option);
        });

        return categorias;

    } catch (error) {
        console.error('Error al cargar categorías en el select:', error);
    }
}

// 2. Función para cargar la lista de categorías en el modal (listado en ul)
async function loadCategories() {
    try {
        const response = await fetch(categoriesEndpoint);
        const categories = await response.json();
        console.log('en categoriesModal.js, categories fetch : ', categories); // borrar Para depuración

        const categoryList = document.getElementById('categoryList');
        if (categoryList && categories.result) {
            categoryList.innerHTML = ''; // Limpiar lista existente

            categories.result.forEach(category => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerText = `ID: ${category.id_categoria}, Nombre: ${category.nombre_cat}`;
                listItem.addEventListener('click', () => {
                    document.getElementById('categoryName').value = category.nombre_cat;
                    document.getElementById('categoryId').value = category.id_categoria;
                });
                categoryList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

// 3. Manejar la creación y edición de categorías
async function setupCategoryForm() {
    const form = document.getElementById('adminCategoryForm');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const categoryId = formData.get('id_categoria');
            const method = categoryId ? 'PUT' : 'POST'; // Usar PUT si hay ID, POST si no

            try {
                const response = await fetch(`${categoriesEndpoint}${categoryId ? '/' + categoryId : ''}`, {
                    method: method,
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al guardar la categoría');
                }

                await loadCategories(); // Recargar categorías después de agregar/editar
                event.target.reset(); // Limpiar el formulario
            } catch (error) {
                console.error('Error al guardar la categoría:', error);
            }
        });
    } else {
        console.log('en categoriesModal.js: Formulario de categorías no cargado');
    }
}

// 4. Inicializar el modal y cargar el contenido del modal de categorias desde admin_categoriesModal.html
async function initializeModal() {
    await loadModalContent(); // Cargar el contenido del modal desde el HTML dinamico
    setupCategoryForm(); // Configura el formulario de categorías una vez cargado
    const adminCategoryModalElement = document.getElementById('adminCategoryModal');

    if (adminCategoryModalElement) {
        // Cargar las categorías cuando el modal se abra
        adminCategoryModalElement.addEventListener('shown.bs.modal', async () => {
            await loadCategories();
        });
    }
}
// 4.1 Carga el modal en admin_books.html
async function loadModalContent() {
    try {
        const response = await fetch('admin_categoriesModal.html'); // Ruta al archivo HTML del modal
        const modalHtml = await response.text();
        document.getElementById('modalCategoriesContainer').innerHTML = modalHtml; // Insertar el HTML del modal en el DOM
        console.log('Modal de categorías cargado dinámicamente');

    } catch (error) {
        console.error('Error al cargar el modal de categorías:', error);
    }
}

// 5. Cargar categorías en los select de libros (cuando sea necesario)
document.addEventListener('DOMContentLoaded', async () => {
    const addBookCategorySelect = document.getElementById('addBookCategory');
    const editBookCategorySelect = document.getElementById('editBookCategory');

    if (addBookCategorySelect) {
        await cargarCategoriasEnSelect(addBookCategorySelect);
    }

    if (editBookCategorySelect) {
        await cargarCategoriasEnSelect(editBookCategorySelect);
    }
});

