// Obtener el JSON con los datos
fetch('datos.json')
  .then(response => response.json())
  .then(data => {
    // Extraer las fechas y los estados operativos de cada máquina
    const fechas = [];
    const operativos = {
      operativo: [],
      disponible: [],
      transito: [],
      reparacion: [],
      desechado: []
    };
    data.forEach(d => {
      fechas.push(d.fecha);
      operativos.operativo.push(d.operativo);
      operativos.disponible.push(d.disponible);
      operativos.transito.push(d.transito);
      operativos.reparacion.push(d.reparacion);
      operativos.desechado.push(d.desechar);
    });

    // Crear un gráfico de barras
    const ctx = document.getElementById('grafico').getContext('2d');
    const grafico = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: fechas,
        datasets: [
          { label: 'Operativo', data: operativos.operativo },
          { label: 'Disponible', data: operativos.disponible },
          { label: 'En tránsito', data: operativos.transito },
          { label: 'En reparación', data: operativos.reparacion },
          { label: 'Desechado', data: operativos.desechado }
        ]
      },
      options: {
        scales: {
          yAxes: [{ ticks: { beginAtZero: true } }]
        }
      }
    });
  });
