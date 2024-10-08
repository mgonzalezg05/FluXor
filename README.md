
# Fluxor - Herramientas de Optimización Operativa

![Fluxor Logo](https://imgur.com/H3s5z7X) 

Fluxor es una suite de herramientas desarrolladas para optimizar procesos operativos, financieros y tributarios. Nuestra misión es simplificar la vida de las personas mediante la implementación de inteligencia artificial y tecnología avanzada para mejorar la eficiencia y precisión en las tareas del día a día.

## Índice
- [Características](#características)
- [Aplicaciones](#aplicaciones)
  - [Valuación Impositiva de FCI (Cálculo FIFO)](#valuación-impositiva-de-fci-cálculo-fifo)
  - [Actualización por Inflación](#actualización-por-inflación)
  - [Eliminación de Caracteres Especiales](#eliminación-de-caracteres-especiales)
  - [Clasificación de Facturas](#clasificación-de-facturas)
  - [Gestión de Inversiones](#gestión-de-inversiones)
  - [Panel de Control Principal](#panel-de-control-principal)
  - [Aplicación de Cámara de Seguridad](#aplicación-de-cámara-de-seguridad)
  - [Chatbot General Integrado](#chatbot-general-integrado)
- [Instalación](#instalación)
- [Uso](#uso)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Características
- Herramientas especializadas en finanzas, inversión y manejo de archivos.
- Automatización y optimización de procesos tributarios.
- Diseño visual moderno y minimalista.
- Panel de control centralizado para un fácil acceso a todas las herramientas.
- Integración de tecnologías web (HTML, CSS, JavaScript) y Excel (VBA).
- Inteligencia artificial integrada para mejorar la experiencia del usuario.

## Aplicaciones

### Valuación Impositiva de FCI (Cálculo FIFO)
Aplicación que calcula la valuación impositiva de fondos comunes de inversión (FCI) utilizando el método FIFO. Permite la carga de datos, el cálculo de existencias y el ajuste por inflación. Los resultados se pueden exportar a Excel para su análisis.

### Actualización por Inflación
Esta herramienta aplica índices de inflación a los costos de las operaciones según el año y mes correspondientes, permitiendo obtener un costo ajustado. El índice se carga a través de un archivo externo y se actualiza en la tabla de resultados.

### Eliminación de Caracteres Especiales
Permite procesar archivos de texto eliminando caracteres especiales no deseados. El usuario puede personalizar qué caracteres se deben eliminar. Además, incluye opciones de reprocesamiento y login para usuarios autenticados.

### Clasificación de Facturas
Automatiza la clasificación de facturas según su descripción y criterios establecidos. La aplicación admite proveedores recurrentes y organiza las facturas por categoría para facilitar su manejo y procesamiento contable.

### Gestión de Inversiones
Una herramienta diseñada para gestionar portafolios de inversiones, incluyendo datos sobre CEDEARs y bonos públicos. Está integrada con Excel para automatizar la actualización de datos financieros en formato CSV o JSON.

### Panel de Control Principal
Un punto centralizado que permite acceder a todas las herramientas de Fluxor. Su diseño minimalista permite una navegación fluida y fácil entre las aplicaciones.

### Aplicación de Cámara de Seguridad
Actualmente en desarrollo, esta aplicación controlará cámaras de seguridad GADNIC SX90 plus, integrando funcionalidades como detección de humanos, visión nocturna, control de movimiento y sonido bidireccional.

### Chatbot General Integrado
Un chatbot que asiste a los usuarios dentro del panel de control, ayudando con la navegación y el uso de las herramientas. Está integrado en un modal emergente que se puede vincular con cualquier aplicación del sistema.

## Instalación

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/tu-usuario/fluxor.git
   ```

2. Accede al directorio del proyecto:
   ```bash
   cd fluxor
   ```

3. Instala las dependencias necesarias (si aplica):
   ```bash
   npm install
   ```

4. Inicia el servidor local para pruebas:
   ```bash
   npm start
   ```

## Uso

1. Abre el archivo `index.html` en tu navegador para acceder al panel de control principal.
2. Navega por las diferentes herramientas desde el panel de control.
3. Para cada herramienta, sigue las instrucciones en la interfaz para cargar archivos y realizar cálculos o procesar datos.
4. Puedes exportar los resultados a archivos Excel en aquellas herramientas que lo soportan.

## Contribuciones

Si deseas contribuir a Fluxor, sigue estos pasos:

1. Haz un fork de este repositorio.
2. Crea una rama para tu nueva funcionalidad:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y sube tu código a GitHub:
   ```bash
   git commit -m "Añadida nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```
4. Abre un Pull Request para que revisemos tus cambios.

## Licencia

Este proyecto está licenciado bajo los términos de la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
