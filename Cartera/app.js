// Variables Globales
let transactions = [];        // Datos de transacciones (compras y ventas)
let portfolio = {};           // Composición de la cartera actual
let realizedGains = [];       // Ganancias/Pérdidas realizadas
let currentPrices = {};       // Cotizaciones actuales ingresadas por el usuario
let exchangeRates = {};       // Cotizaciones de tipo de cambio guardadas

// Cargar cotizaciones de tipo de cambio desde archivo JSON
fetch('exchangeRates.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON de cotizaciones de tipo de cambio');
        }
        return response.json();
    })
    .then(data => {
        exchangeRates = data;
        console.log('Cotizaciones de tipo de cambio cargadas:', exchangeRates);
    })
    .catch(error => {
        console.error('Error al cargar las cotizaciones de tipo de cambio:', error);
    });

/**
 * Función para cargar el archivo de transacciones.
 */
function uploadTransactions() {
    const fileInput = document.getElementById('transactionsInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecciona un archivo Excel con los datos de las transacciones.');
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            console.log('Archivo leído correctamente. Procesando...');
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            let jsonData = XLSX.utils.sheet_to_json(sheet);

            if (jsonData.length === 0) {
                alert('El archivo está vacío.');
                console.error('El archivo Excel no contiene datos.');
                return;
            }

            // Formatear las fechas y almacenar las transacciones
            transactions = jsonData.map(entry => ({
                Fecha: formatDateToYYYYMMDD(entry.Fecha),
                Ticker: entry.Ticker,
                Cantidad: parseFloat(entry.Cantidad),
                Precio: parseFloat(entry.Precio),
                Bruto: parseFloat(entry.Bruto),
                CostosMercado: parseFloat(entry["Costos Mercado"]),
                Arancel: parseFloat(entry.Arancel),
                Neto: parseFloat(entry.Neto),
                Moneda: entry.Moneda,
                Tipo: entry.Tipo
            }));

            console.log('Transacciones cargadas:', transactions);
            showSuccessMessage('Transacciones cargadas correctamente.');
            displayTransactions();
        } catch (error) {
            alert('Error al procesar el archivo de transacciones. Revisa el formato del archivo.');
            console.error('Error al procesar el archivo de transacciones:', error);
        }
    };

    reader.onerror = (error) => {
        alert('Error al leer el archivo. Por favor, intenta nuevamente.');
        console.error('Error al leer el archivo:', error);
    };

    reader.readAsArrayBuffer(file);
}

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
 * Función para generar la composición de la cartera.
 */
function generatePortfolio() {
    if (transactions.length === 0) {
        alert('Por favor, carga las transacciones antes de generar la cartera.');
        return;
    }

    // Inicializar variables
    portfolio = {};
    realizedGains = [];

    // Ordenar las transacciones por fecha
    const sortedTransactions = transactions.slice().sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));

    // Procesar cada transacción
    sortedTransactions.forEach(transaction => {
        const ticker = transaction.Ticker;
        const cantidad = transaction.Cantidad;
        let precio = transaction.Precio;
        const tipo = transaction.Tipo.toLowerCase();
        let neto = transaction.Neto;

        // Convertir el precio y neto a pesos si la transacción está en dólares
        if (transaction.Moneda.toLowerCase() === 'dólares') {
            const exchangeRate = getExchangeRateForDate(transaction.Fecha);
            if (exchangeRate) {
                precio *= exchangeRate;
                neto *= exchangeRate;
            } else {
                alert(`No se encontró una cotización de tipo de cambio para la fecha ${transaction.Fecha}. Por favor, verifica las cotizaciones.`);
                return;
            }
        }

        if (!portfolio[ticker]) {
            portfolio[ticker] = {
                cantidad: 0,
                costoTotal: 0,
                compras: []
            };
        }

        if (tipo === 'compra') {
            // Agregar compra a la cartera
            portfolio[ticker].cantidad += cantidad;
            portfolio[ticker].costoTotal += neto; // Neto incluye costos de mercado y arancel
            portfolio[ticker].compras.push({
                cantidad,
                precio,
                fecha: transaction.Fecha
            });
        } else if (tipo === 'venta') {
            // Procesar venta y calcular ganancias/pérdidas realizadas
            let cantidadVenta = cantidad;
            let gananciaPerdida = 0;

            while (cantidadVenta > 0 && portfolio[ticker].compras.length > 0) {
                const compra = portfolio[ticker].compras[0];
                const cantidadADescontar = Math.min(cantidadVenta, compra.cantidad);
                const costoCompra = cantidadADescontar * compra.precio;
                const ingresoVenta = cantidadADescontar * precio;

                gananciaPerdida += ingresoVenta - costoCompra;

                // Actualizar compra y cartera
                compra.cantidad -= cantidadADescontar;
                portfolio[ticker].cantidad -= cantidadADescontar;
                portfolio[ticker].costoTotal -= costoCompra;
                cantidadVenta -= cantidadADescontar;

                if (compra.cantidad === 0) {
                    portfolio[ticker].compras.shift(); // Remover compra si se agotó
                }
            }

            if (cantidadVenta > 0) {
                alert(`La venta de "${ticker}" excede la cantidad disponible en la cartera.`);
            }

            realizedGains.push({
                Fecha: transaction.Fecha,
                Ticker: ticker,
                GananciaPerdida: gananciaPerdida.toFixed(2)
            });
        }
    });

    displayPortfolio();
    displayRealizedGains();
    showSuccessMessage('Composición de cartera generada correctamente.');
}

