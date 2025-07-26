// =======================================
// =============== CRUD ==================
// =======================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegister');
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const edadInput = document.getElementById('edad');
    const categoriaInput = document.getElementById('categoria');
    const tablaBody = document.getElementById('tablaBody');

    const API_URL = 'http://localhost:3000/api/deportistas';
    let registros = [];
    let registrosFiltrados = []; // Registros que coinciden con el filtro
    let currentPage = 1;
    const rowsPerPage = 5;


    // ================================
    // CARGAR REGISTROS
    // ================================
    async function cargarRegistros() {
        const res = await fetch(API_URL);
        registros = await res.json();
        renderizarTabla();
    }

    // ================================
    // RENDERIZAR TABLA
    // ================================
    function renderizarTabla() {
        tablaBody.innerHTML = '';

        // Usar los filtrados si existen, si no usar todos
        const datos = registrosFiltrados.length ? registrosFiltrados : registros;

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginados = datos.slice(start, end);

        paginados.forEach((registro, index) => {
            agregarFilaATabla(registro, start + index);
        });

        renderizarPaginacion(datos.length);
    }


    // ================================
    // PAGINACIÓN - Botones de página
    // ================================

    function renderizarPaginacion(totalRegistros) {
        const totalPaginas = Math.ceil(totalRegistros / rowsPerPage);
        const paginacionContainer = document.getElementById('paginacion');
        paginacionContainer.innerHTML = '';

        // Botón anterior
        const btnPrev = document.createElement('button');
        btnPrev.textContent = 'Anterior';
        btnPrev.disabled = currentPage === 1;
        btnPrev.addEventListener('click', () => {
            currentPage--;
            renderizarTabla();
        });
        paginacionContainer.appendChild(btnPrev);

        // Botones de página
        for (let i = 1; i <= totalPaginas; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === currentPage) btn.classList.add('activo');
            btn.addEventListener('click', () => {
                currentPage = i;
                renderizarTabla();
            });
            paginacionContainer.appendChild(btn);
        }

        // Botón siguiente
        const btnNext = document.createElement('button');
        btnNext.textContent = 'Siguiente';
        btnNext.disabled = currentPage === totalPaginas;
        btnNext.addEventListener('click', () => {
            currentPage++;
            renderizarTabla();
        });
        paginacionContainer.appendChild(btnNext);
    }


    // ================================
    // BUSCADOR
    // ================================

    const buscadorInput = document.getElementById('buscador');


    buscadorInput.addEventListener('input', () => {
        const termino = buscadorInput.value.trim().toLowerCase();

        registrosFiltrados = registros.filter(registro =>
            registro.nombre.toLowerCase().includes(termino) ||
            registro.apellido.toLowerCase().includes(termino)
        );

        if (termino === '') {
            registrosFiltrados = []; // esto activa modo "mostrar todo"
        }

        currentPage = 1;
        renderizarTabla(); // sin argumento
    });



    // ================================
    // DATA SORRT - FLECHAS PARA ORDENAR
    // ================================

    let ordenActual = {
        columna: null,
        ascendente: true
    };

    document.querySelectorAll('th[data-col]').forEach(th => {
        th.addEventListener('click', () => {
            const columna = th.dataset.col;

            document.querySelectorAll('th[data-col]').forEach(h => h.classList.remove('asc', 'desc'));

            if (ordenActual.columna === columna) {
                ordenActual.ascendente = !ordenActual.ascendente;
            } else {
                ordenActual.columna = columna;
                ordenActual.ascendente = true;
            }

            // Aplica la clase visual según dirección
            th.classList.add(ordenActual.ascendente ? 'asc' : 'desc');

            // Determinar cuál arreglo ordenar
            const arregloOrdenar = registrosFiltrados.length > 0 ? registrosFiltrados : registros;

            arregloOrdenar.sort((a, b) => {
                let valA = a[columna];
                let valB = b[columna];

                if (!isNaN(valA) && !isNaN(valB)) {
                    valA = Number(valA);
                    valB = Number(valB);
                } else {
                    valA = valA.toString().toLowerCase();
                    valB = valB.toString().toLowerCase();
                }

                return ordenActual.ascendente
                    ? valA > valB ? 1 : -1
                    : valA < valB ? 1 : -1;
            });

            currentPage = 1;
            renderizarTabla(); // ¡ahora sí mostrará el arreglo ordenado!
        });
    });


    // ================================
    // AGREGAR NUEVO REGISTRO
    // ================================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = nombreInput.value.trim();
        const apellido = apellidoInput.value.trim();
        const edad = Number(edadInput.value.trim());
        const categoria = categoriaInput.value.trim();

        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;

        if (!nombre || !apellido || !edad || !categoria) {
            return alert('Por favor, completa todos los campos.');
        }

        if (!soloLetras.test(nombre) || !soloLetras.test(apellido) || !soloLetras.test(categoria)) {
            return alert('Nombre, apellido y categoría solo deben contener letras.');
        }

        const nuevoRegistro = { nombre, apellido, edad, categoria };

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoRegistro)
        });

        const creado = await res.json();
        registros.push(creado);
        renderizarTabla();

        form.reset();
    });

    // ================================
    // AGREGAR FILA A TABLA
    // ================================
    function agregarFilaATabla(registro, index) {
        const fila = document.createElement('tr');

        const claseCategoria = obtenerClaseCategoria(registro.categoria);

        fila.innerHTML = `
<td data-label="Nombre">
  <div class="usuario">
    <div class="avatar-icon ${claseCategoria}">
      <i class="fa-solid fa-user"></i>
    </div>
    <span>${registro.nombre}</span>
  </div>
</td>
<td data-label="Apellido">${registro.apellido}</td>
<td data-label="Edad">${registro.edad}</td>
<td data-label="Categoría"><span class="badge ${claseCategoria}">${registro.categoria}</span></td>
<td class="acciones-cell" data-label="Acciones"></td>
`;

        // Crear los íconos de editar y eliminar
        const editarBtn = document.createElement("i");
        editarBtn.className = "fas fa-pen btn-edit";
        editarBtn.title = "Editar";
        editarBtn.style.cursor = "pointer";
        editarBtn.dataset.index = index;
        editarBtn.addEventListener('click', () => habilitarEdicion(index, fila, registro._id));

        const eliminarBtn = document.createElement("i");
        eliminarBtn.className = "fas fa-trash btn-delete";
        eliminarBtn.title = "Eliminar";
        eliminarBtn.style.cursor = "pointer";
        eliminarBtn.dataset.index = index;
        eliminarBtn.addEventListener('click', () => eliminarRegistro(index, registro._id));

        // Agrega los íconos al último <td>
        const accionesTd = fila.querySelector(".acciones-cell");
        accionesTd.appendChild(editarBtn);
        accionesTd.appendChild(document.createTextNode(' ')); // espacio entre íconos
        accionesTd.appendChild(eliminarBtn);

        tablaBody.appendChild(fila);
    }

    function obtenerClaseCategoria(categoria) {
        const tipo = categoria.toLowerCase();
        if (tipo === 'infantil') return 'infantil';
        if (tipo === 'intermedia') return 'intermedia';
        if (tipo === 'juvenil') return 'juvenil';
        if (tipo === 'pre-juvenil') return 'prejuvenil';
        if (tipo === 'junior') return 'junior';
        if (tipo === 'senior') return 'senior';
        if (tipo === 'élite' || tipo === 'elite') return 'elite';
        return '';
    }


    // ================================
    // HABILITAR EDICIÓN
    // ================================
    function habilitarEdicion(index, fila, id) {
        const registro = registros[index];
        const celdas = fila.querySelectorAll('td');

        celdas[0].innerHTML = `<input type="text" value="${registro.nombre}" class="input-editar">`;
        celdas[1].innerHTML = `<input type="text" value="${registro.apellido}" class="input-editar">`;
        celdas[2].innerHTML = `<input type="number" value="${registro.edad}" min="1" class="input-editar">`;
        celdas[3].innerHTML = `
  <select class="editar-categoria input-editar">
    ${["Infantil", "Intermedia", "Juvenil", "Pre-Juvenil", "Junior", "Senior", "Élite"].map(cat => `
      <option value="${cat}" ${registro.categoria.toLowerCase() === cat.toLowerCase() ? 'selected' : ''}>${cat}</option>
    `).join("")}
  </select>
`;

        celdas[4].innerHTML = `
        <button type="button" class="btn-tabla btn-guardar">Guardar</button>
        <button type="button" class="btn-tabla btn-cancelar">Cancelar</button>
    `;

        // Botón GUARDAR
        celdas[4].querySelector('.btn-guardar').addEventListener('click', async () => {
            const nuevo = {
                nombre: celdas[0].querySelector('input').value.trim(),
                apellido: celdas[1].querySelector('input').value.trim(),
                edad: Number(celdas[2].querySelector('input').value.trim()),
                categoria: celdas[3].querySelector('select').value.trim()

            };

            const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;

            if (!nuevo.nombre || !nuevo.apellido || !nuevo.edad || !nuevo.categoria) {
                return alert('Por favor, completa todos los campos.');
            }

            if (!soloLetras.test(nuevo.nombre) || !soloLetras.test(nuevo.apellido) || !soloLetras.test(nuevo.categoria)) {
                return alert('Nombre, apellido y categoría solo deben contener letras.');
            }

            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevo)
            });

            const actualizado = await res.json();
            registros[index] = actualizado;
            renderizarTabla();
        });

        // Botón CANCELAR
        celdas[4].querySelector('.btn-cancelar').addEventListener('click', () => {
            fila.innerHTML = '';
            agregarFilaATabla(registro, index);
        });
    }

    
    // ================================
    // ELIMINAR REGISTRO
    // ================================
    async function eliminarRegistro(index, id) {
        if (!confirm('¿Seguro que quieres eliminar este registro?')) return;

        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        registros.splice(index, 1);
        renderizarTabla();
    }

    // ================================
    // CARGAR DATOS INICIALMENTE
    // ================================
    cargarRegistros();
});

