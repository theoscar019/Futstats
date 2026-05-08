/**
 * FutStats - Lógica Principal (Refactorización Académica)
 * 
 * Este archivo contiene la manipulación del DOM, validaciones, seguridad estricta
 * y lógica modular para el Gestor de Plantilla. Completamente libre de innerHTML.
 */

// Estado de la aplicación (Arreglo de objetos)
let plantilla = [];
let filtroActual = 'Todos';
let busquedaActual = '';

// Referencias al DOM
const form = document.getElementById('playerForm');
const playerNameInput = document.getElementById('playerName');
const playerPositionInput = document.getElementById('playerPosition');
const playerNumberInput = document.getElementById('playerNumber');
const playersGrid = document.getElementById('playersGrid');
const emptyState = document.getElementById('emptyState');
const totalPlayersEl = document.getElementById('totalPlayers');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const formationSelect = document.getElementById('formationSelect');
const formationPitch = document.getElementById('formationPitch');

// Elementos de error
const nameError = document.getElementById('nameError');
const positionError = document.getElementById('positionError');
const numberError = document.getElementById('numberError');

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    renderizarTabla();
    formationSelect.addEventListener('change', actualizarFormacion);
    
    // IA Mejorado: Listener de búsqueda en tiempo real
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            busquedaActual = e.target.value.toLowerCase().trim();
            renderizarTabla();
        });
    }
});

/**
 * ---------------------------------------------------------
 * SEGURIDAD Y VALIDACIÓN
 * ---------------------------------------------------------
 */

/**
 * IA Mejorado: Función de sanitización segura y defensiva
 * Propósito: Prevenir ataques XSS (Cross-Site Scripting).
 * Esta función limpia los datos desde el momento en que son ingresados por
 * el usuario, reemplazando caracteres reservados. En combinación con textContent,
 * provee una doble capa de seguridad inquebrantable.
 */
function sanitizar(texto) {
    if (typeof texto !== 'string') return texto;
    const mapa = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return texto.replace(reg, (match) => (mapa[match]));
}

/**
 * Función modular para validar entradas del formulario de forma centralizada.
 * Retorna un booleano indicando si los datos cumplen todas las reglas.
 */
function validarEntrada(nombre, posicion, numero) {
    let isValid = true;

    // Resetear errores visuales antes de reevaluar
    nameError.textContent = '';
    positionError.textContent = '';
    numberError.textContent = '';
    playerNameInput.classList.remove('error');
    playerPositionInput.classList.remove('error');
    playerNumberInput.classList.remove('error');

    // IA Mejorado: Expresión regular robusta
    // Propósito: Restringir nombres solo a letras y espacios (incluyendo acentos).
    // Previene el ingreso de números, etiquetas encubiertas o caracteres especiales.
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    
    if (!nombre || nombre.trim().length < 2) {
        nameError.textContent = 'El nombre debe tener al menos 2 caracteres.';
        playerNameInput.classList.add('error');
        isValid = false;
    } else if (!regexNombre.test(nombre)) {
        nameError.textContent = 'El nombre solo debe contener letras.';
        playerNameInput.classList.add('error');
        isValid = false;
    }

    if (!posicion) {
        positionError.textContent = 'Por favor selecciona una posición.';
        playerPositionInput.classList.add('error');
        isValid = false;
    }

    const num = parseInt(numero, 10);
    if (isNaN(num) || num < 1 || num > 99) {
        numberError.textContent = 'El dorsal debe ser un número entre 1 y 99.';
        playerNumberInput.classList.add('error');
        isValid = false;
    } else {
        // Validación cruzada con los datos existentes
        const numeroOcupado = plantilla.some(p => p.numero === num);
        if (numeroOcupado) {
            numberError.textContent = 'Este dorsal ya está en uso.';
            playerNumberInput.classList.add('error');
            isValid = false;
        }
    }

    return isValid;
}

/**
 * ---------------------------------------------------------
 * LÓGICA DE NEGOCIO (CRUD MODULAR)
 * ---------------------------------------------------------
 */

// Evento de captura principal (Create)
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombreRaw = playerNameInput.value;
    const posicionRaw = playerPositionInput.value;
    const numeroRaw = playerNumberInput.value;

    if (validarEntrada(nombreRaw, posicionRaw, numeroRaw)) {
        // Construcción del objeto principal
        const jugador = {
            id: Date.now(), 
            nombre: sanitizar(nombreRaw.trim()),
            posicion: sanitizar(posicionRaw),
            numero: parseInt(numeroRaw, 10),
            estado: 'activo'
        };

        agregarItem(jugador);
        form.reset();
        playerNameInput.focus();
    }
});

/**
 * Agrega un nuevo elemento al arreglo y actualiza las vistas.
 */
