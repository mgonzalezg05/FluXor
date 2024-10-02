// Variables Globales
let initialBalance = [];  // Saldo Inicial
let importedData = [];    // Datos Importados
let fifoResult = {};      // Resultado del Cálculo FIFO
let closingBalance = [];  // Saldo Cierre (nuevo)
let inflationIndices = []; // Índices de inflación cargados
let inflationAdjustedResults = []; // Resultados del ajuste por inflación
let rescuedPurchasesAdjustments = {}; // Objeto para ajustes por producto

// Simulación de una base de datos de usuarios
const usersDB = [
    { username: 'mgonzalezg', password: '123456', role: 'admin' },
    { username: 'usuario1', password: 'usuario123', role: 'user' },
    { username: 'usuario2', password: 'usuario456', role: 'user' }
];

let currentUser = null; // Variable para almacenar el usuario autenticado

// Funciones de autenticación
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'flex';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
}

function login() {
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();
    const user = usersDB.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        document.getElementById('welcome-message').textContent = `Bienvenido, ${currentUser.username}`;
        document.querySelector('.login-btn').style.display = 'none';
        document.querySelector('.logout-btn').style.display = 'inline-block';
        closeLoginModal();
        showSuccessMessage('Inicio de sesión exitoso.');
        // Opcional: Activar exportación o cualquier otra funcionalidad restringida
    } else {
        document.getElementById('loginStatus').textContent = 'Usuario o contraseña incorrectos.';
    }
}

function logout() {
    currentUser = null;
    document.getElementById('welcome-message').textContent = 'Bienvenido';
    document.querySelector('.login-btn').style.display = 'inline-block';
    document.querySelector('.logout-btn').style.display = 'none';
    showSuccessMessage('Has cerrado sesión.');
    // Opcional: Desactivar funcionalidades restringidas si es necesario
}

// Eliminar la apertura automática del modal al cargar la página
// window.onload = function() {
//     openLoginModal();
// };

/* ========================================
   Chatbot Functionality - Basado en Menús
======================================== */

