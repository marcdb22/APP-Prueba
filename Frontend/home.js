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
    const categoryModal = document.getElementById('modal-categoria');

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

            // EXTRA: Si entramos en categorías, cargar datos
            if (item.id === 'nav-categorias') {
                cargarCategorias();
            }
        });
    });

    // 5. Gestión de Categorías
    const openModalBtn = document.getElementById('btn-nueva-categoria');
    const closeModalBtn = document.getElementById('cerrar-modal');
    const categoryForm = document.getElementById('categoryForm');
    const categoriesList = document.getElementById('lista-categorias');

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
            // Si no hay categorías, abrir el modal automáticamente (según nueva lógica)
            if (categoryModal) categoryModal.classList.remove('hidden');
            return;
        }

        categoriesList.innerHTML = categorias.map(cat => `
            <div class="categoria-item">
                <h3>${cat.nombre}</h3>
                <p>Límite: ${cat.limite}%</p>
            </div>
        `).join('');
    }

    // Manejar envío del formulario
    const btnCrearCategoria = document.getElementById('crear-categoria');
    if (btnCrearCategoria) {
        btnCrearCategoria.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre-categoria').value;
            const limite = Number(document.getElementById('limite-categoria').value);
            
            if (!nombre || !limite) {
                alert('Por favor, rellena todos los campos');
                return;
            }

            const body = {
                nombre,
                limite,
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
