// =======================================
// =============== LOGIN =================
// =======================================

// // Esta función se ejecuta apenas se carga la página
// window.onload = function () {
//     // Revisamos si hay datos guardados en localStorage
//     const usuarioGuardado = localStorage.getItem("usuario");
//     const claveGuardada = localStorage.getItem("clave");

//     // Si existen, los colocamos automáticamente en los campos de entrada
//     if (usuarioGuardado && claveGuardada) {
//         document.getElementById('nombre').value = usuarioGuardado;
//         document.getElementById('clave').value = claveGuardada;
//     }
// };

// function validar() {
//     // Obtenemos los valores que el usuario ingresó en los campos
//     const usuario = document.getElementById('nombre').value.trim();
//     const clave = document.getElementById('clave').value.trim();

//     // Validar si los campos están vacíos
//     if (usuario === "" || clave === "") {
//         alert("Por favor ingresa tu usuario y clave para continuar.");
//         return; // Detiene la función
//     }

//     // Convertimos el usuario a minúsculas para comparar sin importar si escribió Ale o ale, etc.
//     const usuarioLower = usuario.toLowerCase();

//     // Validamos credenciales permitidas
//     const credencialesValidas = (
//         (usuarioLower === "ale" && clave === "ber123") ||
//         (usuarioLower === "cristian" && clave === "cris@90") ||
//         (usuarioLower === "leidy" && clave === "Le1dy@09") ||
//         (usuarioLower === "jesica" && clave === "j123")
//     );

//     if (credencialesValidas) {
//         // Guardar usuario y clave en localStorage
//         localStorage.setItem("usuario", usuario);
//         localStorage.setItem("clave", clave);

//         // Redirigir a la página de información
//         window.location.href = "#"; // Se cambia al tener html de segunda página
//     } else {
//         alert("Usuario o clave incorrectos. Intenta nuevamente.");
//     }
// }


// =======================================
// =============== SLIDES ================
// =======================================

let currentSlide = 0;
const slides = document.getElementById('slides');
const totalSlides = document.querySelectorAll('.slide').length;

function updateSlide() {
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlide();
}

// Cambio automático cada 5 segundos
setInterval(nextSlide, 5000);


// =======================================
// =============== CRUD ==================
// =======================================