const chatbotOptions = {
    "inicio": {
        "message": "Bienvenido al chatbot de Fluxor. Por favor, selecciona una de las siguientes opciones:",
        "options": [
            { "text": "1. Ver funcionalidades", "action": "funcionalidades" },
            { "text": "2. Solicitar ejemplos de formatos de archivos", "action": "solicitar_ejemplos" },
            { "text": "3. Preguntas generales", "action": "preguntas_generales" },
            { "text": "4. Salir", "action": "salir" }
        ]
    },
    "funcionalidades": {
        "message": "Estas son las funcionalidades disponibles:",
        "options": [
            { "text": "1. Cargar datos", "action": "cargar_datos" },
            { "text": "2. Calcular ajuste FCI", "action": "calcular_ajuste_fci" },
            { "text": "3. Ajustar por inflación", "action": "ajustar_inflacion" },
            { "text": "4. Exportar a Excel", "action": "exportar_excel" },
            { "text": "5. Volver al inicio", "action": "inicio" }
        ]
    },
    "solicitar_ejemplos": {
        "message": "¿Qué formato de archivo deseas descargar?",
        "options": [
            { "text": "1. Formato Saldo Inicial", "action": "download-saldo-inicial" },
            { "text": "2. Formato Datos Importados", "action": "download-datos-importados" },
            { "text": "3. Formato Índices de Inflación", "action": "download-indices-inflacion" },
            { "text": "4. Volver al inicio", "action": "inicio" }
        ]
    },
    "preguntas_generales": {
        "message": "Por favor, selecciona una de las siguientes preguntas o escribe tu pregunta:",
        "options": [
            { "text": "1. Qué es FCI", "action": "que_es_fci" },
            { "text": "2. Cómo cargar índices de inflación", "action": "como_cargar_indices" },
            { "text": "3. Qué hago si el archivo no se carga", "action": "que_hago_si_no_se_carga" },
            { "text": "4. Cómo ver los resultados", "action": "como_ver_resultados" },
            { "text": "5. Dónde se guardan los datos", "action": "donde_se_guardan_datos" },
            { "text": "6. Proceso de cálculo del ajuste FCI", "action": "proceso_calculo_fci" },
            { "text": "7. Proceso de ajuste por inflación", "action": "proceso_ajuste_inflacion" },
            { "text": "8. Volver al inicio", "action": "inicio" }
        ]
    },
    "salir": {
        "message": "¡Hasta luego! Si necesitas más ayuda, no dudes en interactuar nuevamente con el chatbot.",
        "options": []
    },
    // Preguntas específicas
    "que_es_fci": {
        "message": "FCI significa 'Fondos Comunes de Inversión'. Es una forma de inversión colectiva donde varios inversores aportan capital para invertir en una cartera diversificada de activos.",
        "options": [
            { "text": "Volver al inicio", "action": "inicio" }
        ]
    },
    "como_cargar_indices": {
        "message": "Para cargar los índices de inflación, ve a la sección 'Carga de Datos' y selecciona el archivo correspondiente en el campo 'Cargar Índices de Inflación'.",
        "options": [
            { "text": "Volver al inicio", "action": "inicio" }
        ]
    },
    "que_hago_si_no_se_carga": {
        "message": "Asegúrate de que el archivo esté en formato Excel (.xlsx o .xls) y que tenga los encabezados correctos. Si el problema persiste, intenta recargar la página o contacta al soporte técnico.",
        "options": [
            { "text": "Volver al inicio", "action": "inicio" }
        ]
    },
    "como_ver_resultados": {
        "message": "Después de realizar los cálculos, los resultados se mostrarán en las tablas de 'Valuación Impositiva FCI' y 'Resultados del Ajuste por Inflación' dentro de la sección principal.",
        "options": [
            { "text": "Volver al inicio", "action": "inicio" }
        ]
    },
    "donde_se_guardan_datos": {
        "message": "Tus datos se almacenan localmente en tu navegador. Puedes cargarlos nuevamente usando el botón 'Cargar Datos Guardados' en la sección 'Carga de Datos'.",
        "options": [
            { "text": "Volver al inicio", "action": "inicio" }
        ]
    },
    // Nuevas Preguntas Frecuentes
    "proceso_calculo_fci": {
        "message": "El proceso de cálculo del ajuste FCI implica combinar el saldo inicial y los datos importados, luego aplicar el método FIFO para determinar el costo de los productos vendidos y ajustar los costos según los índices de inflación correspondientes.",
        "options": [
            { "text": "Volver al inicio", "action": "inicio" }
        ]
    },
    "proceso_ajuste_inflacion": {
        "message": "El ajuste por inflación se realiza después del cálculo FIFO. Consiste en aplicar los índices de inflación a los costos de los productos en existencia para reflejar su valor actualizado, lo que permite obtener una valuación impositiva precisa.",
        "options": [
            { "text": "Volver al inicio", "action": "inicio" }
        ]
    },
    // Acciones para descargar formatos
    "download-saldo-inicial": {
        "message": "Descargando el formato de Saldo Inicial...",
        "options": []
    },
    "download-datos-importados": {
        "message": "Descargando el formato de Datos Importados...",
        "options": []
    },
    "download-indices-inflacion": {
        "message": "Descargando el formato de Índices de Inflación...",
        "options": []
    },
    // Acciones funcionales
    "cargar_datos": {
        "message": "Para cargar tus datos, usa las opciones de carga de archivos en la sección 'Carga de Datos'. Puedes cargar el saldo inicial, los datos de transacciones y los índices de inflación.",
        "options": [
            { "text": "Volver al inicio", "action": "inicio" }
        ]
    },
    "calcular_ajuste_fci": {
        "message": "Para calcular el ajuste FCI, asegúrate de haber cargado tus datos y luego haz clic en 'Calcular ajuste FCI'.",
        "options": [
            { "text": "Volver al inicio", "action": "inicio" }
        ]
    },
    "ajustar_inflacion": {
        "message": "Para ajustar por inflación, realiza primero el cálculo FIFO y luego haz clic en 'Calcular Ajuste por Inflación'.",
        "options": [
            { "text": "Volver al inicio", "action": "inicio" }
        ]
    },
    "exportar_excel": {
        "message": "Para exportar los resultados a Excel, asegúrate de estar logueado y haz clic en 'Exportar a Excel' en la sección principal.",
        "options": [
            { "text": "Volver al inicio", "action": "inicio" }
        ]
    }
};

/**
 * Función para mostrar mensajes del chatbot en el chatbox.
 * @param {Object|string} messageObj - Objeto con mensaje y opciones o solo mensaje.
 * @param {boolean} isOptions - Indica si el mensaje incluye opciones de selección.
 */
