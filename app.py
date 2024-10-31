from flask import Flask, request, send_file, render_template, jsonify
import camelot
import pandas as pd
import os

app = Flask(__name__, template_folder="templates", static_folder="static")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert_pdf_to_excel():
    try:
        if 'pdf' not in request.files:
            return jsonify({'error': 'No se proporcionó ningún archivo PDF.'}), 400

        pdf_file = request.files['pdf']
        pdf_path = os.path.join("temp", pdf_file.filename)
        pdf_file.save(pdf_path)

        # Configuración de salida
        output_path = os.path.join("temp", 'output.xlsx')
        writer = pd.ExcelWriter(output_path, engine='openpyxl')
        
        # Leer y extraer tablas del PDF con Camelot
        tables = camelot.read_pdf(pdf_path, pages='all', flavor='stream')

        # Guardar tablas en hojas de Excel
        for i, table in enumerate(tables):
            df = table.df  # Extraer la tabla como DataFrame de pandas
            df.to_excel(writer, sheet_name=f'Tabla_{i+1}', index=False)
        
        writer.save()
        writer.close()

        return send_file(output_path, as_attachment=True)

    except Exception as e:
        print(f"Error al procesar el archivo: {e}")
        return jsonify({'error': f'Error interno del servidor al procesar el archivo PDF: {e}'}), 500

if __name__ == '__main__':
    os.makedirs("temp", exist_ok=True)
    app.run(port=5000, debug=True)
