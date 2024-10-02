// Variables simuladas de usuarios
const usersDB = [
    { username: 'mgonzalezg', password: '123456', role: 'admin' },
    { username: 'usuario1', password: 'usuario123', role: 'user' },
    { username: 'usuario2', password: 'usuario456', role: 'user' }
];

let currentUser = null;
let currentFileContent = null; // Almacena el contenido del archivo cargado

// Funciones de autenticación
const loginModal = document.getElementById('loginModal');
const aboutModal = document.getElementById('aboutModal');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const aboutLink = document.getElementById('aboutLink');
const darkModeBtn = document.getElementById('darkModeBtn');

const closeLoginModalBtn = document.getElementById('closeLoginModal');
const closeAboutModalBtn = document.getElementById('closeAboutModal');
const loginButton = document.getElementById('loginButton');

const processBtn = document.getElementById('processBtn');
const reprocessBtn = document.getElementById('reprocessBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const fileInput = document.getElementById('fileInput');
const statusMessage = document.getElementById('statusMessage');
const previewArea = document.getElementById('previewArea');
const filePreview = document.querySelector('.file-preview');
const additionalCharsInput = document.getElementById('additionalChars');
const addReplacementBtn = document.getElementById('addReplacementBtn');
const replacementRulesContainer = document.getElementById('replacementRulesContainer');

// Modal de Login
loginBtn.addEventListener('click', openLoginModal);
closeLoginModalBtn.addEventListener('click', closeLoginModal);
loginButton.addEventListener('click', login);

// Modal de Nosotros
aboutLink.addEventListener('click', openAboutModal);
closeAboutModalBtn.addEventListener('click', closeAboutModal);

// Dark Mode Toggle
darkModeBtn.addEventListener('click', toggleDarkMode);

// File Input Change
fileInput.addEventListener('change', handleFileSelection);

// Buttons
processBtn.addEventListener('click', processFile);
reprocessBtn.addEventListener('click', reprocessFile);
clearBtn.addEventListener('click', clearApplication);
downloadBtn.addEventListener('click', downloadFile);
addReplacementBtn.addEventListener('click', addReplacementRule);

// Cerrar modales al hacer clic fuera
window.addEventListener('click', function(event) {
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === aboutModal) {
        closeAboutModal();
    }
});

// Persistencia de Sesión y Tema
window.addEventListener('load', function() {
    applySavedTheme();
    checkSession();
    initializeReplacementRules(); // Inicializar con una regla de reemplazo por defecto
});

// Funciones de autenticación
function openLoginModal() {
    loginModal.style.display = 'flex';
    loginModal.setAttribute('aria-hidden', 'false');
}

function closeLoginModal() {
    loginModal.style.display = 'none';
    loginModal.setAttribute('aria-hidden', 'true');
}

function login() {
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('loginPasswordInput').value.trim();
    const user = usersDB.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUIOnLogin();
        closeLoginModal();
        statusMessage.textContent = 'Inicio de sesión exitoso.';
        statusMessage.style.color = 'green';
    } else {
        document.getElementById('loginStatus').textContent = 'Usuario o contraseña incorrectos.';
        document.getElementById('loginStatus').style.color = 'red';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIOnLogout();
}

function checkSession() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        currentUser = user;
        updateUIOnLogin();
    }
}

function updateUIOnLogin() {
    document.getElementById('welcome-message').textContent = `Bienvenido, ${currentUser.username}`;
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    processBtn.disabled = !fileInput.files.length;
}

function updateUIOnLogout() {
    document.getElementById('welcome-message').textContent = 'Bienvenido';
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    processBtn.disabled = true;
    toggleVisibility('reprocessBtn', false);
    toggleVisibility('clearBtn', false);
    toggleVisibility('downloadBtn', false);
    clearApplication();
}

// Funciones de modal Nosotros
function openAboutModal() {
    aboutModal.style.display = 'flex';
    aboutModal.setAttribute('aria-hidden', 'false');
}

function closeAboutModal() {
    aboutModal.style.display = 'none';
    aboutModal.setAttribute('aria-hidden', 'true');
}

// Función para alternar modo oscuro
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    darkModeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Aplicar tema guardado
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    darkModeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// Manejo de selección de archivo
function handleFileSelection() {
    if (currentUser) {
        processBtn.disabled = !fileInput.files.length;
    }
    if (fileInput.files.length) {
        previewFile(fileInput.files[0]);
    } else {
        filePreview.style.display = 'none';
    }
}