function displayChatbotMessage(messageObj, isOptions = false) {
    const chatboxBody = document.getElementById('chatbox-body');
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'chatbot-message';

    if (isOptions && messageObj.options && messageObj.options.length > 0) {
        // Crear contenedor para opciones
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'chatbot-options';

        // Crear botones para cada opción
        messageObj.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'chatbot-option-btn';
            btn.textContent = option.text;
            btn.onclick = () => handleChatbotAction(option.action);
            optionsContainer.appendChild(btn);
        });

        botMsgDiv.innerHTML = `
            <img src="https://i.imgur.com/BoswpJZ.png" alt="Chatbot">
            <div>${messageObj.message}</div>
        `;
        botMsgDiv.appendChild(optionsContainer);
    } else {
        // Mensaje simple
        botMsgDiv.innerHTML = `
            <img src="https://i.imgur.com/BoswpJZ.png" alt="Chatbot">
            <div>${typeof messageObj === 'object' ? messageObj.message : messageObj}</div>
        `;
    }

    chatboxBody.appendChild(botMsgDiv);
    chatboxBody.scrollTop = chatboxBody.scrollHeight; // Scroll al final
}

/**
 * Función para manejar acciones del chatbot.
 * @param {string} action - Acción seleccionada por el usuario.
 */
function handleChatbotAction(action) {
    if (action.startsWith('download-')) {
        // Acciones de descarga
        const button = document.getElementById(action);
        if (button) {
            button.click();
            displayChatbotMessage({
                "message": "Descarga iniciada correctamente.",
                "options": [{ "text": "Volver al inicio", "action": "inicio" }]
            }, true);
        } else {
            displayChatbotMessage("No se pudo iniciar la descarga. Por favor, intenta nuevamente.", false);
        }
    } else if (chatbotOptions[action]) {
        const option = chatbotOptions[action];
        if (option.options && option.options.length > 0) {
            displayChatbotMessage(option, true);
        } else {
            displayChatbotMessage(option.message, false);
        }
    } else {
        // Respuesta por defecto si la acción no está definida
        displayChatbotMessage("Lo siento, no entiendo tu solicitud. Por favor, intenta seleccionar una opción válida.", false);
    }
}

/**
 * Función para iniciar el chatbot con el menú principal.
 */
function startChatbot() {
    document.getElementById('chatbox-body').innerHTML = ''; // Limpiar el cuerpo del chatbox
    displayChatbotMessage(chatbotOptions["inicio"], true);
    // Deshabilitar el input y botón de enviar
    document.getElementById('chat-input').disabled = true;
    document.getElementById('send-btn').disabled = true;
}

/**
 * Función para alternar la visibilidad del chatbox y iniciar el chatbot.
 */
function toggleChatbox() {
    const chatbox = document.getElementById('chatbox');
    if (chatbox.style.display === 'flex') {
        chatbox.style.display = 'none';
    } else {
        chatbox.style.display = 'flex';
        startChatbot();
    }
}

// Cerrar el chatbot al hacer clic fuera de él
document.addEventListener('click', function(event) {
    const chatbox = document.getElementById('chatbox');
    const chatbotBtn = document.querySelector('.chatbot-btn');
    const chatboxIsOpen = chatbox.style.display === 'flex';

    if (chatboxIsOpen && !chatbox.contains(event.target) && !chatbotBtn.contains(event.target)) {
        chatbox.style.display = 'none';
    }
});

/**
 * Función para enviar mensajes (habilitar envío con Enter).
 */
const chatInput = document.getElementById('chat-input');
chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
        event.preventDefault();
    }
});

/**
 * Función para enviar mensajes (deshabilitada en este enfoque basado en menús).
 */
function sendMessage() {
    // En este enfoque basado en menús, el usuario no envía mensajes libres.
    // Puedes optar por deshabilitar completamente esta funcionalidad o manejar mensajes de texto adicionales.
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (message === "") return;

    displayUserMessage(message);
    input.value = "";

    // Puedes optar por intentar mapear el mensaje a una acción o responder con opciones
    setTimeout(() => {
        processMessage(message);
    }, 500);
}

/**
 * Función para procesar mensajes libres (puedes adaptarla o deshabilitarla).
 */
function processMessage(message) {
    // Aquí podrías intentar mapear el mensaje libre a una de las opciones predefinidas
    // Por simplicidad, respondemos con un mensaje por defecto
    displayChatbotMessage("Por favor, selecciona una de las opciones disponibles para ayudarte mejor.", false);
    // Opcional: Reenviar al menú principal
    setTimeout(() => {
        displayChatbotMessage(chatbotOptions["inicio"], true);
    }, 2000);
}

