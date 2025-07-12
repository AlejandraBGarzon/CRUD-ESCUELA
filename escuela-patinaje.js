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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegister');
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const edadInput = document.getElementById('edad');
    const categoriaInput = document.getElementById('categoria');
    const tablaBody = document.getElementById('tablaBody');

    let registros = JSON.parse(localStorage.getItem('deportistas')) || [];

    registros.forEach((registro, index) => {
        agregarFilaATabla(registro, index);
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre = nombreInput.value.trim();
        const apellido = apellidoInput.value.trim();
        const edad = edadInput.value.trim();
        const categoria = categoriaInput.value.trim();

        // Validación de campos
        if (!nombre || !apellido || !edad || !categoria) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const soloLetras = /^[a-zA-Z\s]+$/;

        if (!soloLetras.test(nombre) || !soloLetras.test(apellido) || !soloLetras.test(categoria)) {
            alert('Nombre, apellido y categoría solo deben contener letras.');
            return;
        }

        const edadNumero = Number(edad);
        if (isNaN(edadNumero) || edadNumero < 1) {
            alert('La edad debe ser un número válido mayor o igual a 1.');
            return;
        }

        const nuevoRegistro = { nombre, apellido, edad: edadNumero, categoria };
        registros.push(nuevoRegistro);
        guardarRegistros();
        agregarFilaATabla(nuevoRegistro, registros.length - 1);
        form.reset();
    });

    function agregarFilaATabla(registro, index) {
        const fila = document.createElement('tr');
        fila.classList.add('fila-dato');

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

        tablaBody.appendChild(fila);

        const btnEditar = fila.querySelector('.btn-editar');
        const btnEliminar = fila.querySelector('.btn-eliminar');

        btnEditar.addEventListener('click', () => habilitarEdicion(index, fila));
        btnEliminar.addEventListener('click', () => eliminarFila(index));
    }

    function guardarRegistros() {
        localStorage.setItem('deportistas', JSON.stringify(registros));
    }

    function habilitarEdicion(index, fila) {
        const registro = registros[index];
        const celdas = fila.querySelectorAll('td');

        // Reemplazar celdas por inputs
        celdas[0].innerHTML = `<input type="text" value="${registro.nombre}" class="input-editar" id="edit-nombre-${index}">`;
        celdas[1].innerHTML = `<input type="text" value="${registro.apellido}" class="input-editar" id="edit-apellido-${index}">`;
        celdas[2].innerHTML = `<input type="number" value="${registro.edad}" min="1" class="input-editar" id="edit-edad-${index}">`;
        celdas[3].innerHTML = `<input type="text" value="${registro.categoria}" class="input-editar" id="edit-categoria-${index}">`;
        celdas[4].innerHTML = `
            <button class="btn-guardar">Guardar</button>
            <button class="btn-cancelar">Cancelar</button>
        `;

        // Botones
        const btnGuardar = celdas[4].querySelector('.btn-guardar');
        const btnCancelar = celdas[4].querySelector('.btn-cancelar');

        btnGuardar.addEventListener('click', () => guardarEdicion(index));
        btnCancelar.addEventListener('click', () => recargarTabla());
    }

    function guardarEdicion(index) {
        const nombre = document.getElementById(`edit-nombre-${index}`).value.trim();
        const apellido = document.getElementById(`edit-apellido-${index}`).value.trim();
        const edad = document.getElementById(`edit-edad-${index}`).value.trim();
        const categoria = document.getElementById(`edit-categoria-${index}`).value.trim();

        const soloLetras = /^[a-zA-Z\s]+$/;
        const edadNumero = Number(edad);

        if (!nombre || !apellido || !edad || !categoria) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        if (!soloLetras.test(nombre) || !soloLetras.test(apellido) || !soloLetras.test(categoria)) {
            alert('Nombre, apellido y categoría solo deben contener letras.');
            return;
        }

        if (isNaN(edadNumero) || edadNumero < 1) {
            alert('La edad debe ser un número mayor o igual a 1.');
            return;
        }

        registros[index] = { nombre, apellido, edad: edadNumero, categoria };
        guardarRegistros();
        recargarTabla();
    }

    function eliminarFila(index) {
        if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
            registros.splice(index, 1);
            guardarRegistros();
            recargarTabla();
        }
    }

    function recargarTabla() {
        tablaBody.innerHTML = '';
        registros.forEach((registro, i) => agregarFilaATabla(registro, i));
    }
});

