document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const submitBtn = document.querySelector('.submit-btn');

        // Validar contraseñas
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden. Por favor, revísalas.");
            return;
        }
        
        // Simple visual feedback
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creando cuenta...';
        submitBtn.style.opacity = '0.8';
        submitBtn.disabled = true;

        try {
            // Hacemos el POST al endpoint de registro
            const response = await fetch('/usuarios/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Inicializamos al usuario con valores por defecto para los demás campos
                body: JSON.stringify({ 
                    email, 
                    password,
                    dia_recarga: 1,      // Ejemplo de valores por defecto
                    saldo_total: 0, 
                    ultima_recarga: new Date()
                })
            });
            
            const data = await response.json();

            if (response.ok) {
                // Registro exitoso (Estado 200 OK o 201 Created)
                alert(`¡Cuenta creada con éxito! Ahora puedes iniciar sesión.`);
                // Redirigir al login
                window.location.href = "/"; 
            } else {
                // El registro falló (Ej. El email ya existe)
                alert(`Error al registrar: ${data.mensaje}`);
            }

        } catch (error) {
            console.error('Error en el registro:', error);
            alert("Ocurrió un error inesperado al conectar con el servidor.");
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;
        }
    });
});