/**
 * Función para mostrar mensajes del usuario en el chatbox.
 * @param {string} message - Mensaje del usuario.
 */
function displayUserMessage(message) {
    const chatboxBody = document.getElementById('chatbox-body');
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'user-message';

    userMsgDiv.innerHTML = `
        <div>${message}</div>
    `;

    chatboxBody.appendChild(userMsgDiv);
    chatboxBody.scrollTop = chatboxBody.scrollHeight; // Scroll al final
}

/* ========================================
   Funcionalidad para Descargar Ejemplos de Formato
======================================== */

/**
 * Función para descargar el formato de saldo inicial.
 */
function downloadSampleInitialBalance() {
    const wb = XLSX.utils.book_new();
    const wsData = [
        ["Fecha", "Producto", "Cantidad", "Costo", "Tipo"],
        ["2024-01-01", "Producto A", "100", "50.00", "Compra"],
        ["2024-02-01", "Producto B", "200", "30.00", "Compra"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Saldo_Inicial");
    XLSX.writeFile(wb, 'formato_saldo_inicial_ejemplo.xlsx');
}

/**
 * Función para descargar el formato de datos importados.
 */
function downloadSampleImportedData() {
    const wb = XLSX.utils.book_new();
    const wsData = [
        ["Fecha", "Producto", "Cantidad", "Costo", "Tipo"],
        ["2024-03-01", "Producto A", "50", "55.00", "Venta"],
        ["2024-04-01", "Producto C", "150", "20.00", "Compra"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Datos_Importados");
    XLSX.writeFile(wb, 'formato_datos_importados_ejemplo.xlsx');
}

/**
 * Función para descargar el formato de índices de inflación.
 */
function downloadSampleInflationIndices() {
    const wb = XLSX.utils.book_new();
    const wsData = [
        ["Año y mes", "INDICE"],
        ["2024-01", "1.02"],
        ["2024-02", "1.03"],
        ["2024-03", "1.01"],
        ["2024-04", "1.04"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Indices_Inflacion");
    XLSX.writeFile(wb, 'formato_indices_inflacion_ejemplo.xlsx');
}

/* ========================================
   Funciones de Formato y Carga de Archivos
======================================== */

/**
 * Función para convertir la fecha al formato YYYY-MM-DD.
 * @param {string|number} dateString - Fecha en formato string o número.
 * @returns {string} - Fecha formateada.
 */
function formatDateToYYYYMMDD(dateString) {
    if (!isNaN(dateString)) {
        const excelDate = new Date(Math.round((dateString - 25569) * 86400 * 1000));
        return excelDate.toISOString().split('T')[0];
    }

    if (typeof dateString === 'string') {
        if (dateString.includes('/')) {
            const [day, month, year] = dateString.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else if (dateString.includes('-')) {
            const [year, month, day] = dateString.split('-');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
    }

    console.error('Formato de fecha no válido:', dateString);
    return '';
}

/**
 * Función para cargar el archivo de índices de inflación.
 */
function uploadInflationIndices() {
    const fileInput = document.getElementById('inflationIndicesInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecciona un archivo Excel para los índices de inflación.');
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            let jsonData = XLSX.utils.sheet_to_json(sheet);

            if (jsonData.length === 0) {
                alert('El archivo de índices está vacío.');
                return;
            }

            // Formatear las fechas al cargar los índices
            inflationIndices = jsonData.map(entry => ({
                Fecha: formatDateToYYYYMMDD(entry['Año y mes']),
                Indice: parseFloat(entry['INDICE'])
            }));

            localStorage.setItem('inflationIndices', JSON.stringify(inflationIndices));

            showSuccessMessage('Archivo de índices de inflación cargado correctamente.');
        } catch (error) {
            alert('Error al procesar el archivo de índices de inflación. Revisa el formato del archivo.');
            console.error('Error al procesar el archivo de índices:', error);
        }
    };

    reader.readAsArrayBuffer(file);
}

/**
 * Función para cargar el saldo inicial.
 */
function uploadInitialBalance() {
    const fileInput = document.getElementById('initialBalanceInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecciona un archivo Excel para el saldo inicial.');
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            let jsonData = XLSX.utils.sheet_to_json(sheet);

            if (jsonData.length === 0) {
                alert('El archivo de saldo inicial está vacío.');
                return;
            }

            // Formatear las fechas al cargar el saldo inicial
            initialBalance = jsonData.map(entry => ({
                Fecha: formatDateToYYYYMMDD(entry.Fecha),
                Producto: entry.Producto,
                Cantidad: parseFloat(entry.Cantidad),
                Costo: parseFloat(entry.Costo),
                Tipo: entry.Tipo
            }));

            localStorage.setItem('initialBalance', JSON.stringify(initialBalance));
            displayInitialBalance();

            showSuccessMessage('Saldo inicial cargado correctamente.');
        } catch (error) {
            alert('Error al procesar el archivo de saldo inicial. Revisa el formato del archivo.');
            console.error('Error al procesar el archivo de saldo inicial:', error);
        }
    };

    reader.readAsArrayBuffer(file);
}

/**
 * Función para cargar los datos importados.
 */
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecciona un archivo Excel para los datos.');
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            let jsonData = XLSX.utils.sheet_to_json(sheet);

            if (jsonData.length === 0) {
                alert('El archivo de datos está vacío.');
                return;
            }

            // Formatear las fechas al cargar los datos importados
            importedData = jsonData.map(entry => ({
                Fecha: formatDateToYYYYMMDD(entry.Fecha),
                Producto: entry.Producto,
                Cantidad: parseFloat(entry.Cantidad),
                Costo: parseFloat(entry.Costo),
                Tipo: entry.Tipo
            }));

            localStorage.setItem('importedData', JSON.stringify(importedData));
            displayImportedData();

            showSuccessMessage('Datos importados cargados correctamente.');
        } catch (error) {
            alert('Error al procesar el archivo de datos. Revisa el formato del archivo.');
            console.error('Error al procesar el archivo de datos:', error);
        }
    };

    reader.readAsArrayBuffer(file);
}

/**
 * Función para mostrar el saldo inicial en la tabla.
 */
function displayInitialBalance() {
    const tableBody = document.querySelector('#initialBalanceTable tbody');
    tableBody.innerHTML = '';

    initialBalance.forEach((row) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.Fecha}</td>
            <td>${row.Producto}</td>
            <td>${row.Cantidad.toFixed(2)}</td>
            <td>${row.Costo.toFixed(2)}</td>
            <td>${row.Tipo}</td>
        `;
        tableBody.appendChild(tr);
    });
}

/**
 * Función para mostrar los datos importados en la tabla.
 */
function displayImportedData() {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    importedData.forEach((row) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.Fecha}</td>
            <td>${row.Producto}</td>
            <td>${row.Cantidad.toFixed(2)}</td>
            <td>${row.Costo.toFixed(2)}</td>
            <td>${row.Tipo}</td>
        `;
        tableBody.appendChild(tr);
    });
}

