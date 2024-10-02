// scripts.js

// Simulación de una base de datos de usuarios
const usersDB = [
    { username: 'admin', password: '123', role: 'admin' },
    { username: 'usuario1', password: 'usuario123', role: 'user' },
    { username: 'usuario2', password: 'usuario456', role: 'user' }
];

/**
 * Función para mostrar mensajes de éxito.
 * @param {string} message - Mensaje a mostrar.
 */
function showSuccessMessage(message) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;

    document.body.appendChild(successMessage);

    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

/**
 * Función para iniciar sesión.
 */
function login() {
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();
    const user = usersDB.find(u => u.username === username && u.password === password);

    if (user) {
        // Almacenar la información del usuario en localStorage
        localStorage.setItem('fluxorUser', JSON.stringify(user));

        mostrarDashboard();
        showSuccessMessage('Inicio de sesión exitoso.');
    } else {
        document.getElementById('loginStatus').textContent = 'Usuario o contraseña incorrectos.';
    }
}

/**
 * Función para cerrar sesión.
 */
function logout() {
    // Eliminar la información del usuario de localStorage
    localStorage.removeItem('fluxorUser');

    ocultarDashboard();
    showSuccessMessage('Has cerrado sesión.');
}

/**
 * Función para mostrar el panel de control.
 */
function mostrarDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
}

/**
 * Función para ocultar el panel de control y mostrar el login.
 */
function ocultarDashboard() {
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('dashboard-section').style.display = 'none';
}

/**
 * Función para abrir la aplicación Ajuste FCI en una nueva pestaña.
 */
function abrirAjusteFCI() {
    window.open('ajuste-fci/index.html', '_blank'); // Abre en una nueva pestaña
}

/**
 * Función para abrir la aplicación LaPampaMinimos en una nueva pestaña.
 */
function abrirLaPampaMinimos() {
    window.open('LaPampaMinimos/index.html', '_blank'); // Abre en una nueva pestaña
}

/**
 * Función para abrir la aplicación Limpiador-de-caracteres en una nueva pestaña.
 */
function abrirlimpiadordecaracteres() {
    window.open('Limpiador-de-caracteres/index.html', '_blank'); // Abre en una nueva pestaña
}

/**
 * Función para abrir la aplicación Prorrateo CF en una nueva pestaña.
 */
function abrirprorateocf() {
    window.open('Prorrateo-CF/index.html', '_blank'); // Abre en una nueva pestaña
}

/**
 * Función para alternar modo oscuro.
 */
function toggleDarkMode() {
    const darkModeBtn = document.getElementById('darkModeBtn');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    darkModeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

/**
 * Función para aplicar el tema guardado.
 */
function applySavedTheme() {
    const darkModeBtn = document.getElementById('darkModeBtn');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    darkModeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

/**
 * Función para verificar si el usuario ya está autenticado.
 */
function checkAuthOnLoad() {
    const user = localStorage.getItem('fluxorUser');
    if (user) {
        mostrarDashboard();
    } else {
        ocultarDashboard();
    }
}

/**
 * Función para inicializar eventos al cargar la página.
 */
function initEventListeners() {
    // Escuchar el evento de clic en el botón de inicio de sesión
    const loginButton = document.querySelector('.login-form .primary-btn');
    loginButton.addEventListener('click', login);

    // Escuchar el evento de clic en el botón de cerrar sesión
    const logoutButton = document.querySelector('.logout-btn');
    logoutButton.addEventListener('click', logout);

    // Dark Mode Toggle
    document.getElementById('darkModeBtn').addEventListener('click', toggleDarkMode);
}

// Ejecutar las funciones de inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme();
    checkAuthOnLoad();
    initEventListeners();
});