// Función para previsualizar el archivo
function previewFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        currentFileContent = e.target.result;
        let previewText = currentFileContent.substring(0, 500);
        previewText += currentFileContent.length > 500 ? '...' : '';
        previewArea.value = previewText;
        filePreview.style.display = 'block';
    };
    reader.onerror = function() {
        statusMessage.textContent = 'Error al leer el archivo para previsualización.';
        statusMessage.style.color = 'red';
        filePreview.style.display = 'none';
    };

    // Soporte para diferentes tipos de archivos
    const fileType = file.type;
    if (fileType === 'text/csv' || fileType === 'application/json' || fileType === 'text/plain') {
        reader.readAsText(file);
    } else {
        statusMessage.textContent = 'Tipo de archivo no soportado para previsualización.';
        statusMessage.style.color = 'red';
        filePreview.style.display = 'none';
    }
}

// Función para procesar el archivo
function processFile() {
    if (!currentFileContent) {
        alert('Por favor, selecciona un archivo.');
        return;
    }

    // Validar opciones seleccionadas
    const keepSpaces = document.getElementById('keepSpaces').checked;
    const keepCommas = document.getElementById('keepCommas').checked;
    const keepSemicolons = document.getElementById('keepSemicolons').checked;
    const keepSlashes = document.getElementById('keepSlashes').checked;
    const additionalChars = document.getElementById('additionalChars').value.trim();

    // Obtener todas las reglas de reemplazo
    const replacementRules = [];
    const replacementRuleElements = document.querySelectorAll('.replacement-rule');
    replacementRuleElements.forEach(rule => {
        const from = rule.querySelector('.replace-from').value;
        const to = rule.querySelector('.replace-to').value;
        if (from !== '') {
            replacementRules.push({ from, to });
        }
    });

    if ((!keepSpaces && !keepCommas && !keepSemicolons && !keepSlashes) && replacementRules.length === 0 && additionalChars === '') {
        alert('Debes mantener al menos uno de los caracteres especiales, agregar caracteres adicionales o definir al menos una regla de reemplazo.');
        return;
    }

    statusMessage.textContent = 'Procesando archivo...';
    statusMessage.style.color = 'black';

    // Usar PapaParse si es CSV
    const file = fileInput.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
        Papa.parse(file, {
            complete: function(results) {
                currentFileContent = results.data.map(row => row.join(',')).join('\n');
                const cleanedText = cleanSpecialCharactersAndSymbols(currentFileContent, replacementRules);
                document.getElementById('outputArea').value = cleanedText;
                toggleVisibility('downloadBtn', true);
                toggleVisibility('reprocessBtn', true);
                toggleVisibility('clearBtn', true);
                statusMessage.textContent = 'Archivo procesado correctamente.';
                statusMessage.style.color = 'green';
            },
            error: function() {
                statusMessage.textContent = 'Error al procesar el archivo CSV.';
                statusMessage.style.color = 'red';
            }
        });
    } else {
        // Para otros tipos de archivos
        try {
            const cleanedText = cleanSpecialCharactersAndSymbols(currentFileContent, replacementRules);
            document.getElementById('outputArea').value = cleanedText;
            toggleVisibility('downloadBtn', true);
            toggleVisibility('reprocessBtn', true);
            toggleVisibility('clearBtn', true);
            statusMessage.textContent = 'Archivo procesado correctamente.';
            statusMessage.style.color = 'green';
        } catch (error) {
            statusMessage.textContent = 'Error al procesar el archivo.';
            statusMessage.style.color = 'red';
        }
    }
}

// Función para limpiar caracteres especiales y realizar reemplazos
function cleanSpecialCharactersAndSymbols(text, replacementRules) {
    // Reemplazar caracteres acentuados
    const replacementsAccents = {
        'Á': 'A', 'á': 'a',
        'É': 'E', 'é': 'e',
        'Í': 'I', 'í': 'i',
        'Ó': 'O', 'ó': 'o',
        'Ú': 'U', 'ú': 'u',
        'Ñ': 'N', 'ñ': 'n'
    };

    let cleanedText = text.replace(/[ÁáÉéÍíÓóÚúÑñ]/g, char => replacementsAccents[char] || char);

    // Realizar reemplazos definidos por el usuario
    replacementRules.forEach(rule => {
        const fromEscaped = escapeRegExp(rule.from);
        const regex = new RegExp(fromEscaped, 'g');
        cleanedText = cleanedText.replace(regex, rule.to);
    });

    // Obtener opciones de conservación de caracteres
    const keepSpaces = document.getElementById('keepSpaces').checked;
    const keepCommas = document.getElementById('keepCommas').checked;
    const keepSemicolons = document.getElementById('keepSemicolons').checked;
    const keepSlashes = document.getElementById('keepSlashes').checked;
    const additionalChars = document.getElementById('additionalChars').value.trim();

    // Construir el patrón dinámicamente
    let pattern = '[^\\w';
    if (keepSpaces) pattern += '\\s';
    if (keepCommas) pattern += ',';
    if (keepSemicolons) pattern += ';';
    if (keepSlashes) pattern += '/';

    if (additionalChars !== '') {
        // Escapar caracteres especiales en el input del usuario
        const escapedChars = additionalChars.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        pattern += escapedChars;
    }

    pattern += 'ÁáÉéÍíÓóÚúÑñ]';

    const regex = new RegExp(pattern, 'g');

    cleanedText = cleanedText.replace(regex, '');

    return cleanedText;
}