/**
 * Función para obtener la cotización del tipo de cambio para una fecha específica.
 * @param {string} date - Fecha en formato YYYY-MM-DD.
 * @returns {number} - Cotización del tipo de cambio.
 */
function getExchangeRateForDate(date) {
    if (exchangeRates[date]) {
        return exchangeRates[date];
    } else {
        // Buscar la cotización más cercana anterior a la fecha si no existe una exacta
        const availableDates = Object.keys(exchangeRates).sort();
        for (let i = availableDates.length - 1; i >= 0; i--) {
            if (availableDates[i] <= date) {
                return exchangeRates[availableDates[i]];
            }
        }
    }
    return null;
}

/**
 * Función para mostrar la composición de la cartera actual en la tabla.
 */
function displayPortfolio() {
    const tableBody = document.querySelector('#portfolioTable tbody');
    tableBody.innerHTML = '';

    for (const ticker in portfolio) {
        const data = portfolio[ticker];
        if (data.cantidad > 0) { // Mostrar solo acciones en cartera
            const costoPromedio = data.cantidad > 0 ? data.costoTotal / data.cantidad : 0;
            const valorActual = currentPrices[ticker] ? data.cantidad * currentPrices[ticker] : 0;
            const gananciaNoRealizada = valorActual - data.costoTotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ticker}</td>
                <td>${data.cantidad.toFixed(2)}</td>
                <td>${costoPromedio.toFixed(2)}</td>
                <td><input type="number" id="price_${ticker}" value="${currentPrices[ticker] || ''}" step="0.01" min="0" onchange="updatePrice('${ticker}')"></td>
                <td>${valorActual.toFixed(2)}</td>
                <td>${gananciaNoRealizada.toFixed(2)}</td>
            `;
            tableBody.appendChild(tr);
        }
    }
}

/**
 * Función para mostrar las ganancias/pérdidas realizadas en la tabla.
 */
function displayRealizedGains() {
    const tableBody = document.querySelector('#realizedGainsTable tbody');
    tableBody.innerHTML = '';

    realizedGains.forEach(gain => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${gain.Fecha}</td>
            <td>${gain.Ticker}</td>
            <td>${gain.GananciaPerdida}</td>
        `;
        tableBody.appendChild(tr);
    });
}

/**
 * Función para actualizar el precio de un título individual.
 * @param {string} ticker - Ticker del título.
 */
function updatePrice(ticker) {
    const priceInput = document.getElementById(`price_${ticker}`);
    const price = parseFloat(priceInput.value);
    if (!isNaN(price) && price > 0) {
        currentPrices[ticker] = price;
        displayPortfolio();
        showSuccessMessage(`Cotización de ${ticker} actualizada correctamente.`);
    } else {
        alert(`Por favor, ingresa un precio válido para "${ticker}".`);
    }
}

/**
 * Función para mostrar las transacciones cargadas con paginación.
 */
function displayTransactions(page = 1) {
    const transactionsPerPage = 10;
    const startIndex = (page - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    const tableBody = document.querySelector('#transactionsTable tbody');
    tableBody.innerHTML = '';

    paginatedTransactions.forEach(transaction => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${transaction.Fecha}</td>
            <td>${transaction.Ticker}</td>
            <td>${transaction.Cantidad}</td>
            <td>${transaction.Precio}</td>
            <td>${transaction.Bruto}</td>
            <td>${transaction.CostosMercado}</td>
            <td>${transaction.Arancel}</td>
            <td>${transaction.Neto}</td>
            <td>${transaction.Moneda}</td>
            <td>${transaction.Tipo}</td>
        `;
        tableBody.appendChild(tr);
    });

    // Actualizar botones de paginación
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';
    const totalPages = Math.ceil(transactions.length / transactionsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = i === page ? 'active' : '';
        button.onclick = () => displayTransactions(i);
        paginationDiv.appendChild(button);
    }
}

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

/**
 * Función para desplazarse a una sección específica de la página.
 * @param {string} sectionId - ID de la sección a la que desplazarse.
 */
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}