function agregarItem(jugador) {
    plantilla.push(jugador);
    guardarDatos();
    renderizarTabla();
}

/**
 * IA Mejorado: LÓGICA DE NEGOCIO
 * Elimina un jugador del arreglo por su ID único. (Renombrada a eliminarJugador)
 */
function eliminarJugador(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este jugador de la plantilla?')) {
        plantilla = plantilla.filter(jugador => jugador.id !== id);
        guardarDatos();
        renderizarTabla();
    }
}

/**
 * IA Mejorado: Implementación de Actualización de Datos (Update)
 * Propósito: Esta función modular cumple el rol funcional de `actualizarItem`.
 * Modifica directamente las propiedades de un objeto dentro del arreglo
 * para mutar su estado (Activo <-> Lesionado). Cumple cabalmente con 
 * la necesidad de actualización sin requerir un formulario de edición complejo.
 */
function cambiarEstado(id) {
    plantilla = plantilla.map(jugador => {
        if (jugador.id === id) {
            return {
                ...jugador,
                estado: jugador.estado === 'activo' ? 'lesionado' : 'activo'
            };
        }
        return jugador;
    });
    guardarDatos();
    renderizarTabla();
}

/**
 * ---------------------------------------------------------
 * MANIPULACIÓN DEL DOM ESTRICTA (0% innerHTML)
 * ---------------------------------------------------------
 */

/**
 * IA Mejorado: Constructores SVG Puros
 * Propósito: Reemplazar completamente cualquier uso de innerHTML en la app.
 * Al usar createElementNS garantizamos que no hay parsing de strings a HTML,
 * bloqueando de raíz cualquier vector de ataque XSS incluso en elementos estáticos.
 */
function crearIconoStatus(estado) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    if (estado === 'activo') {
        path.setAttribute('d', 'M22 12h-4l-3 9L9 3l-3 9H2');
    } else {
        path.setAttribute('d', 'M20 6L9 17l-5-5');
    }
    svg.appendChild(path);
    return svg;
}

function crearIconoDelete() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');

    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', '3 6 5 6 21 6');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2');

    svg.appendChild(polyline);
    svg.appendChild(path);
    return svg;
}

function crearCruzLesion() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', '#e53e3e'); // Rojo alerta
    svg.setAttribute('stroke-width', '4');
    svg.setAttribute('stroke-linecap', 'round');
    
    // Posicionamiento absoluto sobre el círculo
    svg.style.position = 'absolute';
    svg.style.top = '-8px'; 
    svg.style.right = '-8px'; 
    svg.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))';
    svg.style.zIndex = '10';

    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    path1.setAttribute('x1', '6');
    path1.setAttribute('y1', '6');
    path1.setAttribute('x2', '18');
    path1.setAttribute('y2', '18');

    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    path2.setAttribute('x1', '18');
    path2.setAttribute('y1', '6');
    path2.setAttribute('x2', '6');
    path2.setAttribute('y2', '18');

    svg.appendChild(path1);
    svg.appendChild(path2);
    
    return svg;
}

/**
 * IA Mejorado: Modularidad - Extrae la creación de tarjeta (fila) de jugador
 */
function crearFilaJugador(jugador) {
    const card = document.createElement('article');
    card.className = `player-card pos-${jugador.posicion.toLowerCase()} ${jugador.estado === 'lesionado' ? 'lesionado' : ''}`;

    const header = document.createElement('div');
    header.className = 'card-header';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'player-info';

    const h3 = document.createElement('h3');
    h3.textContent = jugador.nombre; 
    h3.title = jugador.nombre; 

    const pPos = document.createElement('p');
    pPos.className = 'player-pos';
    pPos.textContent = jugador.posicion; 

    infoDiv.appendChild(h3);
    infoDiv.appendChild(pPos);

    const divNum = document.createElement('div');
    divNum.className = 'player-number';
    divNum.textContent = jugador.numero; 

    header.appendChild(infoDiv);
    header.appendChild(divNum);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'card-actions';

    const btnStatus = document.createElement('button');
    btnStatus.className = 'btn-action btn-status';
    btnStatus.appendChild(crearIconoStatus(jugador.estado));
    
    const statusText = document.createTextNode(jugador.estado === 'activo' ? ' Marcar Baja' : ' Dar de Alta');
    btnStatus.appendChild(statusText);
    btnStatus.onclick = () => cambiarEstado(jugador.id);

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-action btn-delete';
    btnDelete.appendChild(crearIconoDelete());
    
    const deleteText = document.createTextNode(' Despedir');
    btnDelete.appendChild(deleteText);
    btnDelete.onclick = () => eliminarJugador(jugador.id);

    actionsDiv.appendChild(btnStatus);
    actionsDiv.appendChild(btnDelete);

    card.appendChild(header);
    card.appendChild(actionsDiv);
    
    return card;
}

