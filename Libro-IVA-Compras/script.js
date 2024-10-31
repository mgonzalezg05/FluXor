// Variables globales para almacenar los datos procesados
let comprasErrorData = [];
let alicuotasErrorData = [];

// Manejo del estado del archivo cargado
document.getElementById("processComprasButton").addEventListener("click", processComprasFile);
document.getElementById("processAlicuotasButton").addEventListener("click", processAlicuotasFile);

// Asignar eventos de descarga para cada botón
document.getElementById("comprasDownload").addEventListener("click", () => {
  downloadFile("comprasDownload");
});
document.getElementById("alicuotasDownload").addEventListener("click", () => {
  downloadFile("alicuotasDownload");
});
document.getElementById("comprasErrorsDownload").addEventListener("click", () => {
  downloadErrorFile("comprasErrorsDownload");
});
document.getElementById("alicuotasErrorsDownload").addEventListener("click", () => {
  downloadErrorFile("alicuotasErrorsDownload");
});

// Muestra el estado de la carga del archivo
function showFileStatus(statusId) {
  document.getElementById(statusId).textContent = "Archivo cargado correctamente.";
}

// Procesamiento del archivo de Compras
function processComprasFile() {
  const comprasFile = document.getElementById("comprasFile").files[0];
  const resultMessage = document.getElementById("resultMessage");

  if (comprasFile) {
    resultMessage.textContent = "Procesando archivo de Compras...";
    readFile(comprasFile)
      .then(content => {
        try {
          const comprasData = parseComprasData(content);
          const { validData, errorData } = validateComprasData(comprasData);

          // Limpiar tablas anteriores
          clearTables();

          if (errorData.length > 0) {
            comprasErrorData = errorData;
            displayDataTable(errorData, "comprasErrorsTable", "Errores en Compras");
            generateErrorExcel(errorData, 'Compras_Errores.xlsx', "comprasErrorsDownload");
            document.getElementById("comprasErrorsDownload").style.display = "inline-block";
            resultMessage.textContent = `Se encontraron errores en ${errorData.length} líneas del archivo de Compras.`;
          }

          if (validData.length > 0) {
            generateExcel(validData, 'Compras_Correctas.xlsx', "comprasDownload");
            document.getElementById("comprasDownload").style.display = "inline-block";
            resultMessage.textContent += " Archivo de Compras procesado exitosamente. Listo para descargar.";
          }
        } catch (error) {
          console.error("Error al analizar el archivo de Compras:", error);
          resultMessage.textContent = "Error al analizar el archivo de Compras. Intente nuevamente.";
        }
      })
      .catch(error => {
        console.error("Error al leer el archivo de Compras:", error);
        resultMessage.textContent = "Error al leer el archivo de Compras. Intente nuevamente.";
      });
  } else {
    alert("Por favor, cargue el archivo de Compras Comprobantes.");
  }
}

// Procesamiento del archivo de Alícuotas
function processAlicuotasFile() {
  const alicuotasFile = document.getElementById("alicuotasFile").files[0];
  const resultMessage = document.getElementById("resultMessage");

  if (alicuotasFile) {
    resultMessage.textContent = "Procesando archivo de Alícuotas...";
    readFile(alicuotasFile)
      .then(content => {
        try {
          const alicuotasData = parseAlicuotasData(content);
          const { validData, errorData } = validateAlicuotasData(alicuotasData);

          // Limpiar tablas anteriores
          clearTables();

          if (errorData.length > 0) {
            alicuotasErrorData = errorData;
            displayDataTable(errorData, "alicuotasErrorsTable", "Errores en Alícuotas");
            generateErrorExcel(errorData, 'Alicuotas_Errores.xlsx', "alicuotasErrorsDownload");
            document.getElementById("alicuotasErrorsDownload").style.display = "inline-block";
            resultMessage.textContent = `Se encontraron errores en ${errorData.length} líneas del archivo de Alícuotas.`;
          }

          if (validData.length > 0) {
            generateExcel(validData, 'Alicuotas_Correctas.xlsx', "alicuotasDownload");
            document.getElementById("alicuotasDownload").style.display = "inline-block";
            resultMessage.textContent += " Archivo de Alícuotas procesado exitosamente. Listo para descargar.";
          }
        } catch (error) {
          console.error("Error al analizar el archivo de Alícuotas:", error);
          resultMessage.textContent = "Error al analizar el archivo de Alícuotas. Intente nuevamente.";
        }
      })
      .catch(error => {
        console.error("Error al leer el archivo de Alícuotas:", error);
        resultMessage.textContent = "Error al leer el archivo de Alícuotas. Intente nuevamente.";
      });
  } else {
    alert("Por favor, cargue el archivo de Compras Alícuotas.");
  }
}