/* ========================================
   Funciones de Cálculo y Visualización
======================================== */

/**
 * Función para buscar el índice de inflación para una fecha específica (YYYY-MM).
 * @param {string} year - Año en formato YYYY.
 * @param {string} month - Mes en formato MM.
 * @returns {number|null} - Índice de inflación o null si no se encuentra.
 */
function getInflationIndex(year, month) {
    const indexEntry = inflationIndices.find(entry => {
        const formattedDate = entry.Fecha.slice(0, 7);
        const [indexYear, indexMonth] = formattedDate.split('-');
        return indexYear === year && indexMonth === String(month).padStart(2, '0');
    });

    if (!indexEntry) {
        console.warn(`Índice de inflación no encontrado para ${year}-${month}`);
    }

    return indexEntry ? parseFloat(indexEntry.Indice) : null;
}

/**
 * Función para calcular y mostrar los resultados del FIFO.
 */
function calculateAndDisplayFIFO() {
    if (importedData.length === 0 && initialBalance.length === 0) {
        alert('Por favor, carga un archivo antes de calcular el ajuste.');
        return;
    }

    const combinedData = initialBalance.concat(importedData);
    fifoResult = calculateFIFO(combinedData);

    // Generar el closingBalance para usar en el ajuste por inflación
    closingBalance = Object.keys(fifoResult).map(producto => {
        return fifoResult[producto].existencias.map(lote => ({
            Fecha: lote.fechaOriginal,
            Producto: producto,
            Cantidad: lote.cantidad,
            Costo: lote.costo,
            Tipo: 'Compra'
        }));
    }).flat();

    displayFIFOResults(fifoResult);
    displayClosingBalance(closingBalance);

    localStorage.setItem('fifoResult', JSON.stringify(fifoResult));
    showSuccessMessage('Cálculo FIFO realizado correctamente.');
}

