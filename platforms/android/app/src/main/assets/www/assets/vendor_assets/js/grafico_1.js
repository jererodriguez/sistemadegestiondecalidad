// Función para crear gráficos de tipo doughnut
function chartjsDoughnut(selector, cHeight, data) {
    var ctx = document.getElementById(selector);
    if (ctx) {
      // Obtener el contexto 2D del lienzo
      var context = ctx.getContext("2d");
      ctx.height = cHeight;
      
      // Crear el gráfico doughnut utilizando Chart.js
      var chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Operativo", "Disponible", "Transito","Reparacion","Desechar"],
          datasets: [{
            data: data,
            backgroundColor: ["#20C997", "#0065c5", "#FA8B0C","#0065c5", "#FA8B0C"],
          }],
        },
        options: {
          cutoutPercentage: 70,
          maintainAspectRatio: true,
          responsive: true,
          legend: {
            display: false,
            position: "bottom",
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });
    }
  }
  
  // Asignar eventos a las pestañas/tabulaciones y crear gráficos doughnut correspondientes
  
  // Pestaña "Hoy"
  $('#se_device-today-tab').one("shown.bs.tab", function () {
    chartjsDoughnut("chartDoughnut2T", "146", [111, 222, 333, 222, 333]);
  });
  
  // Pestaña "Semana"
  $('#se_device-week-tab').one("shown.bs.tab", function () {
    chartjsDoughnut("chartDoughnut2W", "146", [483, 870, 420, 222, 333]);
  });
  
  // Pestaña "Año"
  $('#se_device-year-tab').one("shown.bs.tab", function () {
    chartjsDoughnut("chartDoughnut2Y", "146", [9483, 13870, 15420, 222, 333]);
  });
  
  // Gráfico global
  chartjsDoughnut("chartDoughnut3", "146", [111, 222, 333, 222, 333]);
  
  // Pestaña "Semana" (segundo gráfico)
  $('#rb_device-week-tab').one("shown.bs.tab", function () {
    chartjsDoughnut("chartDoughnut3W", "146", [483, 870, 420, 222, 333]);
  });
  
  // Pestaña "Mes" (segundo gráfico)
  $('#rb_device-month-tab').one("shown.bs.tab", function () {
    chartjsDoughnut("chartDoughnut3M", "146", [4483, 5870, 2420, 222, 333]);
  });
  