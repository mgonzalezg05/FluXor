// scripts.js

document.addEventListener("DOMContentLoaded", function () {
    // Elementos del DOM
    const processBtn = document.getElementById("processBtn");
    const clearBtn = document.getElementById("clearBtn");
    const exportBtn = document.getElementById("exportBtn");
    const fileInput = document.getElementById("fileInput");
    const facturasTable = document.getElementById("facturasTable").querySelector("tbody");
    const summaryTable = document.getElementById("summaryTable").querySelector("tbody");
    const aboutModal = document.getElementById("aboutModal");
    const aboutBtn = document.getElementById("aboutBtn");
    const addRuleBtn = document.getElementById("addRuleBtn");
    const addRuleModal = document.getElementById("addRuleModal");
    const saveRuleBtn = document.getElementById("saveRuleBtn");
    const rulesTable = document.getElementById("rulesTable").querySelector("tbody");
    const addProviderBtn = document.getElementById("addProviderBtn");
    const addProviderModal = document.getElementById("addProviderModal");
    const saveProviderBtn = document.getElementById("saveProviderBtn");
    const providersTable = document.getElementById("providersTable").querySelector("tbody");
    const providerNameInput = document.getElementById("providerName");
    const ruleColumn = document.getElementById("ruleColumn");
    const ruleCondition = document.getElementById("ruleCondition");
    const ruleValue = document.getElementById("ruleValue");
    const ruleCategory = document.getElementById("ruleCategory");
    const ruleComputability = document.getElementById("ruleComputability");
    const ruleProrate = document.getElementById("ruleProrate");
    const ruleComments = document.getElementById("ruleComments");
    const providerCondition = document.getElementById("providerCondition");
    const providerValue = document.getElementById("providerValue");
    const providerCategory = document.getElementById("providerCategory");
    const providerComputability = document.getElementById("providerComputability");
    const providerProrate = document.getElementById("providerProrate");
    const providerComments = document.getElementById("providerComments");
    const loadingIndicator = document.getElementById("loadingIndicator");
    const searchRulesInput = document.getElementById("searchRules");
    const searchProvidersInput = document.getElementById("searchProviders");
    const importRulesBtn = document.getElementById("importRulesBtn");
    const exportRulesBtn = document.getElementById("exportRulesBtn");
    const importProvidersBtn = document.getElementById("importProvidersBtn");
    const exportProvidersBtn = document.getElementById("exportProvidersBtn");
    const importRulesInput = document.getElementById("importRulesInput");
    const importProvidersInput = document.getElementById("importProvidersInput");
    const toggleRulesBtn = document.getElementById("toggleRulesBtn");
    const toggleProvidersBtn = document.getElementById("toggleProvidersBtn");
    const customRulesSection = document.getElementById("customRulesSection");
    const providersSection = document.getElementById("providersSection");

    let classificationRules = [];
    let providers = [];
    let clasificaciones = [];

    // Inicializar la aplicación
    function initializeApp() {
        // Cargar datos desde LocalStorage
        loadDataFromLocalStorage();

        // Inicializar eventos
        initEventListeners();

        // Cerrar modales
        closeModals();
    }

    // Inicializar eventos
    function initEventListeners() {
        // Carga y procesamiento de archivo Excel
        fileInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            processBtn.disabled = !file;
        });

        // Procesar facturas
        processBtn.addEventListener("click", processInvoices);

        // Limpiar la aplicación
        clearBtn.addEventListener("click", function () {
            fileInput.value = "";
            facturasTable.innerHTML = "";
            summaryTable.innerHTML = "";
            processBtn.disabled = true;
            exportBtn.disabled = true;
        });

        // Exportar resultados a Excel
        exportBtn.addEventListener("click", exportResults);

        // Mostrar modal 'Nosotros'
        aboutBtn.addEventListener("click", function () {
            aboutModal.style.display = "block";
        });

        // Agregar nueva regla de clasificación
        addRuleBtn.addEventListener("click", function () {
            resetRuleModal();
            addRuleModal.style.display = "block";
        });

        saveRuleBtn.addEventListener("click", saveRule);

        // Agregar nuevo proveedor
        addProviderBtn.addEventListener("click", function () {
            resetProviderModal();
            addProviderModal.style.display = "block";
        });

        saveProviderBtn.addEventListener("click", saveProvider);

        // Buscar en tablas
        searchRulesInput.addEventListener("input", function () {
            filterTable(rulesTable, this.value);
        });

        searchProvidersInput.addEventListener("input", function () {
            filterTable(providersTable, this.value);
        });

        // Exportar reglas y proveedores
        exportRulesBtn.addEventListener("click", exportRules);
        exportProvidersBtn.addEventListener("click", exportProviders);

        // Importar reglas y proveedores
        importRulesBtn.addEventListener("click", function () {
            importRulesInput.click();
        });
        importProvidersBtn.addEventListener("click", function () {
            importProvidersInput.click();
        });

        importRulesInput.addEventListener("change", importRules);
        importProvidersInput.addEventListener("change", importProviders);

        // Toggle Reglas
        toggleRulesBtn.addEventListener("click", function () {
            const rulesTableWrapper = customRulesSection.querySelector(".table-wrapper");
            if (window.getComputedStyle(rulesTableWrapper).display === "none") {
                rulesTableWrapper.style.display = "block";
                toggleRulesBtn.textContent = "Ocultar Tabla";
            } else {
                rulesTableWrapper.style.display = "none";
                toggleRulesBtn.textContent = "Mostrar Tabla";
            }
        });

        // Toggle Proveedores
        toggleProvidersBtn.addEventListener("click", function () {
            const providersTableWrapper = providersSection.querySelector(".table-wrapper");
            if (window.getComputedStyle(providersTableWrapper).display === "none") {
                providersTableWrapper.style.display = "block";
                toggleProvidersBtn.textContent = "Ocultar Tabla";
            } else {
                providersTableWrapper.style.display = "none";
                toggleProvidersBtn.textContent = "Mostrar Tabla";
            }
        });

        // Cerrar modales
        closeModals();
    }

    // Función para cerrar modales
    function closeModals() {
        document.querySelectorAll('.close').forEach(function (element) {
            element.onclick = function () {
                this.closest('.modal').style.display = 'none';
            };
        });

        // Cerrar modales al hacer clic fuera de ellos
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        };
    }

    // Función para resetear el modal de regla
    function resetRuleModal() {
        document.getElementById("ruleModalTitle").textContent = "Agregar Regla de Clasificación";
        ruleColumn.value = "";
        ruleCondition.value = "";
        ruleValue.value = "";
        ruleCategory.value = "";
        ruleComputability.value = "";
        ruleProrate.value = "";
        ruleComments.value = "";
        saveRuleBtn.onclick = saveRule;
    }

    // Función para resetear el modal de proveedor
    function resetProviderModal() {
        document.getElementById("providerModalTitle").textContent = "Agregar Proveedor";
        providerNameInput.value = "";
        providerCondition.value = "";
        providerValue.value = "";
        providerCategory.value = "";
        providerComputability.value = "";
        providerProrate.value = "";
        providerComments.value = "";
        saveProviderBtn.onclick = saveProvider;
    }

    // Función para cargar y procesar el archivo Excel
    function processInvoices() {
        const file = fileInput.files[0];
        if (!file) {
            alert("Por favor, carga un archivo Excel.");
            return;
        }

        // Mostrar indicador de carga
        loadingIndicator.style.display = "flex";

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheet];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Verificar que el archivo no esté vacío
                if (jsonData.length === 0) {
                    throw new Error("El archivo Excel está vacío.");
                }

                // Asumiendo que la primera fila contiene encabezados
                const headers = jsonData[0];
                const rows = jsonData.slice(1);

                const facturas = rows.map(row => {
                    const factura = {};
                    headers.forEach((header, index) => {
                        factura[header] = row[index];
                    });
                    return factura;
                });

                // Clasificación
                clasificaciones = facturas.map(factura => {
                    let categoria = "No Clasificada";
                    let computabilidad = "";
                    let prorrateo = "";
                    let comentarios = "";

                    // Aplicar reglas personalizadas
                    classificationRules.forEach(rule => {
                        if (!rule.condition || !rule.column || !rule.value) {
                            return;
                        }
                        const cellValue = factura[rule.column] ? factura[rule.column].toString() : "";
                        switch(rule.condition.toLowerCase()) {
                            case "comienza con":
                                if (cellValue.startsWith(rule.value)) {
                                    categoria = rule.category;
                                    computabilidad = rule.computability;
                                    prorrateo = rule.prorate;
                                    comentarios = rule.comments;
                                }
                                break;
                            case "contiene":
                                if (cellValue.includes(rule.value)) {
                                    categoria = rule.category;
                                    computabilidad = rule.computability;
                                    prorrateo = rule.prorate;
                                    comentarios = rule.comments;
                                }
                                break;
                            // Agregar más condiciones según necesidad
                            default:
                                break;
                        }
                    });

                    // Clasificación por proveedor
                    providers.forEach(provider => {
                        const providerName = provider.name ? provider.name.toString() : "";
                        const cellValue = factura["Proveedor"] ? factura["Proveedor"].toString() : "";

                        // Verificar si el proveedor de la factura coincide con el proveedor actual
                        if (cellValue.toLowerCase() === providerName.toLowerCase()) {
                            if (provider.condition && provider.value) {
                                const description = factura["Descripción"] ? factura["Descripción"].toString() : "";
                                switch(provider.condition.toLowerCase()) {
                                    case "comienza con":
                                        if (description.startsWith(provider.value)) {
                                            categoria = provider.category;
                                            computabilidad = provider.computability;
                                            prorrateo = provider.prorate;
                                            comentarios = provider.comments;
                                        }
                                        break;
                                    case "contiene":
                                        if (description.includes(provider.value)) {
                                            categoria = provider.category;
                                            computabilidad = provider.computability;
                                            prorrateo = provider.prorate;
                                            comentarios = provider.comments;
                                        }
                                        break;
                                    // Agregar más condiciones según necesidad
                                    default:
                                        break;
                                }
                            } else {
                                // Si condición y valor están vacíos, aplicar directamente la clasificación del proveedor
                                categoria = provider.category;
                                computabilidad = provider.computability;
                                prorrateo = provider.prorate;
                                comentarios = provider.comments;
                            }
                        }
                    });

                    return {
                        ...factura, // Incluir todos los datos originales
                        categoria: categoria,
                        computabilidad: computabilidad,
                        prorrateo: prorrateo,
                        comentarios: comentarios
                    };
                });

                // Renderizar en la tabla de facturas
                facturasTable.innerHTML = "";
                clasificaciones.forEach(factura => {
                    const row = facturasTable.insertRow();
                    row.insertCell(0).textContent = factura["Proveedor"] || "";
                    row.insertCell(1).textContent = factura["Descripción"] || "";
                    row.insertCell(2).textContent = factura.categoria;
                    row.insertCell(3).textContent = factura.computabilidad;
                    row.insertCell(4).textContent = factura.prorrateo;
                    row.insertCell(5).textContent = factura.comentarios;
                });

                // Calcular y renderizar la tabla de resumen
                renderSummaryTable();

                // Habilitar botón de exportar
                exportBtn.disabled = false;

                // Ocultar indicador de carga
                loadingIndicator.style.display = "none";
            } catch (error) {
                alert("Hubo un error al procesar el archivo Excel: " + error.message + ". Por favor, verifica el formato y vuelve a intentarlo.");
                loadingIndicator.style.display = "none";
            }
        };

        reader.onerror = function () {
            alert("Error al leer el archivo.");
            loadingIndicator.style.display = "none";
        };

        reader.readAsArrayBuffer(file);
    }

    // Función para calcular y renderizar la tabla de resumen
    function renderSummaryTable() {
        // Limpiar la tabla de resumen
        summaryTable.innerHTML = "";

        // Calcular los sumatorios
        const summaryData = {};

        clasificaciones.forEach(factura => {
            const categoria = factura.categoria || "No Clasificada";
            if (!summaryData[categoria]) {
                summaryData[categoria] = { "Directo": 0, "Común": 0, "No Computable": 0, "No Clasificado": 0 };
            }

            const computabilidad = factura.computabilidad || "No Clasificado";
            const saldo = parseFloat(factura["Saldo"]) || 0;

            if (computabilidad === "Directo") {
                summaryData[categoria]["Directo"] += saldo;
            } else if (computabilidad === "Común") {
                summaryData[categoria]["Común"] += saldo;
            } else if (computabilidad === "No Computable") {
                summaryData[categoria]["No Computable"] += saldo;
            } else {
                summaryData[categoria]["No Clasificado"] += saldo;
            }
        });

        // Renderizar la tabla de resumen
        for (const [categoria, valores] of Object.entries(summaryData)) {
            const row = summaryTable.insertRow();
            row.insertCell(0).textContent = categoria;
            row.insertCell(1).textContent = valores["Directo"].toFixed(2);
            row.insertCell(2).textContent = valores["Común"].toFixed(2);
            row.insertCell(3).textContent = valores["No Computable"].toFixed(2);
            row.insertCell(4).textContent = valores["No Clasificado"].toFixed(2);
        }
    }

    // Función para exportar resultados a Excel con la estructura solicitada
    function exportResults() {
        if (clasificaciones.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }

        const wb = XLSX.utils.book_new();

        // Definir encabezados para facturas clasificadas
        const wsData = [
            ["Fecha Contable", "Proveedor", "Número de Factura/Cheque", "Débito Contabilizado", "Crédito Contabilizado", "Descripción", "Fecha Factura/Pago", "Saldo", "Categoría", "Computabilidad", "Prorrateo", "Comentarios"]
        ];

        // Agregar filas de datos
        clasificaciones.forEach(factura => {
            wsData.push([
                factura["Fecha Contable"] || "",
                factura["Proveedor"] || "",
                factura["Número de Factura/Cheque"] || "",
                factura["Débito Contabilizado"] || "",
                factura["Crédito Contabilizado"] || "",
                factura["Descripción"] || "",
                factura["Fecha Factura/Pago"] || "",
                factura["Saldo"] || "",
                factura.categoria || "",
                factura.computabilidad || "",
                factura.prorrateo || "",
                factura.comentarios || ""
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Facturas Clasificadas");

        // Agregar hoja para resumen
        const summaryWsData = [
            ["Categoría", "Directo", "Común", "No Computable", "No Clasificado"]
        ];

        // Calcular los sumatorios para el resumen
        const summaryData = {};

        clasificaciones.forEach(factura => {
            const categoria = factura.categoria || "No Clasificada";
            if (!summaryData[categoria]) {
                summaryData[categoria] = { "Directo": 0, "Común": 0, "No Computable": 0, "No Clasificado": 0 };
            }

            const computabilidad = factura.computabilidad || "No Clasificado";
            const saldo = parseFloat(factura["Saldo"]) || 0;

            if (computabilidad === "Directo") {
                summaryData[categoria]["Directo"] += saldo;
            } else if (computabilidad === "Común") {
                summaryData[categoria]["Común"] += saldo;
            } else if (computabilidad === "No Computable") {
                summaryData[categoria]["No Computable"] += saldo;
            } else {
                summaryData[categoria]["No Clasificado"] += saldo;
            }
        });

        // Agregar filas de resumen
        for (const [categoria, valores] of Object.entries(summaryData)) {
            summaryWsData.push([
                categoria,
                valores["Directo"].toFixed(2),
                valores["Común"].toFixed(2),
                valores["No Computable"].toFixed(2),
                valores["No Clasificado"].toFixed(2)
            ]);
        }

        const summaryWs = XLSX.utils.aoa_to_sheet(summaryWsData);
        XLSX.utils.book_append_sheet(wb, summaryWs, "Resumen");

        XLSX.writeFile(wb, "Facturas_Clasificadas.xlsx");
    }

    // Función para guardar reglas en LocalStorage
    function saveRulesToLocalStorage() {
        localStorage.setItem("classificationRules", JSON.stringify(classificationRules));
    }

    // Función para guardar proveedores en LocalStorage
    function saveProvidersToLocalStorage() {
        localStorage.setItem("providers", JSON.stringify(providers));
    }

    // Función para cargar datos desde LocalStorage
    function loadDataFromLocalStorage() {
        if (localStorage.getItem("classificationRules")) {
            try {
                classificationRules = JSON.parse(localStorage.getItem("classificationRules"));
                // Filtrar reglas incompletas
                classificationRules = classificationRules.filter(rule => rule.column && rule.category && rule.computability && rule.prorate);
                renderRules();
            } catch (error) {
                classificationRules = [];
            }
        }

        if (localStorage.getItem("providers")) {
            try {
                providers = JSON.parse(localStorage.getItem("providers"));
                // No filtrar proveedores que tengan condición y valor vacíos
                renderProviders();
            } catch (error) {
                providers = [];
            }
        }
    }

    // Función para renderizar las reglas en la tabla
    function renderRules() {
        rulesTable.innerHTML = "";
        classificationRules.forEach((rule, index) => {
            const row = rulesTable.insertRow();
            row.insertCell(0).textContent = rule.column;
            row.insertCell(1).textContent = rule.condition;
            row.insertCell(2).textContent = rule.value;
            row.insertCell(3).textContent = rule.category;
            row.insertCell(4).textContent = rule.computability;
            row.insertCell(5).textContent = rule.prorate;
            row.insertCell(6).textContent = rule.comments;
            const actionsCell = row.insertCell(7);

            // Botón para editar regla con icono de lápiz
            const editBtn = document.createElement("button");
            editBtn.classList.add("action-btn", "edit");
            editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
            editBtn.onclick = function () {
                editRule(index);
            };
            actionsCell.appendChild(editBtn);

            // Botón para eliminar regla con icono de tacho de basura
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("action-btn", "delete");
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.onclick = function () {
                if (confirm("¿Estás seguro de que deseas eliminar esta regla?")) {
                    classificationRules.splice(index, 1);
                    renderRules();
                    saveRulesToLocalStorage();
                }
            };
            actionsCell.appendChild(deleteBtn);
        });
        saveRulesToLocalStorage();
    }

    // Función para renderizar los proveedores en la tabla
    function renderProviders() {
        providersTable.innerHTML = "";
        providers.forEach((provider, index) => {
            const row = providersTable.insertRow();
            row.insertCell(0).textContent = provider.name;
            row.insertCell(1).textContent = provider.condition || "";
            row.insertCell(2).textContent = provider.value || "";
            row.insertCell(3).textContent = provider.category;
            row.insertCell(4).textContent = provider.computability;
            row.insertCell(5).textContent = provider.prorate;
            row.insertCell(6).textContent = provider.comments;
            const actionsCell = row.insertCell(7);

            // Botón para editar proveedor con icono de lápiz
            const editBtn = document.createElement("button");
            editBtn.classList.add("action-btn", "edit");
            editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
            editBtn.onclick = function () {
                editProvider(index);
            };
            actionsCell.appendChild(editBtn);

            // Botón para eliminar proveedor con icono de tacho de basura
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("action-btn", "delete");
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.onclick = function () {
                if (confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
                    providers.splice(index, 1);
                    renderProviders();
                    saveProvidersToLocalStorage();
                }
            };
            actionsCell.appendChild(deleteBtn);
        });
        saveProvidersToLocalStorage();
    }

    // Función para guardar una nueva regla
    function saveRule() {
        const column = ruleColumn.value;
        const condition = ruleCondition.value.trim();
        const value = ruleValue.value.trim();
        const category = ruleCategory.value.trim();
        const computability = ruleComputability.value;
        const prorate = ruleProrate.value;
        const comments = ruleComments.value.trim();

        if (!column || !category || !computability || !prorate) {
            alert("Por favor, complete los campos obligatorios de la regla.");
            return;
        }

        const newRule = { column, condition, value, category, computability, prorate, comments };
        classificationRules.push(newRule);
        renderRules();

        // Limpiar campos
        resetRuleModal();

        addRuleModal.style.display = "none";
    }

    // Función para guardar un nuevo proveedor
    function saveProvider() {
        const name = providerNameInput.value.trim();
        const condition = providerCondition.value.trim();
        const value = providerValue.value.trim();
        const category = providerCategory.value.trim();
        const computability = providerComputability.value;
        const prorate = providerProrate.value.trim();
        const comments = providerComments.value.trim();

        if (!name || !category || !computability || !prorate) {
            alert("Por favor, complete los campos obligatorios del proveedor.");
            return;
        }

        // Verificar si el proveedor ya existe
        const exists = providers.some(provider => provider.name.toLowerCase() === name.toLowerCase());
        if (exists) {
            alert("El proveedor ya existe.");
            return;
        }

        const newProvider = { name, condition, value, category, computability, prorate, comments };
        providers.push(newProvider);
        renderProviders();

        // Limpiar campos
        resetProviderModal();

        addProviderModal.style.display = "none";
    }

    // Función para filtrar tablas
    function filterTable(tableBody, query) {
        const rows = tableBody.getElementsByTagName("tr");
        Array.from(rows).forEach(row => {
            const cells = row.getElementsByTagName("td");
            const rowText = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(" ");
            if (rowText.includes(query.toLowerCase())) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    // Función para editar una regla
    function editRule(index) {
        const rule = classificationRules[index];
        document.getElementById("ruleModalTitle").textContent = "Editar Regla de Clasificación";
        ruleColumn.value = rule.column;
        ruleCondition.value = rule.condition;
        ruleValue.value = rule.value;
        ruleCategory.value = rule.category;
        ruleComputability.value = rule.computability;
        ruleProrate.value = rule.prorate;
        ruleComments.value = rule.comments;

        addRuleModal.style.display = "block";

        // Cambiar el comportamiento del botón de guardar para editar
        saveRuleBtn.onclick = function () {
            const column = ruleColumn.value;
            const condition = ruleCondition.value.trim();
            const value = ruleValue.value.trim();
            const category = ruleCategory.value.trim();
            const computability = ruleComputability.value;
            const prorate = ruleProrate.value;
            const comments = ruleComments.value.trim();

            if (!column || !category || !computability || !prorate) {
                alert("Por favor, complete los campos obligatorios de la regla.");
                return;
            }

            classificationRules[index] = { column, condition, value, category, computability, prorate, comments };
            renderRules();

            // Limpiar campos y cerrar modal
            resetRuleModal();
            addRuleModal.style.display = "none";

            // Restaurar evento original
            saveRuleBtn.onclick = saveRule;
        };
    }

    // Función para editar un proveedor
    function editProvider(index) {
        const provider = providers[index];
        document.getElementById("providerModalTitle").textContent = "Editar Proveedor";
        providerNameInput.value = provider.name;
        providerCondition.value = provider.condition || "";
        providerValue.value = provider.value || "";
        providerCategory.value = provider.category;
        providerComputability.value = provider.computability;
        providerProrate.value = provider.prorate;
        providerComments.value = provider.comments;

        addProviderModal.style.display = "block";

        // Cambiar el comportamiento del botón de guardar para editar
        saveProviderBtn.onclick = function () {
            const name = providerNameInput.value.trim();
            const condition = providerCondition.value.trim();
            const value = providerValue.value.trim();
            const category = providerCategory.value.trim();
            const computability = providerComputability.value;
            const prorate = providerProrate.value.trim();
            const comments = providerComments.value.trim();

            if (!name || !category || !computability || !prorate) {
                alert("Por favor, complete los campos obligatorios del proveedor.");
                return;
            }

            // Verificar si el nuevo nombre del proveedor ya existe (excepto el actual)
            const exists = providers.some((prov, provIndex) => prov.name.toLowerCase() === name.toLowerCase() && provIndex !== index);
            if (exists) {
                alert("El proveedor ya existe.");
                return;
            }

            providers[index] = { name, condition, value, category, computability, prorate, comments };
            renderProviders();

            // Limpiar campos y cerrar modal
            resetProviderModal();
            addProviderModal.style.display = "none";

            // Restaurar evento original
            saveProviderBtn.onclick = saveProvider;
        };
    }

    // Función para exportar reglas a Excel
    function exportRules() {
        if (classificationRules.length === 0) {
            alert("No hay reglas para exportar.");
            return;
        }

        const wb = XLSX.utils.book_new();
        const wsData = [
            ["Columna", "Condición", "Valor", "Categoría", "Computabilidad", "Prorrateo", "Comentarios"]
        ];

        classificationRules.forEach(rule => {
            wsData.push([
                rule.column,
                rule.condition,
                rule.value,
                rule.category,
                rule.computability,
                rule.prorate,
                rule.comments
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Reglas");
        XLSX.writeFile(wb, "Reglas.xlsx");
    }

    // Función para exportar proveedores a Excel
    function exportProviders() {
        if (providers.length === 0) {
            alert("No hay proveedores para exportar.");
            return;
        }

        const wb = XLSX.utils.book_new();
        const wsData = [
            ["Nombre del Proveedor", "Condición", "Valor", "Categoría", "Computabilidad", "Prorrateo", "Comentarios"]
        ];

        providers.forEach(provider => {
            wsData.push([
                provider.name,
                provider.condition || "",
                provider.value || "",
                provider.category,
                provider.computability,
                provider.prorate,
                provider.comments || ""
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Proveedores");
        XLSX.writeFile(wb, "Proveedores.xlsx");
    }

    // Función para importar reglas desde Excel
    function importRules(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheet];
                const importedRules = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Validar encabezados
                const expectedHeaders = ["Columna", "Condición", "Valor", "Categoría", "Computabilidad", "Prorrateo", "Comentarios"];
                const fileHeaders = importedRules[0];
                const headersMatch = expectedHeaders.every((header, index) => header === fileHeaders[index]);

                if (!headersMatch) {
                    alert("El formato del archivo de reglas es incorrecto. Asegúrate de que las columnas sean: " + expectedHeaders.join(", "));
                    return;
                }

                // Procesar reglas importadas
                for (let i = 1; i < importedRules.length; i++) {
                    const row = importedRules[i];
                    if (row.length < expectedHeaders.length) {
                        continue;
                    }

                    const [column, condition, value, category, computability, prorate, comments] = row;
                    if (!column || !category || !computability || !prorate) {
                        continue;
                    }

                    const newRule = { column, condition, value, category, computability, prorate, comments: comments || "" };
                    classificationRules.push(newRule);
                }

                renderRules();
                alert("Reglas importadas exitosamente.");
            } catch (error) {
                alert("Hubo un error al importar las reglas: " + error.message + ". Por favor, verifica el formato del archivo.");
            }
        };
        reader.readAsArrayBuffer(file);
    }

    // Función para importar proveedores desde Excel
    function importProviders(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheet];
                const importedProviders = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Validar encabezados
                const expectedHeaders = ["Nombre del Proveedor", "Condición", "Valor", "Categoría", "Computabilidad", "Prorrateo", "Comentarios"];
                const fileHeaders = importedProviders[0];
                const headersMatch = expectedHeaders.every((header, index) => header === fileHeaders[index]);

                if (!headersMatch) {
                    alert("El formato del archivo de proveedores es incorrecto. Asegúrate de que las columnas sean: " + expectedHeaders.join(", "));
                    return;
                }

                // Procesar proveedores importados
                for (let i = 1; i < importedProviders.length; i++) {
                    const row = importedProviders[i];
                    if (row.length < expectedHeaders.length) {
                        continue;
                    }

                    const [name, condition, value, category, computability, prorate, comments] = row;
                    if (!name || !category || !computability || !prorate) {
                        continue;
                    }

                    // Verificar si el proveedor ya existe
                    const exists = providers.some(provider => provider.name.toLowerCase() === name.toLowerCase());
                    if (exists) {
                        continue;
                    }

                    const newProvider = { name, condition, value, category, computability, prorate, comments: comments || "" };
                    providers.push(newProvider);
                }

                renderProviders();
                alert("Proveedores importados exitosamente.");
            } catch (error) {
                alert("Hubo un error al importar los proveedores: " + error.message + ". Por favor, verifica el formato del archivo.");
            }
        };
        reader.readAsArrayBuffer(file);
    }

    // Inicializar la aplicación
    initializeApp();
});