/**
 * Función para realizar el cálculo FIFO.
 * @param {Array} data - Datos combinados de saldo inicial y datos importados.
 * @returns {Object} - Inventario resultante después del cálculo FIFO.
 */
function calculateFIFO(data) {
    const inventory = {};
    rescuedPurchasesAdjustments = {}; // Reiniciar el objeto de ajustes por producto

    // Ordenar los datos por Fecha para asegurar el orden FIFO
    const sortedData = data.slice().sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));

    sortedData.forEach((entry) => {
        const producto = entry.Producto;
        const cantidad = parseFloat(entry.Cantidad);
        const costo = parseFloat(entry.Costo);
        const tipo = entry.Tipo.toLowerCase();

        if (!inventory[producto]) {
            inventory[producto] = { existencias: [], cantidad: 0, costo: 0 };
        }

        if (!rescuedPurchasesAdjustments[producto]) {
            rescuedPurchasesAdjustments[producto] = 0; // Inicializar ajuste para el producto
        }

        if (tipo === 'compra') {
            // Añadir compra al inventario, con la fecha original y bandera si es inicial
            const isInitial = initialBalance.some(item =>
                item.Fecha === entry.Fecha &&
                item.Producto === entry.Producto &&
                item.Cantidad === entry.Cantidad &&
                item.Costo === entry.Costo
            );
            inventory[producto].existencias.push({ cantidad, costo, fechaOriginal: entry.Fecha, isInitial });
            inventory[producto].cantidad += cantidad;
            inventory[producto].costo += cantidad * costo;
        } else if (tipo === 'venta') {
            // Procesar venta usando FIFO
            let cantidadVenta = cantidad;

            while (cantidadVenta > 0 && inventory[producto].existencias.length > 0) {
                const lote = inventory[producto].existencias[0];

                const cantidadADescontar = Math.min(cantidadVenta, lote.cantidad);

                // Calcular el ajuste por inflación si el lote es de la existencia inicial
                if (lote.isInitial) {
                    const [year, month] = lote.fechaOriginal.split('-');
                    const indice = getInflationIndex(year, month);

                    if (indice !== null) {
                        const adjustedCost = lote.costo * indice;
                        const difference = (adjustedCost - lote.costo) * cantidadADescontar;
                        rescuedPurchasesAdjustments[producto] += difference;
                    }
                }

                // Actualizar inventario y cantidades
                lote.cantidad -= cantidadADescontar;
                inventory[producto].cantidad -= cantidadADescontar;
                inventory[producto].costo -= cantidadADescontar * lote.costo;
                cantidadVenta -= cantidadADescontar;

                if (lote.cantidad === 0) {
                    inventory[producto].existencias.shift(); // Remover lote del inventario
                }
            }

            if (cantidadVenta > 0) {
                alert(`La venta de "${producto}" excede el inventario disponible.`);
            }
        }
    });

    return inventory;
}

/**
 * Función para mostrar los resultados del cálculo FIFO.
 * @param {Object} fifoResult - Resultado del cálculo FIFO.
 */
function displayFIFOResults(fifoResult) {
    const tableBody = document.querySelector('#fifoResultTable tbody');
    tableBody.innerHTML = '';

    for (const producto in fifoResult) {
        const { cantidad, costo, existencias } = fifoResult[producto];
        const valorAjustado = calculateAdjustedValue(producto, existencias);
        const rescuedAdjustment = rescuedPurchasesAdjustments[producto] || 0;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto}</td>
            <td>${cantidad.toFixed(2)}</td>
            <td>${costo.toFixed(2)}</td>
            <td>${valorAjustado.toFixed(2)}</td>
            <td>${rescuedAdjustment.toFixed(2)}</td>
        `;
        tableBody.appendChild(tr);
    }
}

/**
 * Función para calcular el valor ajustado por inflación de un producto.
 * @param {string} producto - Nombre del producto.
 * @param {Array} existencias - Existencias del producto.
 * @returns {number} - Valor ajustado total.
 */
function calculateAdjustedValue(producto, existencias) {
    let totalAdjustedValue = 0;

    existencias.forEach(lote => {
        const [year, month] = lote.fechaOriginal.split('-');
        const indice = getInflationIndex(year, month);

        if (indice !== null) {
            const adjustedCost = lote.costo * indice;
            const adjustedValue = adjustedCost * lote.cantidad;
            totalAdjustedValue += adjustedValue;
        } else {
            console.warn(`No se pudo ajustar el lote de ${producto} del ${lote.fechaOriginal} por falta de índice.`);
        }
    });

    return totalAdjustedValue;
}

/**
 * Función para mostrar el saldo de cierre en la tabla.
 * @param {Array} closingBalance - Datos del saldo al cierre.
 */
function displayClosingBalance(closingBalance) {
    const tableBody = document.querySelector('#closingBalanceTable tbody');
    tableBody.innerHTML = '';

    closingBalance.forEach((row) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.Fecha}</td>
            <td>${row.Producto}</td>
            <td>${parseFloat(row.Cantidad).toFixed(2)}</td>
            <td>${parseFloat(row.Costo).toFixed(2)}</td>
            <td>${row.Tipo}</td>
        `;
        tableBody.appendChild(tr);
    });
}