// Función para escapar caracteres especiales en RegExp
function escapeRegExp(string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// Función para reprocesar el archivo con nuevas configuraciones
function reprocessFile() {
    if (!currentFileContent) {
        alert('No hay archivo cargado para reprocesar.');
        return;
    }

    // Validar opciones seleccionadas
    const keepSpaces = document.getElementById('keepSpaces').checked;
    const keepCommas = document.getElementById('keepCommas').checked;
    const keepSemicolons = document.getElementById('keepSemicolons').checked;
    const keepSlashes = document.getElementById('keepSlashes').checked;
    const additionalChars = document.getElementById('additionalChars').value.trim();

    // Obtener todas las reglas de reemplazo
    const replacementRules = [];
    const replacementRuleElements = document.querySelectorAll('.replacement-rule');
    replacementRuleElements.forEach(rule => {
        const from = rule.querySelector('.replace-from').value;
        const to = rule.querySelector('.replace-to').value;
        if (from !== '') {
            replacementRules.push({ from, to });
        }
    });

    if ((!keepSpaces && !keepCommas && !keepSemicolons && !keepSlashes) && replacementRules.length === 0 && additionalChars === '') {
        alert('Debes mantener al menos uno de los caracteres especiales, agregar caracteres adicionales o definir al menos una regla de reemplazo.');
        return;
    }

    statusMessage.textContent = 'Reprocesando archivo...';
    statusMessage.style.color = 'black';

    try {
        const cleanedText = cleanSpecialCharactersAndSymbols(currentFileContent, replacementRules);
        document.getElementById('outputArea').value = cleanedText;
        statusMessage.textContent = 'Archivo reprocesado correctamente.';
        statusMessage.style.color = 'green';
    } catch (error) {
        statusMessage.textContent = 'Error al reprocesar el archivo.';
        statusMessage.style.color = 'red';
    }
}

// Función para limpiar la aplicación y cargar un nuevo archivo
function clearApplication() {
    fileInput.value = ''; // Limpiar input de archivo
    document.getElementById('outputArea').value = ''; // Limpiar textarea
    previewArea.value = ''; // Limpiar previsualización
    additionalCharsInput.value = ''; // Limpiar caracteres adicionales

    // Limpiar todas las reglas de reemplazo
    replacementRulesContainer.innerHTML = '';
    initializeReplacementRules(); // Re-inicializar con una regla por defecto

    toggleVisibility('downloadBtn', false);
    toggleVisibility('reprocessBtn', false);
    toggleVisibility('clearBtn', false);
    filePreview.style.display = 'none';
    statusMessage.textContent = '';
    currentFileContent = null; // Resetear contenido del archivo
}

// Función para descargar el archivo
function downloadFile() {
    const text = document.getElementById('outputArea').value;
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'archivo_procesado.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Función para alternar visibilidad de elementos
function toggleVisibility(elementId, show) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = show ? 'inline-block' : 'none';
    }
}

/* ----------------------- */
/* Funcionalidad de Reemplazo */
/* ----------------------- */

// Inicializar con una regla de reemplazo por defecto
function initializeReplacementRules() {
    addReplacementRule();
}

// Función para agregar una nueva regla de reemplazo
function addReplacementRule() {
    const ruleDiv = document.createElement('div');
    ruleDiv.className = 'replacement-rule';

    const fromInput = document.createElement('input');
    fromInput.type = 'text';
    fromInput.placeholder = 'Caracter a reemplazar';
    fromInput.maxLength = 1;
    fromInput.className = 'replace-from';
    fromInput.setAttribute('aria-label', 'Caracter a reemplazar');

    const toInput = document.createElement('input');
    toInput.type = 'text';
    toInput.placeholder = 'Reemplazar por';
    toInput.maxLength = 1;
    toInput.className = 'replace-to';
    toInput.setAttribute('aria-label', 'Reemplazar por');

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-replacement-btn';
    removeBtn.textContent = 'Eliminar';
    removeBtn.setAttribute('aria-label', 'Eliminar regla de reemplazo');
    removeBtn.addEventListener('click', function() {
        replacementRulesContainer.removeChild(ruleDiv);
    });

    ruleDiv.appendChild(fromInput);
    ruleDiv.appendChild(toInput);
    ruleDiv.appendChild(removeBtn);

    replacementRulesContainer.appendChild(ruleDiv);
}

// Permitir al usuario agregar múltiples reglas de reemplazo
// La función addReplacementRule ya lo permite

/* ----------------------- */
/* Fin Funcionalidad de Reemplazo */
/* ----------------------- */