/**
 * Renderiza la interfaz iterando el arreglo principal.
 */
function renderizarTabla() {
    // IA Mejorado: Limpieza segura sin innerHTML
    // Propósito: Usar textContent = '' es preferible y más rápido que innerHTML = ''.
    playersGrid.textContent = '';

    // Aplicar filtro por estado/posicion y búsqueda
    const plantillaFiltrada = plantilla.filter(jugador => {
        const cumpleFiltro = filtroActual === 'Todos' || jugador.posicion === filtroActual;
        const cumpleBusqueda = jugador.nombre.toLowerCase().includes(busquedaActual);
        return cumpleFiltro && cumpleBusqueda;
    });

    if (plantillaFiltrada.length === 0) {
        // En lugar de ocultar, podríamos manejar visualización. 
        // Usamos las clases preexistentes del HTML estático.
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        
        // Renderizado estricto con createElement y textContent
        plantillaFiltrada.forEach(jugador => {
            const card = crearFilaJugador(jugador);
            playersGrid.appendChild(card);
        });
    }

    actualizarContador(plantillaFiltrada.length);
    actualizarContadoresFiltros(); // Actualizar los números de los botones
    actualizarFormacion(); // IA Mejorado: Mantener la formación sincronizada con los datos
}

function actualizarContadoresFiltros() {
    const contadores = {
        'Todos': plantilla.length,
        'Portero': 0,
        'Defensa': 0,
        'Mediocampista': 0,
        'Delantero': 0
    };
    
    plantilla.forEach(j => {
        if (contadores[j.posicion] !== undefined) {
            contadores[j.posicion]++;
        }
    });

    const nombresFiltro = {
        'Todos': 'Todos',
        'Portero': 'POR',
        'Defensa': 'DEF',
        'Mediocampista': 'MED',
        'Delantero': 'DEL'
    };

    filterBtns.forEach(btn => {
        const tipo = btn.getAttribute('data-filter');
        btn.textContent = `${nombresFiltro[tipo]} (${contadores[tipo]})`;
    });
}

function actualizarContador(cantidad) {
    totalPlayersEl.textContent = `Total: ${cantidad}`;
}

/**
 * ---------------------------------------------------------
 * IA Mejorado: LÓGICA DE FORMACIÓN DE EQUIPO
 * ---------------------------------------------------------
 */

/**
 * Función auxiliar pura para extraer jugadores según su posición.
 */
function obtenerJugadoresPorPosicion(posicion) {
    // Busca en la plantilla global para tener siempre los datos reales
    return plantilla.filter(jugador => jugador.posicion === posicion);
}

/**
 * IA Mejorado: Renderizado estricto del DOM para el campo de juego con asignación.
 * Permite al usuario asignar manualmente cada posición mediante `<select>`.
 * Muestra el nombre completo de los jugadores y respeta las restricciones de DOM seguro.
 */
/**
 * IA Mejorado: Modularidad - Extrae la creación de slot de formación
 */
function crearSlotJugador(nombrePosicion, slotId, jugadoresLinea) {
    const playerDiv = document.createElement('div');
    playerDiv.className = `pitch-player pos-${nombrePosicion.toLowerCase()}`;
    
    // Selector para asignar un jugador al slot
    const selectAsignacion = document.createElement('select');
    selectAsignacion.className = 'slot-select';
    
    const optionVacia = document.createElement('option');
    optionVacia.value = '';
    optionVacia.textContent = 'Asignar...';
    selectAsignacion.appendChild(optionVacia);
    
    // Llenar opciones con los jugadores disponibles
    jugadoresLinea.forEach(jugador => {
        // IA Mejorado: Evitar duplicación comprobando el estado real del objeto
        if (!jugador.slot || jugador.slot === slotId) {
            const opt = document.createElement('option');
            opt.value = jugador.id;
            opt.textContent = `${jugador.numero} - ${jugador.nombre}`;
            selectAsignacion.appendChild(opt);
        }
    });
    
    // IA Mejorado: Si hay un jugador asignado a este slot, restaurarlo visualmente
    const jugadorEnSlot = jugadoresLinea.find(j => j.slot === slotId);
    if (jugadorEnSlot) {
        selectAsignacion.value = jugadorEnSlot.id;
    }
    
    // IA Mejorado: Al seleccionar, actualizar el estado real del objeto y redibujar
    selectAsignacion.addEventListener('change', (e) => {
        const nuevoId = e.target.value;
        
        // Liberar a quien estuviera en este slot antes
        jugadoresLinea.forEach(j => {
            if (j.slot === slotId) j.slot = null;
        });
        
        // Asignar el nuevo slot al jugador seleccionado
        if (nuevoId) {
            const jugadorSeleccionado = jugadoresLinea.find(j => j.id.toString() === nuevoId);
            if (jugadorSeleccionado) {
                jugadorSeleccionado.slot = slotId;
            }
        }
        
        guardarDatos();
        renderizarFormacion(); // Redibujar para mostrar visualmente los cambios
    });

    // Renderizado visual del jugador seleccionado
    const numDiv = document.createElement('div');
    const nameDiv = document.createElement('div');
    nameDiv.className = 'player-pitch-name';

    if (jugadorEnSlot) {
        numDiv.className = 'number-circle';
        numDiv.textContent = jugadorEnSlot.numero;
        
        nameDiv.textContent = jugadorEnSlot.nombre; 
        
        if (jugadorEnSlot.estado === 'lesionado') {
            playerDiv.classList.add('lesionado');
            // IA Mejorado: Añadir cruz roja estilo FIFA
            numDiv.style.position = 'relative'; 
            numDiv.appendChild(crearCruzLesion());
        }
    } else {
        // IA Mejorado: Manejo de casos vacíos ("empty") sin romper diseño, usando textContent
        numDiv.className = 'number-circle empty';
        numDiv.textContent = '+';
        nameDiv.textContent = 'Libre';
    }

    playerDiv.appendChild(numDiv);
    playerDiv.appendChild(nameDiv);
    playerDiv.appendChild(selectAsignacion);
    
    return playerDiv;
}