/**
 * Función para calcular el ajuste por inflación.
 */
function calculateInflationAdjustment() {
    if (closingBalance.length === 0) {
        alert('Por favor, realiza el cálculo FIFO antes de ajustar por inflación.');
        return;
    }

    if (inflationIndices.length === 0) {
        alert('Por favor, carga el archivo de índices de inflación antes de ajustar.');
        return;
    }

    inflationAdjustedResults = closingBalance.map(operation => {
        const [year, month] = operation.Fecha.split('-');
        const indice = getInflationIndex(year, month);

        if (indice === null) {
            alert(`Índice de inflación no encontrado para la fecha ${operation.Fecha}.`);
            return null;
        }

        const updatedCost = operation.Costo * indice;
        const costoFinal = updatedCost * operation.Cantidad;

        return {
            Fecha: operation.Fecha,
            Producto: operation.Producto,
            Cantidad: operation.Cantidad,
            CostoOriginal: operation.Costo.toFixed(2),
            Indice: indice.toFixed(4),
            CostoActualizado: updatedCost.toFixed(2),
            CostoFinal: costoFinal.toFixed(2)
        };
    }).filter(result => result !== null);

    displayInflationAdjustedResults(inflationAdjustedResults);
    updateValuationTable(); // Actualizar la tabla de valuación impositiva con los valores ajustados
    showSuccessMessage('Ajuste por inflación realizado correctamente.');
}

/**
 * Función para mostrar los resultados del ajuste por inflación.
 * @param {Array} results - Resultados del ajuste por inflación.
 */
