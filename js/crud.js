document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegister');
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const edadInput = document.getElementById('edad');
    const categoriaInput = document.getElementById('categoria');
    const tablaBody = document.getElementById('tablaBody');
    const buscadorInput = document.getElementById('buscador');
    const rowsPerPage = 5;
    let currentPage = 1;
    let registros = obtenerDesdeLocalStorage();
    let registrosFiltrados = [];

    function guardarEnLocalStorage() {
        localStorage.setItem('deportistas', JSON.stringify(registros));
    }

    function obtenerDesdeLocalStorage() {
        return JSON.parse(localStorage.getItem('deportistas')) || [];
    }

    function renderizarTabla() {
        tablaBody.innerHTML = '';
        const datos = registrosFiltrados.length ? registrosFiltrados : registros;
        const start = (currentPage - 1) * rowsPerPage;
        const paginados = datos.slice(start, start + rowsPerPage);

        paginados.forEach((registro, index) => {
            agregarFilaATabla(registro, start + index);
        });

        renderizarPaginacion(datos.length);
    }

    function renderizarPaginacion(total) {
        const contenedor = document.getElementById('paginacion');
        contenedor.innerHTML = '';

        const totalPaginas = Math.ceil(total / rowsPerPage);

        const btnPrev = document.createElement('button');
        btnPrev.textContent = 'Anterior';
        btnPrev.disabled = currentPage === 1;
        btnPrev.onclick = () => { currentPage--; renderizarTabla(); };
        contenedor.appendChild(btnPrev);

        for (let i = 1; i <= totalPaginas; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === currentPage) btn.classList.add('activo');
            btn.onclick = () => { currentPage = i; renderizarTabla(); };
            contenedor.appendChild(btn);
        }

        const btnNext = document.createElement('button');
        btnNext.textContent = 'Siguiente';
        btnNext.disabled = currentPage === totalPaginas;
        btnNext.onclick = () => { currentPage++; renderizarTabla(); };
        contenedor.appendChild(btnNext);
    }

    buscadorInput.addEventListener('input', () => {
        const termino = buscadorInput.value.trim().toLowerCase();
        registrosFiltrados = termino
            ? registros.filter(r => r.nombre.toLowerCase().includes(termino) || r.apellido.toLowerCase().includes(termino))
            : [];
        currentPage = 1;
        renderizarTabla();
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const nombre = nombreInput.value.trim();
        const apellido = apellidoInput.value.trim();
        const edad = Number(edadInput.value.trim());
        const categoria = categoriaInput.value;

        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;

        if (!nombre || !apellido || !edad || !categoria) {
            return alert('Por favor, completa todos los campos.');
        }
        if (!soloLetras.test(nombre) || !soloLetras.test(apellido) || !soloLetras.test(categoria)) {
            return alert('Nombre, apellido y categoría solo deben contener letras.');
        }

        const nuevo = { id: Date.now(), nombre, apellido, edad, categoria };
        registros.push(nuevo);
        guardarEnLocalStorage();
        renderizarTabla();
        form.reset();
    });

    function agregarFilaATabla(registro, index) {
        const fila = document.createElement('tr');
        const clase = obtenerClaseCategoria(registro.categoria);

        fila.innerHTML = `
<td><div class="usuario"><div class="avatar-icon ${clase}"><i class="fa-solid fa-user"></i></div><span>${registro.nombre}</span></div></td>
<td>${registro.apellido}</td>
<td>${registro.edad}</td>
<td><span class="badge ${clase}">${registro.categoria}</span></td>
<td class="acciones-cell"></td>`;

        const accionesTd = fila.querySelector('.acciones-cell');

        const btnEditar = document.createElement('i');
        btnEditar.className = "fas fa-pen btn-edit";
        btnEditar.title = "Editar";
        btnEditar.style.cursor = "pointer";
        btnEditar.onclick = () => habilitarEdicion(index, fila, registro.id);

        const btnEliminar = document.createElement('i');
        btnEliminar.className = "fas fa-trash btn-delete";
        btnEliminar.title = "Eliminar";
        btnEliminar.style.cursor = "pointer";
        btnEliminar.onclick = () => eliminarRegistro(index);

        accionesTd.appendChild(btnEditar);
        accionesTd.appendChild(document.createTextNode(' '));
        accionesTd.appendChild(btnEliminar);

        tablaBody.appendChild(fila);
    }

    function obtenerClaseCategoria(c) {
        const cat = c.toLowerCase();
        return {
            infantil: 'infantil',
            intermedia: 'intermedia',
            juvenil: 'juvenil',
            'pre-juvenil': 'prejuvenil',
            junior: 'junior',
            senior: 'senior',
            élite: 'elite',
            elite: 'elite'
        }[cat] || '';
    }

    function habilitarEdicion(index, fila, id) {
        const registro = registros[index];
        const celdas = fila.querySelectorAll('td');

        celdas[0].innerHTML = `<input type="text" value="${registro.nombre}" class="input-editar">`;
        celdas[1].innerHTML = `<input type="text" value="${registro.apellido}" class="input-editar">`;
        celdas[2].innerHTML = `<input type="number" value="${registro.edad}" class="input-editar">`;
        celdas[3].innerHTML = `
  <select class="input-editar">
    ${["Infantil", "Intermedia", "Juvenil", "Pre-Juvenil", "Junior", "Senior", "Élite"].map(cat =>
            `<option value="${cat}" ${registro.categoria.toLowerCase() === cat.toLowerCase() ? 'selected' : ''}>${cat}</option>`
        ).join('')}
  </select>`;

        celdas[4].innerHTML = `
  <button class="btn-tabla btn-guardar">Guardar</button>
  <button class="btn-tabla btn-cancelar">Cancelar</button>`;

        celdas[4].querySelector('.btn-guardar').onclick = () => {
            const nuevo = {
                nombre: celdas[0].querySelector('input').value.trim(),
                apellido: celdas[1].querySelector('input').value.trim(),
                edad: Number(celdas[2].querySelector('input').value),
                categoria: celdas[3].querySelector('select').value,
                id: registro.id
            };

            const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;
            if (!nuevo.nombre || !nuevo.apellido || !nuevo.edad || !nuevo.categoria) return alert('Por favor, completa todos los campos.');
            if (!soloLetras.test(nuevo.nombre) || !soloLetras.test(nuevo.apellido) || !soloLetras.test(nuevo.categoria)) {
                return alert('Nombre, apellido y categoría solo deben contener letras.');
            }

            registros[index] = nuevo;
            guardarEnLocalStorage();
            renderizarTabla();
        };

        celdas[4].querySelector('.btn-cancelar').onclick = () => {
            fila.innerHTML = '';
            agregarFilaATabla(registro, index);
        };
    }

    function eliminarRegistro(index) {
        if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
        registros.splice(index, 1);
        guardarEnLocalStorage();
        renderizarTabla();
    }

    renderizarTabla();
});