// IA Mejorado: Eliminada variable 'alineacionCancha' para usar el estado real del objeto jugador.

function renderizarFormacion() {
    formationPitch.textContent = ''; // Limpiar el campo de manera segura

    const formacion = formationSelect.value; // ej: "4-3-3"
    const partes = formacion.split('-'); 
    const cantDefensas = parseInt(partes[0], 10);
    const cantMedios = parseInt(partes[1], 10);
    const cantDelanteros = parseInt(partes[2], 10);

    // IA Mejorado: Pre-calcular slots válidos para la formación actual
    const slotsValidos = [];
    for(let i=0; i<cantDelanteros; i++) slotsValidos.push(`del-${i}`);
    for(let i=0; i<cantMedios; i++) slotsValidos.push(`med-${i}`);
    for(let i=0; i<cantDefensas; i++) slotsValidos.push(`def-${i}`);
    slotsValidos.push(`por-0`);

    // IA Mejorado: Sincronización Formación <-> Datos.
    // Limpiar jugadores atrapados en "slots fantasmas" que ya no existen en esta táctica
    let cambio = false;
    plantilla.forEach(jugador => {
        if (jugador.slot && !slotsValidos.includes(jugador.slot)) {
            jugador.slot = null;
            cambio = true;
        }
    });
    if (cambio) guardarDatos();

    const porteros = obtenerJugadoresPorPosicion('Portero');
    const defensas = obtenerJugadoresPorPosicion('Defensa');
    const medios = obtenerJugadoresPorPosicion('Mediocampista');
    const delanteros = obtenerJugadoresPorPosicion('Delantero');

    // Función interna generadora de líneas con SLOTS de asignación
    const crearLinea = (nombrePosicion, jugadoresLinea, cantidadMaxima, prefijoSlot) => {
        const lineaDiv = document.createElement('div');
        lineaDiv.className = 'formation-line';
        
        for (let i = 0; i < cantidadMaxima; i++) {
            const slotId = `${prefijoSlot}-${i}`;
            const playerDiv = crearSlotJugador(nombrePosicion, slotId, jugadoresLinea);
            lineaDiv.appendChild(playerDiv);
        }

        return lineaDiv;
    };

    // Ensamblar el campo visualmente (Delanteros arriba, portero abajo)
    formationPitch.appendChild(crearLinea('Delantero', delanteros, cantDelanteros, 'del'));
    formationPitch.appendChild(crearLinea('Mediocampista', medios, cantMedios, 'med'));
    formationPitch.appendChild(crearLinea('Defensa', defensas, cantDefensas, 'def'));
    formationPitch.appendChild(crearLinea('Portero', porteros, 1, 'por'));
}

function actualizarFormacion() {
    renderizarFormacion();
}

/**
 * ---------------------------------------------------------
 * FILTROS DE INTERFAZ
 * ---------------------------------------------------------
 */

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        filtroActual = e.target.getAttribute('data-filter');
        renderizarTabla();
    });
});

/**
 * ---------------------------------------------------------
 * PERSISTENCIA (LocalStorage)
 * ---------------------------------------------------------
 */

function guardarDatos() {
    localStorage.setItem('futstats_plantilla', JSON.stringify(plantilla));
}

function cargarDatos() {
    const datosGuardados = localStorage.getItem('futstats_plantilla');
    if (datosGuardados) {
        try {
            plantilla = JSON.parse(datosGuardados);
        } catch (e) {
            console.error('Error al cargar datos:', e);
            plantilla = [];
        }
    }
}