function displayInflationAdjustedResults(results) {
    const tableBody = document.querySelector('#inflationResultTable tbody');
    tableBody.innerHTML = ''; // Limpiar tabla anterior

    results.forEach(result => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${result.Fecha}</td>
            <td>${result.Producto}</td>
            <td>${parseFloat(result.Cantidad).toFixed(2)}</td>
            <td>${result.CostoOriginal}</td>
            <td>${result.Indice}</td>
            <td>${result.CostoActualizado}</td>
            <td>${result.CostoFinal}</td>
        `;
        tableBody.appendChild(tr);
    });
}

/**
 * Función para actualizar la tabla de Valuación Impositiva FCI con los valores ajustados.
 */
function updateValuationTable() {
    const tableBody = document.querySelector('#fifoResultTable tbody');

    // Crear un mapa de productos a valor ajustado total
    const adjustedValues = {};
    inflationAdjustedResults.forEach(item => {
        if (!adjustedValues[item.Producto]) {
            adjustedValues[item.Producto] = 0;
        }
        adjustedValues[item.Producto] += parseFloat(item.CostoFinal);
    });

    // Actualizar la tabla
    tableBody.querySelectorAll('tr').forEach(row => {
        const productName = row.querySelector('td:first-child').textContent;
        const adjustedValue = adjustedValues[productName] || 0;

        let adjustedValueCell = row.querySelector('td:nth-child(4)');
        adjustedValueCell.textContent = adjustedValue.toFixed(2);
    });
}

/* ========================================
   Funciones de Exportación y Gestión de Datos
======================================== */

/**
 * Función para proceder con la exportación.
 */
function proceedToExport() {
  

    if (Object.keys(fifoResult).length === 0) {
        alert('No hay resultados para exportar. Por favor, realiza el cálculo FIFO primero.');
        return;
    }

    const wb = XLSX.utils.book_new();

    // Exportar resultados del cálculo FIFO con ajuste por inflación
    const fifoExportData = [];
    for (const producto in fifoResult) {
        const { cantidad, costo } = fifoResult[producto];
        const adjustedValue = calculateAdjustedValue(producto, fifoResult[producto].existencias);
        const rescuedAdjustment = rescuedPurchasesAdjustments[producto] || 0;

        fifoExportData.push({
            Producto: producto,
            'Cantidad Total': cantidad.toFixed(2),
            'Costo Total': costo.toFixed(2),
            'Valor Ajustado por Inflación': adjustedValue.toFixed(2),
            'Actualización de compras rescatadas': rescuedAdjustment.toFixed(2)
        });
    }
    const fifoWs = XLSX.utils.json_to_sheet(fifoExportData);
    XLSX.utils.book_append_sheet(wb, fifoWs, 'Valuacion_Impositiva_FCI');

    // Exportar Saldo Cierre
    const closingBalanceWs = XLSX.utils.json_to_sheet(closingBalance, { header: ['Fecha', 'Producto', 'Cantidad', 'Costo', 'Tipo'] });
    XLSX.utils.book_append_sheet(wb, closingBalanceWs, 'Saldo_Cierre');

    // Exportar resultados del ajuste por inflación si existen
    if (inflationAdjustedResults.length > 0) {
        const inflationWs = XLSX.utils.json_to_sheet(inflationAdjustedResults);
        XLSX.utils.book_append_sheet(wb, inflationWs, 'Resultados_Ajustados');
    }

    // Exportar detalles por producto
    for (const producto in fifoResult) {
        const existencias = fifoResult[producto].existencias;

        if (existencias.length > 0) {
            const productData = existencias.map(lote => {
                const [year, month] = lote.fechaOriginal.split('-');
                const indice = getInflationIndex(year, month);
                const updatedCost = indice ? lote.costo * indice : lote.costo;
                const costoFinal = updatedCost * lote.cantidad;

                return {
                    Fecha: lote.fechaOriginal,
                    Producto: producto,
                    Cantidad: lote.cantidad.toFixed(2),
                    'Costo Original': lote.costo.toFixed(2),
                    Indice: indice ? indice.toFixed(4) : 'N/A',
                    'Costo Actualizado': updatedCost.toFixed(2),
                    'Costo Final': costoFinal.toFixed(2)
                };
            });

            const productWs = XLSX.utils.json_to_sheet(productData);
            let sheetName = producto.substring(0, 31).replace(/[/\\?*[\]]/g, ''); // Limitar el nombre de la hoja a 31 caracteres
            XLSX.utils.book_append_sheet(wb, productWs, sheetName);
        }
    }

    // Descargar el archivo Excel
    XLSX.writeFile(wb, 'resultados_ajuste_fci.xlsx');
}

/**
 * Función para cargar datos desde el almacenamiento local.
 */
function loadFromLocalStorage() {
    initialBalance = JSON.parse(localStorage.getItem('initialBalance')) || [];
    importedData = JSON.parse(localStorage.getItem('importedData')) || [];
    inflationIndices = JSON.parse(localStorage.getItem('inflationIndices')) || [];

    displayInitialBalance();
    displayImportedData();

    showSuccessMessage('Datos cargados desde el almacenamiento local.');
}

/**
 * Función para eliminar datos.
 */
function deleteData() {
    if (confirm('¿Estás seguro de que deseas eliminar todos los datos?')) {
        localStorage.clear();
        initialBalance = [];
        importedData = [];
        inflationIndices = [];
        fifoResult = {};
        closingBalance = [];
        inflationAdjustedResults = [];
        rescuedPurchasesAdjustments = {};

        document.querySelector('#initialBalanceTable tbody').innerHTML = '';
        document.querySelector('#dataTable tbody').innerHTML = '';
        document.querySelector('#fifoResultTable tbody').innerHTML = '';
        document.querySelector('#closingBalanceTable tbody').innerHTML = '';
        document.querySelector('#inflationResultTable tbody').innerHTML = '';

        showSuccessMessage('Todos los datos han sido eliminados.');
    }
}

/* ========================================
   Función para Mostrar Mensajes de Éxito
======================================== */

/**
 * Función para mostrar un mensaje de éxito.
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

/* ========================================
   Funciones Adicionales
======================================== */

/**
 * Función para desplazarse a una sección específica de la página.
 * @param {string} sectionId - ID de la sección a la que desplazarse.
 */
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}
