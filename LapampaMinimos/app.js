document.addEventListener('DOMContentLoaded', () => {
    const fileInputXML = document.getElementById('fileInputXML');
    const reviewBtn = document.getElementById('reviewBtn');
    const convertToExcelBtn = document.getElementById('convertToExcelBtn');
    const optionsSection = document.getElementById('optionsSection');
    const minTaxSection = document.getElementById('minTaxSection');
    const minTaxInput = document.getElementById('minTaxInput');
    const processMinTaxBtn = document.getElementById('processMinTaxBtn');
    const minTaxProcessing = document.getElementById('minTaxProcessing');
    const minTaxResult = document.getElementById('minTaxResult');
    const exportProcessedXMLBtn = document.getElementById('exportProcessedXMLBtn');
    const excelSection = document.getElementById('excelSection');
    const fileInputExcel = document.getElementById('fileInputExcel');
    const convertToXMLBtn = document.getElementById('convertToXMLBtn');
    const excelProcessing = document.getElementById('excelProcessing');
    const clearBtn = document.getElementById('clearBtn');
    const messageDiv = document.getElementById('message');
    
    let xmlData;
    let processedXMLBlob;
    let excelData;
  
    // Event Listeners
    fileInputXML.addEventListener('change', handleXMLFile);
    reviewBtn.addEventListener('click', showMinTaxSection);
    processMinTaxBtn.addEventListener('click', processMinTax);
    exportProcessedXMLBtn.addEventListener('click', exportProcessedXML);
    convertToExcelBtn.addEventListener('click', convertToExcel);
    fileInputExcel.addEventListener('change', handleExcelFile);
    convertToXMLBtn.addEventListener('click', convertExcelToXML);
    clearBtn.addEventListener('click', clearForm);
  
    function showMessage(type, text) {
      messageDiv.className = `message ${type}`;
      messageDiv.textContent = text;
      messageDiv.style.display = 'block';
      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 5000);
    }
  
    function handleXMLFile(event) {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
  
      reader.onload = function(e) {
        try {
          const parser = new DOMParser();
          const parsedXML = parser.parseFromString(e.target.result, "application/xml");
          const parserError = parsedXML.getElementsByTagName("parsererror");
          if (parserError.length > 0) {
            throw new Error("Error al parsear el archivo XML.");
          }
          xmlData = parsedXML;
          optionsSection.style.display = 'block';
          reviewBtn.disabled = false;
          convertToExcelBtn.disabled = false;
          showMessage('success', 'Archivo XML cargado correctamente.');
        } catch (error) {
          showMessage('error', error.message);
          clearForm();
        }
      };
  
      reader.onerror = function() {
        showMessage('error', "Error al leer el archivo XML.");
      };
  
      reader.readAsText(file);
    }
  
    function showMinTaxSection() {
      minTaxSection.style.display = 'block';
      excelSection.style.display = 'none';
    }
  
    function processMinTax() {
      const minTaxValue = parseFloat(minTaxInput.value);
      if (isNaN(minTaxValue) || minTaxValue < 0) {
        showMessage('error', 'Por favor, ingresa un impuesto mínimo válido.');
        return;
      }
  
      minTaxProcessing.style.display = 'block';
      setTimeout(() => {
        try {
          const result = applyMinTaxToXML(xmlData, minTaxValue);
          processedXMLBlob = new Blob([result.xmlString], {type: 'application/xml'});
          minTaxResult.innerHTML = `Procesamiento completado.<br>Cambios realizados: ${result.changesMade}<br>Nuevo TotImpRetenido: ${result.newTotalImpRetenido}`;
          minTaxResult.style.display = 'block';
          exportProcessedXMLBtn.style.display = 'inline-block';
          showMessage('success', 'XML procesado correctamente.');
        } catch (error) {
          showMessage('error', 'Error al procesar el XML: ' + error.message);
        } finally {
          minTaxProcessing.style.display = 'none';
        }
      }, 500);
    }
  
    function applyMinTaxToXML(xmlDoc, minTax) {
      const detalles = xmlDoc.getElementsByTagName('Detalle');
      let totalImpRetenido = 0;
      let changesMade = 0;
  
      for (let detalle of detalles) {
        const impRetenidoElement = detalle.getElementsByTagName('ImpRetenido')[0];
        let impRetenidoValue = parseFloat(impRetenidoElement.textContent);
        if (isNaN(impRetenidoValue)) impRetenidoValue = 0;
        if (impRetenidoValue < minTax) {
          impRetenidoElement.textContent = minTax.toString();
          impRetenidoValue = minTax;
          changesMade++;
        }
        totalImpRetenido += impRetenidoValue;
      }
  
      // Update TotImpRetenido
      const totImpRetenidoElement = xmlDoc.getElementsByTagName('TotImpRetenido')[0];
      if (totImpRetenidoElement) {
        totImpRetenidoElement.textContent = totalImpRetenido.toString();
      } else {
        // If TotImpRetenido doesn't exist, create it
        const totImpRetenidoElement = xmlDoc.createElement('TotImpRetenido');
        totImpRetenidoElement.textContent = totalImpRetenido.toString();
        xmlDoc.documentElement.appendChild(totImpRetenidoElement);
      }
  
      // Serialize XML back to string
      const serializer = new XMLSerializer();
      const xmlString = serializer.serializeToString(xmlDoc);
  
      return {
        xmlString: xmlString,
        newTotalImpRetenido: totalImpRetenido,
        changesMade: changesMade
      };
    }
  
    function exportProcessedXML() {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(processedXMLBlob);
      link.download = 'Sellados_La_Pampa_Procesado.xml';
      link.click();
    }
  
    function convertToExcel() {
      try {
        const rows = extractDataFromXML(xmlData);
        const blob = generateExcel(rows);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Sellados_La_Pampa.xlsx';
        link.click();
        showMessage('success', 'Conversión de XML a Excel completada.');
        // Mostrar sección para convertir Excel a XML
        excelSection.style.display = 'block';
      } catch (error) {
        showMessage('error', 'Error al convertir XML a Excel: ' + error.message);
      }
    }
  
    function extractDataFromXML(xml) {
      const rows = [];
  
      // Extraer metadatos
      const metadataKeys = ['Programa', 'TipoCta', 'Version', 'Fecha', 'Periodo', 'NroAgente', 'NroLiquidacion', 'NroRec', 'TotImpRetenido', 'TotMontoImp', 'TotLiquidaciones'];
      metadataKeys.forEach(key => {
        const element = xml.getElementsByTagName(key)[0];
        const value = element ? element.textContent : '';
        rows.push([key, value]);
      });
  
      // Extraer detalles
      const detalles = xml.getElementsByTagName('Detalle');
      rows.push(['ActosId', 'FechaRetencion', 'AlicuotaCod', 'AlicuotaPorcentaje', 'MonImponible', 'Exencion', 'ExencionDescrip', 'ImpRetenido', 'Cuit', 'Nombre', 'CaracterInvestido']);
  
      for (let detalle of detalles) {
        const row = [
          detalle.getElementsByTagName('ActosId')[0]?.textContent || '',
          detalle.getElementsByTagName('FechaRetencion')[0]?.textContent || '',
          detalle.getElementsByTagName('AlicuotaCod')[0]?.textContent || '',
          detalle.getElementsByTagName('AlicuotaPorcentaje')[0]?.textContent || '',
          detalle.getElementsByTagName('MonImponible')[0]?.textContent || '',
          detalle.getElementsByTagName('Exencion')[0]?.textContent || '',
          detalle.getElementsByTagName('ExencionDescrip')[0]?.textContent || '',
          detalle.getElementsByTagName('ImpRetenido')[0]?.textContent || '',
          detalle.getElementsByTagName('Cuit')[0]?.textContent || '',
          detalle.getElementsByTagName('Nombre')[0]?.textContent || '',
          detalle.getElementsByTagName('CaracterInvestido')[0]?.textContent || ''
        ];
        rows.push(row);
      }
  
      return rows;
    }
  
    function generateExcel(rows) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, 'Detalles');
  
      const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});
      return new Blob([s2ab(wbout)], {type: "application/octet-stream"});
    }
  
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    }
  
    function handleExcelFile(event) {
      const file = event.target.files[0];
      if (!file) return;
  
      excelProcessing.style.display = 'block';
  
      const reader = new FileReader();
  
      reader.onload = function(e) {
        try {
          const workbook = XLSX.read(e.target.result, {type: 'binary'});
          const sheetName = workbook.SheetNames[0];
          excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
          convertToXMLBtn.disabled = false;
          showMessage('success', 'Archivo Excel cargado correctamente.');
        } catch (error) {
          showMessage('error', 'Error al procesar el archivo Excel: ' + error.message);
        } finally {
          excelProcessing.style.display = 'none';
        }
      };
  
      reader.onerror = function() {
        showMessage('error', 'Error al leer el archivo Excel.');
        excelProcessing.style.display = 'none';
      };
  
      reader.readAsBinaryString(file);
    }
  
    function convertExcelToXML() {
      try {
        const xmlString = generateXMLFromExcel(excelData);
        const blob = new Blob([xmlString], {type: 'application/xml'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Sellados_La_Pampa_reprocesado.xml';
        link.click();
        showMessage('success', 'Conversión de Excel a XML completada.');
      } catch (error) {
        showMessage('error', 'Error al convertir Excel a XML: ' + error.message);
      }
    }
  
    function generateXMLFromExcel(data) {
      let xml = '<?xml version="1.0" encoding="ISO-8859-1"?>\n<DDJJ>\n';
  
      const metadataKeys = ['Programa', 'TipoCta', 'Version', 'Fecha', 'Periodo', 'NroAgente', 'NroLiquidacion', 'NroRec', 'TotImpRetenido', 'TotMontoImp', 'TotLiquidaciones'];
      metadataKeys.forEach((key, index) => {
        xml += `  <${key}>${sanitize(data[index][1])}</${key}>\n`;
      });
  
      xml += '  <Liquidaciones>\n';
      
      for (let i = 12; i < data.length; i++) { // A partir de la fila 13 (índice 12)
        const row = data[i];
        if (!row || row.length < 11) continue; // Asegurar que hay suficientes columnas
        
        xml += '    <Detalle>\n';
        xml += `      <ActosId>${sanitize(row[0])}</ActosId>\n`;
        xml += `      <FechaRetencion>${sanitize(row[1])}</FechaRetencion>\n`;
        xml += `      <AlicuotaCod>${sanitize(row[2])}</AlicuotaCod>\n`;
        xml += `      <AlicuotaPorcentaje>${sanitize(row[3])}</AlicuotaPorcentaje>\n`;
        xml += `      <MonImponible>${sanitize(row[4])}</MonImponible>\n`;
        xml += `      <Exencion>${sanitize(row[5])}</Exencion>\n`;
        xml += `      <ExencionDescrip>${sanitize(row[6])}</ExencionDescrip>\n`;
        xml += `      <ImpRetenido>${sanitize(row[7])}</ImpRetenido>\n`;
        xml += '      <Intervinientes>\n';
        xml += '        <Interviniente>\n';
        xml += `          <Cuit>${sanitize(row[8])}</Cuit>\n`;
        xml += `          <Nombre>${sanitize(row[9])}</Nombre>\n`;
        xml += `          <CaracterInvestido>${sanitize(row[10])}</CaracterInvestido>\n`;
        xml += '        </Interviniente>\n';
        xml += '      </Intervinientes>\n';
        xml += '    </Detalle>\n';
      }
  
      xml += '  </Liquidaciones>\n</DDJJ>';
      return xml;
    }
  
    function sanitize(value) {
      if (!value) return '';
      return value.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }
  
    function clearForm() {
      fileInputXML.value = '';
      fileInputExcel.value = '';
      minTaxInput.value = '';
      optionsSection.style.display = 'none';
      minTaxSection.style.display = 'none';
      excelSection.style.display = 'none';
      reviewBtn.disabled = true;
      convertToExcelBtn.disabled = true;
      convertToXMLBtn.disabled = true;
      exportProcessedXMLBtn.style.display = 'none';
      minTaxResult.style.display = 'none';
      messageDiv.style.display = 'none';
      xmlData = null;
      excelData = null;
      processedXMLBlob = null;
    }
  });
  