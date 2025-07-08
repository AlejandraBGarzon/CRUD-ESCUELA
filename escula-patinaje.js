// Esta función se ejecuta apenas se carga la página
window.onload = function () {
    // Revisamos si hay datos guardados en localStorage
    const usuarioGuardado = localStorage.getItem("usuario");
    const claveGuardada = localStorage.getItem("clave");

    // Si existen, los colocamos automáticamente en los campos de entrada
    if (usuarioGuardado && claveGuardada) {
        document.getElementById('nombre').value = usuarioGuardado;
        document.getElementById('clave').value = claveGuardada;
    }
};

function validar() {
    // Obtenemos los valores que el usuario ingresó en los campos
    const usuario = document.getElementById('nombre').value.trim();
    const clave = document.getElementById('clave').value.trim();

    // Validar si los campos están vacíos
    if (usuario === "" || clave === "") {
        alert("Por favor ingresa tu usuario y clave para continuar.");
        return; // Detiene la función
    }

    // Convertimos el usuario a minúsculas para comparar sin importar si escribió Ale o ale, etc.
    const usuarioLower = usuario.toLowerCase();

    // Validamos credenciales permitidas
    const credencialesValidas = (
        (usuarioLower === "ale" && clave === "ber123") ||
        (usuarioLower === "cristian" && clave === "cris@90") ||
        (usuarioLower === "leidy" && clave === "Le1dy@09") ||
        (usuarioLower === "jesica" && clave === "j123")
    );

    if (credencialesValidas) {
        // Guardar usuario y clave en localStorage
        localStorage.setItem("usuario", usuario);
        localStorage.setItem("clave", clave);

        // Redirigir a la página de información
        window.location.href = "#"; // Se cambia al tener html de segunda página
    } else {
        alert("Usuario o clave incorrectos. Intenta nuevamente.");
    }
}