// Leer archivo y convertirlo en texto
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// Analizar archivo de Compras
function parseComprasData(content) {
  const rows = content.split("\n");
  return rows.filter(row => row.trim() !== "").map(row => ({
    Fecha_Comprobante: row.slice(0, 8),
    Tipo_Comprobante: row.slice(8, 11),
    Punto_Venta: row.slice(11, 16),
    Numero_Comprobante: row.slice(16, 36),
    Despacho_Importacion: row.slice(36, 52),
    Codigo_Documento_Vendedor: row.slice(52, 54),
    Numero_ID_Vendedor: row.slice(54, 74),
    Nombre_Vendedor: row.slice(74, 104),
    Importe_Total: row.slice(104, 119),
    Conceptos_No_Gravados: row.slice(119, 134),
    Operaciones_Exentas: row.slice(134, 149),
    Percepciones_IVA: row.slice(149, 164),
    Percepciones_Otros_Impuestos_Nacionales: row.slice(164, 179),
    Percepciones_IB: row.slice(179, 194),
    Percepciones_Impuestos_Municipales: row.slice(194, 209),
    Impuestos_Internos: row.slice(209, 224),
    Codigo_Moneda: row.slice(224, 227),
    Tipo_Cambio: row.slice(227, 237),
    Cantidad_Alicuotas_IVA: row.slice(237, 238),
    Codigo_Operacion: row.slice(238, 239),
    Credito_Fiscal_Computable: row.slice(239, 254),
    Otros_Tributos: row.slice(254, 269),
    CUIT_Emisor_Corredor: row.slice(269, 280),
    Denominacion_Emisor_Corredor: row.slice(280, 310),
    IVA_Comision: row.slice(310, 325),
    Linea_Original: row
  }));
}

// Validar datos del archivo de Compras
function validateComprasData(data) {
  const validData = [];
  const errorData = [];

  data.forEach((row, index) => {
    const errors = [];
    if (!/^[0-9]{8}$/.test(row.Fecha_Comprobante)) {
      errors.push(`Fecha_Comprobante tiene un formato incorrecto.`);
    }
    if (!/^[0-9]+$/.test(row.Numero_ID_Vendedor.trim())) {
      errors.push(`Numero_ID_Vendedor debe contener solo dígitos.`);
    }
    if (!/^[0-9]+$/.test(row.Importe_Total.trim())) {
      errors.push(`Importe_Total debe contener solo dígitos.`);
    }
    if (!/^[A-Z0-9]*$/.test(row.Codigo_Moneda.trim())) {
      errors.push(`Codigo_Moneda tiene un formato incorrecto.`);
    }

    // **Nuevas Validaciones para Numero_Comprobante**
    if (/^0+$/.test(row.Numero_Comprobante.trim())) {
      errors.push(`Numero_Comprobante no puede estar compuesto solo por ceros.`);
    }
    if (row.Numero_Comprobante.includes('.')) {
      errors.push(`Numero_Comprobante no puede contener puntos.`);
    }

    if (errors.length > 0) {
      row.Errores = errors.join(" ");
      errorData.push(row);
    } else {
      validData.push(row);
    }
  });
  return { validData, errorData };
}

// Analizar archivo de Alícuotas
function parseAlicuotasData(content) {
  const rows = content.split("\n");
  return rows.filter(row => row.trim() !== "").map(row => ({
    Tipo_Comprobante: row.slice(0, 3),
    Punto_Venta: row.slice(3, 8),
    Numero_Comprobante: row.slice(8, 28),
    Codigo_Documento_Vendedor: row.slice(28, 30),
    Numero_ID_Vendedor: row.slice(30, 50),
    Importe_Neto_Gravado: row.slice(50, 65),
    Codigo_Alicuota_IVA: row.slice(65, 69),
    Impuesto_Liquidado: row.slice(69, 84),
    Linea_Original: row
  }));
}

