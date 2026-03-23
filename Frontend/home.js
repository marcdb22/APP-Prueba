document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar si el usuario está autenticado
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
        // Si no hay usuario, redirigir al login
        window.location.href = 'index.html';
        return;
    }

    // 2. Poblar datos del usuario en la UI
    const welcomeUser = document.getElementById('welcomeUser');
    const userEmail = document.getElementById('userEmail');
    const balanceAmount = document.getElementById('balanceAmount');

    if (welcomeUser) welcomeUser.textContent = `¡Hola de nuevo, ${usuario.email.split('@')[0]}!`;
    if (userEmail) userEmail.textContent = usuario.email;
    if (balanceAmount) balanceAmount.textContent = `${usuario.saldo_total || 0.00}€`;

    // 3. Manejar el cierre de sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('usuario');
            window.location.href = 'index.html';
        });
    }

    // 4. Lógica de Navegación del Sidebar
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Quitar 'active' de todos los nav items
            navItems.forEach(i => i.classList.remove('active'));
            // 2. Añadir 'active' al seleccionado
            item.classList.add('active');

            // 3. Ocultar todas las secciones
            sections.forEach(s => s.classList.add('hidden'));
            
            // 4. CERRAR MODAL SI ESTÁ ABIERTO (Limpieza general)
            if (categoryModal) categoryModal.classList.add('hidden');
            
            // 5. Mostrar la sección correspondiente
            const targetId = `section-${item.id.replace('nav-', '')}`;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }

            // EXTRA: Si entramos en categorías, abrir automáticamente el popup de nueva categoría
            if (item.id === 'nav-categorias' && categoryModal) {
                categoryModal.classList.remove('hidden');
            }
        });
    });

    // 5. Gestión de Categorías
    const categoryModal = document.getElementById('categoryModal');
    const openModalBtn = document.getElementById('openCategoryModal');
    const closeModalBtn = document.getElementById('closeCategoryModal');
    const categoryForm = document.getElementById('categoryForm');
    const categoriesList = document.getElementById('categoriesList');

    // Abrir/Cerrar Modal
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            console.log('Abriendo modal de categorías');
            categoryModal.classList.remove('hidden');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Cerrando modal desde la X');
            categoryModal.classList.add('hidden');
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === categoryModal) {
            console.log('Cerrando modal al hacer clic fuera');
            categoryModal.classList.add('hidden');
        }
    });

    // También cerrar con la tecla Esc
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !categoryModal.classList.contains('hidden')) {
            categoryModal.classList.add('hidden');
        }
    });

    // Función para cargar categorías
    async function cargarCategorias() {
        try {
            const response = await fetch('/categorias');
            const data = await response.json();

            if (response.ok) {
                renderCategorias(data);
            } else {
                console.error('Error al cargar categorías:', data.error);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        }
    }

    // Función para renderizar categorías
    function renderCategorias(categorias) {
        if (!categoriesList) return;

        if (categorias.length === 0) {
            categoriesList.innerHTML = '<p style="color: #64748b; text-align: center; width: 100%; padding: 40px;">No tienes categorías creadas todavía.</p>';
            return;
        }

        categoriesList.innerHTML = categorias.map(cat => `
            <div class="category-card">
                <header>
                    <h4>${cat.nombre}</h4>
                    <span class="category-limit">${cat.limite}%</span>
                </header>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <div class="category-info">
                    <span>Gastado: 0.00€</span>
                    <span>Límite: ${cat.limite}%</span>
                </div>
            </div>
        `).join('');
    }

    // Manejar envío del formulario
    if (categoryForm) {
        categoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(categoryForm);
            const body = {
                nombre: formData.get('nombre'),
                limite: Number(formData.get('limite')),
                usuario_id: usuario._id
            };

            try {
                const response = await fetch('/categorias', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                const data = await response.json();

                if (response.ok) {
                    categoryModal.classList.add('hidden');
                    categoryForm.reset();
                    cargarCategorias(); // Recargar la lista
                } else {
                    alert('Error: ' + data.error);
                }
            } catch (error) {
                console.error('Error al crear categoría:', error);
                alert('Error de conexión con el servidor');
            }
        });
    }

    // Cargar categorías al entrar en la sección o al inicio
    document.getElementById('nav-categorias').addEventListener('click', cargarCategorias);
    
    // Carga inicial
    cargarCategorias();

    console.log('Dashboard cargado para:', usuario.email);
});
