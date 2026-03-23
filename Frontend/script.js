document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('error-msg');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = document.querySelector('.submit-btn');
        
        // Simple visual feedback
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Cargando...';
        submitBtn.style.opacity = '0.8';
        submitBtn.disabled = true;
        
        // Ocultar mensaje de error previo
        if (errorMsg) {
            errorMsg.classList.add('hidden');
            errorMsg.textContent = '';
        }

        try {
            // Hacemos el POST al endpoint de login
            const response = await fetch('/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();

            if (response.ok) {
                // Login exitoso (Estado 200 OK)
                console.log(`¡Bienvenido! Has iniciado sesión correctamente. Saldo: ${data.usuario.saldo_total}€`);
                
                // GUARDAR USUARIO EN LOCALSTORAGE
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                
                // Redirigir al HOME directamente
                window.location.href = "home.html"; 
            } else {
                // El usuario o la contraseña falló (Ej. 401 Unauthorize o 404 Not Found)
                if (errorMsg) {
                    errorMsg.textContent = data.mensaje || "Error al iniciar sesión";
                    errorMsg.classList.remove('hidden');
                }
                console.error(`Error: ${data.mensaje}`);
            }
        } catch (error) {
            console.error('Error en el login:', error);
            if (errorMsg) {
                errorMsg.textContent = "Error de conexión con el servidor.";
                errorMsg.classList.remove('hidden');
            }
        } finally {
            // Reset button whether it failed or was successful
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;
        }
    });
});