// Espera a que todo el contenido del HTML esté cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Se obtienen los elementos del formulario y la tabla
    const form = document.getElementById('formRegister');
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const edadInput = document.getElementById('edad');
    const categoriaInput = document.getElementById('categoria');
    const tablaBody = document.getElementById('tablaBody');

    // Dirección base de la API donde se guardan los datos en MongoDB
    const API_URL = 'http://localhost:3000/api/deportistas';

    // Arreglo donde se guardan temporalmente los registros cargados desde la base de datos
    let registros = [];

    // ================================
    // CARGAR REGISTROS DESDE LA API
    // ================================

    // Esta función obtiene los datos desde MongoDB y los muestra en la tabla
    async function cargarRegistros() {
        const res = await fetch(API_URL); // Se hace una petición GET a la API
        registros = await res.json();     // Se guardan los datos recibidos en el arreglo
        renderizarTabla();                // Se actualiza la tabla en pantalla
    }

    // ================================
    // MOSTRAR DATOS EN LA TABLA
    // ================================

    // Esta función limpia la tabla y vuelve a agregar todas las filas
    function renderizarTabla() {
        tablaBody.innerHTML = ''; // Limpia el contenido actual de la tabla
        registros.forEach((registro, index) => {
            agregarFilaATabla(registro, index); // Agrega cada fila usando otra función
        });
    }

    // ================================
    // AGREGAR NUEVO REGISTRO
    // ================================

    // Al enviar el formulario, se crea un nuevo deportista y se guarda en la base de datos
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evita que el formulario recargue la página

        // Se obtienen los valores del formulario
        const nombre = nombreInput.value.trim();
        const apellido = apellidoInput.value.trim();
        const edad = Number(edadInput.value.trim());
        const categoria = categoriaInput.value.trim();

        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Expresión regular para validar solo letras

        // Verifica que todos los campos estén llenos
        if (!nombre || !apellido || !edad || !categoria) {
            return alert('Por favor, completa todos los campos.');
        }

        // Verifica que los campos de texto no tengan números u otros caracteres
        if (!soloLetras.test(nombre) || !soloLetras.test(apellido) || !soloLetras.test(categoria)) {
            return alert('Nombre, apellido y categoría solo deben contener letras.');
        }

        // Se crea un objeto con los datos del nuevo deportista
        const nuevoRegistro = { nombre, apellido, edad, categoria };

        // Se envía a la base de datos con una petición POST
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoRegistro)
        });

        // Se agrega el nuevo deportista a la tabla y al arreglo local
        const creado = await res.json();
        registros.push(creado);
        agregarFilaATabla(creado, registros.length - 1);
        form.reset(); // Limpia el formulario
    });

    // ================================
    // AGREGAR FILA A LA TABLA
    // ================================

    // Esta función crea una nueva fila en la tabla con los datos del deportista
    function agregarFilaATabla(registro, index) {
        const fila = document.createElement('tr');
        fila.classList.add('fila-dato');

        // Se insertan los datos del deportista y los botones de editar y eliminar
        fila.innerHTML = `
            <td class="celda">${registro.nombre}</td>
            <td class="celda">${registro.apellido}</td>
            <td class="celda">${registro.edad}</td>
            <td class="celda">${registro.categoria}</td>
            <td class="celda">
                <button class="btn-editar">Editar</button>
                <button class="btn-eliminar">Eliminar</button>
            </td>
        `;

        tablaBody.appendChild(fila); // Se agrega la fila a la tabla

        // Se conectan los botones a sus respectivas funciones
        const btnEditar = fila.querySelector('.btn-editar');
        const btnEliminar = fila.querySelector('.btn-eliminar');

        btnEditar.addEventListener('click', () => habilitarEdicion(index, fila, registro._id));
        btnEliminar.addEventListener('click', () => eliminarRegistro(index, registro._id));
    }

    // ================================
    // HABILITAR EDICIÓN EN FILA
    // ================================

    // Esta función permite editar directamente los datos de una fila
    function habilitarEdicion(index, fila, id) {
        const registro = registros[index];
        const celdas = fila.querySelectorAll('td');

        // Reemplaza los textos por campos de entrada para editar
        celdas[0].innerHTML = `<input type="text" value="${registro.nombre}" class="input-editar">`;
        celdas[1].innerHTML = `<input type="text" value="${registro.apellido}" class="input-editar">`;
        celdas[2].innerHTML = `<input type="number" value="${registro.edad}" min="1" class="input-editar">`;
        celdas[3].innerHTML = `<input type="text" value="${registro.categoria}" class="input-editar">`;
        celdas[4].innerHTML = `
            <button class="btn-guardar">Guardar</button>
            <button class="btn-cancelar">Cancelar</button>
        `;

        // Botón para guardar los cambios
        celdas[4].querySelector('.btn-guardar').addEventListener('click', async () => {
            const nuevo = {
                nombre: celdas[0].querySelector('input').value.trim(),
                apellido: celdas[1].querySelector('input').value.trim(),
                edad: Number(celdas[2].querySelector('input').value.trim()),
                categoria: celdas[3].querySelector('input').value.trim()
            };

            // Enviar los nuevos datos a la API con PUT
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevo)
            });

            const actualizado = await res.json();
            registros[index] = actualizado;
            renderizarTabla(); // Vuelve a mostrar la tabla actualizada
        });

        // Botón para cancelar la edición y volver a mostrar la tabla original
        celdas[4].querySelector('.btn-cancelar').addEventListener('click', renderizarTabla);
    }

    // ================================
    // ELIMINAR UN REGISTRO
    // ================================

    // Esta función elimina un deportista de la base de datos y de la tabla
    async function eliminarRegistro(index, id) {
        if (!confirm('¿Seguro que quieres eliminar este registro?')) return;

        // Se envía una solicitud DELETE a la API
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        // Se elimina del arreglo local y se actualiza la tabla
        registros.splice(index, 1);
        renderizarTabla();
    }

    // ================================
    // INICIO: CARGAR DATOS
    // ================================

    cargarRegistros(); // Al cargar la página, se traen los datos desde la base
});
