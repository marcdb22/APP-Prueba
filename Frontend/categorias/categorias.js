// ===============================
// Cargar categorías desde backend
// ===============================
async function cargarCategorias() {
    try {
        const res = await fetch("http://localhost:3000/categorias");
        return await res.json();
    } catch (error) {
        console.error("Error cargando categorías:", error);
        return [];
    }
}

// ===============================
// Mostrar lista de categorías
// ===============================
function mostrarCategorias(lista) {
    const contenedor = document.getElementById("lista-categorias");
    contenedor.innerHTML = "";

    lista.forEach(cat => {
        const item = document.createElement("div");
        item.classList.add("categoria-item");

        item.innerHTML = `
            <h3>${cat.nombre}</h3>
            <p>Límite: ${cat.limite}%</p>
        `;

        contenedor.appendChild(item);
    });
}

// ===============================
// Abrir modal manualmente
// ===============================
const btnNuevaCategoria = document.getElementById("btn-nueva-categoria");
if (btnNuevaCategoria) {
    btnNuevaCategoria.addEventListener("click", () => {
        document.getElementById("modal-categoria").classList.remove("hidden");
    });
}

// ===============================
// Cerrar modal
// ===============================
const btnCerrarModal = document.getElementById("cerrar-modal");
if (btnCerrarModal) {
    btnCerrarModal.addEventListener("click", () => {
        document.getElementById("modal-categoria").classList.add("hidden");
    });
}

// ===============================
// Crear categoría
// ===============================
const btnCrearCategoria = document.getElementById("crear-categoria");
if (btnCrearCategoria) {
    btnCrearCategoria.addEventListener("click", async () => {
        const nombre = document.getElementById("nombre-categoria").value;
        const limite = document.getElementById("limite-categoria").value;

        try {
            const res = await fetch("http://localhost:3000/categorias", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, limite })
            });

            if (res.ok) {
                document.getElementById("modal-categoria").classList.add("hidden");
                const categorias = await cargarCategorias();
                mostrarCategorias(categorias);
            }
        } catch (error) {
            console.error("Error al crear categoría:", error);
        }
    });
}

// ===============================
// Lógica principal al entrar
// ===============================
window.addEventListener("DOMContentLoaded", async () => {
    const categorias = await cargarCategorias();
    const modal = document.getElementById("modal-categoria");

    if (categorias.length === 0) {
        // No hay categorías → abrir modal automáticamente
        if (modal) modal.classList.remove("hidden");
    } else {
        // Sí hay categorías → mostrarlas
        mostrarCategorias(categorias);
    }
});
