import ExcelJS from 'exceljs';
import moment from 'moment';

export const exportToExcel = async (data, columns) => {
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Establecer estilos para el encabezado
    const headerStyle = {
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '2980BA' }, // Color de fondo amarillo
        },
        font: {
            bold: true,
            color: { argb: 'FFFFFF' }, // Color de texto negro
        },
        border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
    };

    // Establecer estilos para las celdas de datos
    const dataStyle = {
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF' }, // Color de fondo blanco
        },
        font: {
            bold: false,
            color: { argb: '000000' }, // Color de texto negro
        },
        border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
    };

    const headerRow = await columns.map(col => col.label); // Obtener solo los nombres personalizados
    const excelHeaderRow = worksheet.addRow(headerRow); // Agregar el encabezado y obtener la fila de Excel

    // Encabezado
    excelHeaderRow.eachCell((cell, colNumber) => {
        cell.fill = headerStyle.fill;
        cell.font = headerStyle.font;
        cell.border = headerStyle.border;
    });
    // Agregar los datos a la hoja de Excel
    data.forEach(row => {
        const rowData = columns.map(col => {
            // Verificar si la clave incluye la palabra 'fecha'
            if (col.key.toLowerCase().includes('fecha')) {
                // Formatear la fecha usando moment.js
                return moment(row[col.key]).format('YYYY-MM-DD');
            } else {
                return row[col.key];
            }
        });

        const excelRow = worksheet.addRow(rowData);

        // Aplicar estilos a cada celda en la fila
        excelRow.eachCell((cell, colNumber) => {
            if (excelRow.number === 1) { // Si es el encabezado
                cell.fill = headerStyle.fill;
                cell.font = headerStyle.font;
                cell.border = headerStyle.border;
            } else { // Si es una fila de datos
                cell.fill = dataStyle.fill;
                cell.font = dataStyle.font;
                cell.border = dataStyle.border;
            }
        });
    });


    // Ajustar anchos de las columnas
    worksheet.columns.forEach(column => {
        let maxWidth = 0;
        column.eachCell({ includeEmpty: true }, cell => {
            const len = cell.value ? cell.value.toString().length : 10;
            if (len > maxWidth) {
                maxWidth = len;
            }
        });
        column.width = maxWidth < 10 ? 10 : maxWidth;
    });

    // Generar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Descargar el archivo
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reportes.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
};