// Validar datos del archivo de Alícuotas
function validateAlicuotasData(data) {
  const validData = [];
  const errorData = [];

  data.forEach((row, index) => {
    const errors = [];
    if (!/^[0-9]+$/.test(row.Numero_ID_Vendedor.trim())) {
      errors.push(`Numero_ID_Vendedor debe contener solo dígitos.`);
    }
    if (!/^[0-9]+$/.test(row.Importe_Neto_Gravado.trim())) {
      errors.push(`Importe_Neto_Gravado debe contener solo dígitos.`);
    }
    if (!/^[0-9]+$/.test(row.Impuesto_Liquidado.trim())) {
      errors.push(`Impuesto_Liquidado debe contener solo dígitos.`);
    }

    // **Nuevas Validaciones para Numero_Comprobante**
    if (/^0+$/.test(row.Numero_Comprobante.trim())) {
      errors.push(`Numero_Comprobante no puede estar compuesto solo por ceros.`);
    }
    if (row.Numero_Comprobante.includes('.')) {
      errors.push(`Numero_Comprobante no puede contener puntos.`);
    }

    if (errors.length > 0) {
      row.Errores = errors.join(" ");
      errorData.push(row);
    } else {
      validData.push(row);
    }
  });
  return { validData, errorData };
}

// Generar Excel
function generateExcel(data, fileName, downloadId) {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.getElementById(downloadId);
    link.href = url;
    link.download = fileName;
    link.style.display = "inline-block";
  } catch (error) {
    console.error("Error en generateExcel:", error);
    document.getElementById("resultMessage").textContent = "Error al generar el archivo Excel. Intente nuevamente.";
  }
}

// Generar Excel con líneas que contienen errores
function generateErrorExcel(errorData, fileName, downloadId) {
  try {
    const ws = XLSX.utils.json_to_sheet(errorData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Errores");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.getElementById(downloadId);
    link.href = url;
    link.download = fileName;
    link.style.display = "inline-block";
  } catch (error) {
    console.error("Error en generateErrorExcel:", error);
    document.getElementById("resultMessage").textContent = "Error al generar el archivo Excel con errores. Intente nuevamente.";
  }
}

// Mostrar tabla con datos
function displayDataTable(data, tableId, tableTitle) {
  let tableHtml = `<h2>${tableTitle}</h2><table id='${tableId}' class='display'><thead><tr>`;
  Object.keys(data[0]).forEach(key => {
    if (key !== 'Linea_Original') {
      tableHtml += `<th>${key}</th>`;
    }
  });
  tableHtml += "</tr></thead><tbody>";
  data.forEach(row => {
    tableHtml += "<tr>";
    Object.keys(row).forEach(key => {
      if (key !== 'Linea_Original') {
        tableHtml += `<td>${row[key]}</td>`;
      }
    });
    tableHtml += "</tr>";
  });
  tableHtml += "</tbody></table>";
  document.getElementById("table-container").innerHTML += tableHtml;
  $(`#${tableId}`).DataTable({
    responsive: true,
    autoWidth: true, // Asegura que las columnas se ajusten automáticamente
    columnDefs: [
      { targets: '_all', className: 'dt-center' } // Opcional: Centrar el contenido de las celdas
    ]
  });
}

// Limpiar tablas anteriores
function clearTables() {
  document.getElementById("table-container").innerHTML = "";
}

// Descargar archivo generado
function downloadFile(downloadId) {
  const link = document.getElementById(downloadId);
  if (link && link.href) {
    link.click();
    // Revocar la URL después de un retraso para asegurar que la descarga se inicie
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.href = "";
    }, 1000);
  } else {
    alert("No hay archivo para descargar.");
  }
}

// Descargar archivo de errores
function downloadErrorFile(downloadId) {
  const link = document.getElementById(downloadId);
  if (link && link.href) {
    link.click();
    // Revocar la URL después de un retraso para asegurar que la descarga se inicie
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.href = "";
    }, 1000);
  } else {
    alert("No hay archivo de errores para descargar.");
  }
}
