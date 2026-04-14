/**
 * Lógica del Panel de Gestión
 * Maneja navegación, autenticación simulada y filtrado de datos.
 */

// --- DATOS SIMULADOS ---
const APP_DATA = [
    { id: 101, title: "Mantenimiento Preventivo", unit: "Unidad 1", status: "Terminado" },
    { id: 102, title: "Auditoría de Calidad", unit: "Unidad 2", status: "En Proceso" },
    { id: 103, title: "Revisión de Flota", unit: "Unidad 3", status: "Pendiente" },
    { id: 104, title: "Capacitación Anual", unit: "Unidad 4", status: "Terminado" },
    { id: 105, title: "Cierre Fiscal", unit: "Unidad 1", status: "En Proceso" }
];

// --- ESTADO DE LA APP ---
let sessionUser = null;
let sessionRole = null;
let currentFilter = "Todas";

// --- ELEMENTOS DEL DOM ---
const viewLanding = document.getElementById('landing-page');
const viewLogin = document.getElementById('login-screen');
const viewMain = document.getElementById('main-app');
const tableBody = document.getElementById('data-table-body');

// --- FUNCIONES DE NAVEGACIÓN ---

/**
 * Inicializa los iconos de Lucide
 */
const refreshIcons = () => {
    if (window.lucide) window.lucide.createIcons();
};

/**
 * Cambia entre las pantallas principales
 */
const switchView = (target) => {
    [viewLanding, viewLogin, viewMain].forEach(v => v.classList.add('hidden'));
    target.classList.remove('hidden');
    refreshIcons();
};

// --- MANEJADORES DE EVENTOS ---

// Iniciar sesión desde Landing
document.getElementById('landing-login-btn').onclick = () => switchView(viewLogin);
document.getElementById('landing-hero-btn').onclick = () => switchView(viewLogin);

// Proceso de Login
document.getElementById('login-btn').onclick = () => {
    const user = document.getElementById('login-user').value.trim();
    const role = document.getElementById('login-role').value;

    if (!user) {
        alert("Por favor, ingresa un nombre de usuario.");
        return;
    }

    sessionUser = user;
    sessionRole = role;
    initDashboard();
};

// Cerrar Sesión
document.getElementById('logout-btn').onclick = () => {
    sessionUser = null;
    sessionRole = null;
    switchView(viewLanding);
};

/**
 * Prepara el dashboard tras el login exitoso
 */
function initDashboard() {
    switchView(viewMain);
    
    // Configurar Badge de Rol
    const badge = document.getElementById('role-badge');
    badge.textContent = sessionRole === 'admin' ? 'ADMINISTRADOR' : 'LECTOR';
    badge.className = sessionRole === 'admin' 
        ? "text-[10px] px-2 py-0.5 rounded-full border border-indigo-500 text-indigo-500 bg-indigo-500/10 font-bold"
        : "text-[10px] px-2 py-0.5 rounded-full border border-slate-500 text-slate-500 bg-slate-500/10 font-bold";

    // Mostrar/Ocultar botón de agregar según rol
    const addBtn = document.getElementById('add-record-btn');
    if (sessionRole === 'admin') {
        addBtn.classList.remove('hidden');
    } else {
        addBtn.classList.add('hidden');
    }

    renderTable();
}

/**
 * Filtra y renderiza los datos en la tabla
 */
function renderTable() {
    tableBody.innerHTML = '';
    
    const dataToShow = currentFilter === "Todas" 
        ? APP_DATA 
        : APP_DATA.filter(item => item.unit === currentFilter);

    document.getElementById('table-title').textContent = `Reportes: ${currentFilter}`;

    dataToShow.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-5">
                <div class="font-medium text-white">${item.title}</div>
                <div class="text-[10px] text-slate-500">ID: #${item.id}</div>
            </td>
            <td class="px-6 py-5 text-slate-400 text-sm">${item.unit}</td>
            <td class="px-6 py-5">
                <span class="px-2 py-1 rounded-md text-[10px] font-bold ${
                    item.status === 'Terminado' ? 'bg-emerald-500/10 text-emerald-500' : 
                    item.status === 'En Proceso' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                }">
                    ${item.status.toUpperCase()}
                </span>
            </td>
            <td class="px-6 py-5 text-right">
                ${sessionRole === 'admin' 
                    ? `<button class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-all"><i data-lucide="edit-3" class="w-4 h-4"></i></button>`
                    : `<i data-lucide="eye" class="w-4 h-4 text-slate-700 mx-auto"></i>`
                }
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    refreshIcons();
}

// Configurar clics en las tarjetas de unidades para filtrar
document.querySelectorAll('.unit-card').forEach(card => {
    card.addEventListener('click', () => {
        currentFilter = card.getAttribute('data-unit');
        renderTable();
        // Desplazar hacia la tabla en móviles
        window.scrollTo({ top: document.querySelector('main').offsetTop, behavior: 'smooth' });
    });
});

// Inicialización por defecto
refreshIcons();