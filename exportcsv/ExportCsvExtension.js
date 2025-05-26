document.addEventListener('DOMContentLoaded', function () {
  tableau.extensions.initializeAsync().then(() => {
    document.getElementById('exportButton').addEventListener('click', exportToCSV);
  });
});

async function exportToCSV() {
  const dashboard = tableau.extensions.dashboardContent.dashboard;
  const worksheet = dashboard.worksheets[0];

  try {
    const dataTable = await worksheet.getSummaryDataAsync();

    let csv = '';

    // Captura o array de colunas na ordem correta
    const columns = dataTable.columns.map(col => col.fieldName);
    csv += columns.map(name => `"${name}"`).join(';') + '\n';

    // Para cada linha, monta os dados respeitando a ordem dos cabeçalhos
    dataTable.data.forEach(row => {
      const orderedRow = columns.map((_, colIndex) => {
        const cell = row[colIndex];
        return `"${cell.formattedValue}"`;
      });
      csv += orderedRow.join(';') + '\n';
    });

    downloadCSV(csv, worksheet.name + '.csv');
  } catch (err) {
    console.error('Erro ao exportar CSV:', err.message);
  }
}



function downloadCSV (csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
