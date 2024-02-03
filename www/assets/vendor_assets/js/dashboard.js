/* custom tooltip */
const customTooltips = function (tooltip) {
  // Tooltip Element
  let tooltipEl = document.querySelector(".chartjs-tooltip");

  if (!this._chart.canvas.closest(".parentContainer").contains(tooltipEl)) {
    tooltipEl = document.createElement("div");
    tooltipEl.className = "chartjs-tooltip";
    tooltipEl.innerHTML = "<table></table>";

    document.querySelectorAll(".parentContainer").forEach((el) => {
      if (el.contains(document.querySelector(".chartjs-tooltip"))) {
        document.querySelector(".chartjs-tooltip").remove();
      }
    });

    this._chart.canvas.closest(".parentContainer").appendChild(tooltipEl);
  }

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set caret Position
  tooltipEl.classList.remove("above", "below", "no-transform");
  if (tooltip.yAlign) {
    tooltipEl.classList.add(tooltip.yAlign);
  } else {
    tooltipEl.classList.add("no-transform");
  }

  function getBody(bodyItem) {
    return bodyItem.lines;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map(getBody);

    let innerHtml = "<thead>";

    titleLines.forEach(function (title) {
      innerHtml += `<div class='tooltip-title'>${title}</div>`;
    });
    innerHtml += "</thead><tbody>";

    bodyLines.forEach(function (body, i) {
      const colors = tooltip.labelColors[i];
      let style = `background:${colors.backgroundColor}`;
      style += `; border-color:${colors.borderColor}`;
      style += "; border-width: 2px";
      style += "; border-radius: 30px";
      const span = `<span class="chartjs-tooltip-key" style="${style}"></span>`;
      innerHtml += `<tr><td>${span}${body}</td></tr>`;
    });

    innerHtml += "</tbody>";

    const tableRoot = tooltipEl.querySelector("table");
    tableRoot.innerHTML = innerHtml;
  }
  const toolTip = document.querySelector(".chartjs-tooltip");
  const positionY = this._chart.canvas.offsetTop;
  const positionX = this._chart.canvas.offsetLeft;
  const toolTipHeight = toolTip.clientHeight;
  const rtl = document.querySelector('html[dir="rtl"]');

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = `${
    positionX + tooltip.caretX - (rtl !== null ? toolTip.clientWidth : 0)
  }px`;
  tooltipEl.style.top = `${
    positionY +
    tooltip.caretY -
    (tooltip.caretY > 10
      ? toolTipHeight > 100
        ? toolTipHeight + 5
        : toolTipHeight + 15
      : 70)
  }px`;
  tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
  tooltipEl.style.fontSize = `${tooltip.bodyFontSize}px`;
  tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
  tooltipEl.style.padding = `${tooltip.yPadding}px ${tooltip.xPadding}px`;
};

document.addEventListener("DOMContentLoaded", function () {
  // Obtener los datos del JSON
  fetch(
    "https://quattropy.com/valeria/s1/public/api/stock/json/estado-maq-semana"
  )
    .then((response) => response.json())
    .then((data) => {
      // Recorrer los datos y generar un gráfico por cada estado
      data.forEach((chartData) => {
        // Obtener el elemento canvas por su ID
        var canvas = document.getElementById(chartData.selector);
        canvas.getContext("2d");
        canvas.height = 94;
        canvas.width = 130;
        // Obtener los datos del JSON
        var labels = Object.keys(chartData.data);
        var data = Object.values(chartData.data);

        // Crear el gráfico utilizando Chart.js
        new Chart(canvas, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: chartData.label,
                data: data,
                backgroundColor: chartData.bgColor,
                hoverBackgroundColor: chartData.hBgColor,
              },
            ],
          },
          options: {
            maintainAspectRatio: true,
            responsive: true,
            legend: {
              display: false,
              labels: {
                display: false,
              },
            },
            tooltips: {
              mode: "label",
              intersect: false,
              position: "average",
              enabled: false,
              custom: customTooltips,
              callbacks: {
                label(t, d) {
                  const dstLabel = d.datasets[t.datasetIndex].label;
                  const { yLabel } = t;
                  return `<span class="chart-data">${yLabel}</span> <span class="data-label">${dstLabel}</span>`;
                },
                labelColor(tooltipItem, chart) {
                  const dataset =
                    chart.config.data.datasets[tooltipItem.datasetIndex];
                  return {
                    backgroundColor: dataset.hoverBackgroundColor,
                    borderColor: "transparent",
                    usePointStyle: true,
                  };
                },
              },
            },
            scales: {
              yAxes: [
                {
                  stacked: true,
                  gridLines: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              ],
              xAxes: [
                {
                  stacked: true,
                  barPercentage: 1,
                  gridLines: {
                    display: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              ],
            },
          },
        });
      });
    });
});

document.addEventListener("DOMContentLoaded", function () {
  // Realizar la solicitud GET para obtener el JSON
  fetch(
    "https://quattropy.com/valeria/s1/public/api/stock/json/tipo-maq-estado"
  )
    .then((response) => response.json())
    .then((jsonData) => {
      // Obtener los elementos canvas para los gráficos
      const doughnutDisponibles = document
        .getElementById("chartDoughnutDisponibles")
        .getContext("2d");
      const doughnutOperativas = document
        .getElementById("chartDoughnutOperativas")
        .getContext("2d");
      const doughnutReparacion = document
        .getElementById("chartDoughnutReparacion")
        .getContext("2d");
      const doughnutTransito = document
        .getElementById("chartDoughnutTransito")
        .getContext("2d");

      // Obtener los datos y etiquetas para los gráficos
      const disponiblesData = jsonData.Disponibles.map((item) => item.cantidad);
      const disponiblesLabels = jsonData.Disponibles.map(
        (item) => item.prod_nombre
      );

      const operativasData = jsonData.Operativas.map((item) => item.cantidad);
      const operativasLabels = jsonData.Operativas.map(
        (item) => item.prod_nombre
      );

      const reparacionData = jsonData.Reparacion.map((item) => item.cantidad);
      const reparacionLabels = jsonData.Reparacion.map(
        (item) => item.prod_nombre
      );

      const transitoData = jsonData.Transito.map((item) => item.cantidad);
      const transitoLabels = jsonData.Transito.map((item) => item.prod_nombre);

      // Función para generar la leyenda con porcentaje
      const generateLegendWithPercentage = (chart) => {
        const legendCallback = chart.legend.options.labels.generateLabels;
        chart.legend.options.labels.generateLabels = function (chart) {
          const originalLabels = legendCallback.call(this, chart);
          const total = chart.data.datasets[0].data.reduce(
            (acc, val) => acc + val,
            0
          );
          originalLabels.forEach((label) => {
            const value = chart.data.datasets[0].data[label.index];
            const percentage = ((value / total) * 100).toFixed(2);
            label.text += ` (${percentage}%)`;
          });
          return originalLabels;
        };
      };

      // Crear los gráficos de dona
      const chartDisponibles = new Chart(doughnutDisponibles, {
        type: "doughnut",
        data: {
          labels: disponiblesLabels,
          datasets: [
            {
              data: disponiblesData,
              backgroundColor: [
                "#1abc9c",
                "#3498db",
                "#f39c12",
                "#9b59b6",
                "#e74c3c",
                "#34495e",
                "#95a5a6",
                "#e67e22",
                "#2ecc71",
                "#16a085",
              ],
            },
          ],
        },
        options: {
          cutoutPercentage: 70,
          maintainAspectRatio: true,
          responsive: true,
          legend: {
            display: true,
            position: "bottom",
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });
      generateLegendWithPercentage(chartDisponibles);

      const chartOperativas = new Chart(doughnutOperativas, {
        type: "doughnut",
        data: {
          labels: operativasLabels,
          datasets: [
            {
              data: operativasData,
              backgroundColor: [
                "#1abc9c",
                "#3498db",
                "#f39c12",
                "#9b59b6",
                "#e74c3c",
                "#34495e",
                "#95a5a6",
                "#e67e22",
                "#2ecc71",
                "#16a085",
              ],
            },
          ],
        },
        options: {
          cutoutPercentage: 70,
          maintainAspectRatio: true,
          responsive: true,
          legend: {
            display: true,
            position: "bottom",
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });
      generateLegendWithPercentage(chartOperativas);

      const chartReparacion = new Chart(doughnutReparacion, {
        type: "doughnut",
        data: {
          labels: reparacionLabels,
          datasets: [
            {
              data: reparacionData,
              backgroundColor: [
                "#1abc9c",
                "#3498db",
                "#f39c12",
                "#9b59b6",
                "#e74c3c",
              ],
            },
          ],
        },
        options: {
          cutoutPercentage: 70,
          maintainAspectRatio: true,
          responsive: true,
          legend: {
            display: true,
            position: "bottom",
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });
      generateLegendWithPercentage(chartReparacion);

      const chartTransito = new Chart(doughnutTransito, {
        type: "doughnut",
        data: {
          labels: transitoLabels,
          datasets: [
            {
              data: transitoData,
              backgroundColor: [
                "#1abc9c",
                "#3498db",
                "#f39c12",
                "#9b59b6",
                "#e74c3c",
              ],
            },
          ],
        },
        options: {
          cutoutPercentage: 70,
          maintainAspectRatio: true,
          responsive: true,
          legend: {
            display: true,
            position: "bottom",
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });
      generateLegendWithPercentage(chartTransito);
    })
    .catch((error) => {
      console.error("Error al obtener el JSON:", error);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  // Realizar la solicitud GET para obtener el JSON
  fetch("https://quattropy.com/valeria/s1/public/api/stock/json/tipo-maq-estado")
  .then((response) => response.json())
  .then((jsonData) => {
    // Obtener los elementos para las etiquetas HTML
    const donaDisponibles = document.getElementById("dona_disponibles");
    const donaOperativas = document.getElementById("dona_operativas");
    const donaReparacion = document.getElementById("dona_reparacion");
    const donaTransito = document.getElementById("dona_transito");

    // Obtener los datos para las sumas
    const disponiblesData = jsonData.Disponibles.map((item) => parseInt(item.cantidad));
    const operativasData = jsonData.Operativas.map((item) => parseInt(item.cantidad));
    const reparacionData = jsonData.Reparacion.map((item) => parseInt(item.cantidad));
    const transitoData = jsonData.Transito.map((item) => parseInt(item.cantidad));

    // Calcular las sumas
    const disponiblesSum = disponiblesData.reduce((acc, val) => acc + val, 0);
    const operativasSum = operativasData.reduce((acc, val) => acc + val, 0);
    const reparacionSum = reparacionData.reduce((acc, val) => acc + val, 0);
    const transitoSum = transitoData.reduce((acc, val) => acc + val, 0);

    // Completar las etiquetas HTML con las sumas
    donaDisponibles.innerHTML = disponiblesSum;
    donaOperativas.innerHTML = operativasSum;
    donaReparacion.innerHTML = reparacionSum;
    donaTransito.innerHTML = transitoSum;
  })
  .catch((error) => {
    console.error("Error al obtener el JSON:", error);
  });


  // Función para generar el gráfico de barras con Chart.js
  function generarGrafico(selector, bgColor, hBgColor, label, labels, values) {
    var ctx = document.getElementById(selector);
    if (ctx) {
      ctx.getContext("2d");
      var chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: label,
              data: values,
              backgroundColor: bgColor,
              hoverBackgroundColor: hBgColor,
            },
          ],
        },
        options: {
          maintainAspectRatio: true,
          responsive: true,
          legend: {
            display: false,
            position: "right",
          },
          tooltips: {
            mode: "label",
            intersect: false,
            position: "average",
            enabled: false,
            custom: customTooltips,
            callbacks: {
              label(t, d) {
                const dstLabel = d.datasets[t.datasetIndex].label;
                const { yLabel } = t;
                return yLabel;
              },
              labelColor(tooltipItem, chart) {
                const dataset =
                  chart.config.data.datasets[tooltipItem.datasetIndex];
                return {
                  backgroundColor: dataset.hoverBackgroundColor,
                  borderColor: "transparent",
                  usePointStyle: true,
                };
              },
            },
          },
          scales: {
            yAxes: [
              {
                stacked: false,
                gridLines: {
                  display: false,
                },
                ticks: {
                  display: true,
                },
              },
            ],
            xAxes: [
              {
                stacked: true,
                barPercentage: 1,
                gridLines: {
                  display: false,
                },
                ticks: {
                  display: false,
                },
              },
            ],
          },
        },
      });
    }
  }

  // Obtener los datos de la API y generar los gráficos
  fetch(
    "https://quattropy.com/valeria/s1/public/api/stock/json/top-10-productos"
  )
    .then((response) => response.json())
    .then((data) => {
      const labels = data.map((item) => item.producto);
      const values = data.map((item) => item["cantidad"]);

      // Llamar a la función generarGrafico para generar el gráfico top-10-productos
      generarGrafico(
        "top-10-productos",
        "#0065c510",
        "#0065c5",
        "Cantidad",
        labels,
        values
      );
    });

  fetch(
    "https://quattropy.com/valeria/s1/public/api/stock/json/top-10-productos-mensual"
  )
    .then((response) => response.json())
    .then((data) => {
      const labels = data.map((item) => item.producto);
      const values = data.map((item) => item["cantidad"]);

      // Llamar a la función generarGrafico para generar el gráfico top-10-productos-mensual
      generarGrafico(
        "top-10-productos-mensual",
        "#0065c510",
        "#0065c5",
        "Cantidad",
        labels,
        values
      );
    });

  fetch(
    "https://quattropy.com/valeria/s1/public/api/stock/json/top-10-productos-semanal"
  )
    .then((response) => response.json())
    .then((data) => {
      const labels = data.map((item) => item.producto);
      const values = data.map((item) => item["cantidad"]);

      // Llamar a la función generarGrafico para generar el gráfico top-10-productos-semanal
      generarGrafico(
        "top-10-productos-semanal",
        "#0065c510",
        "#0065c5",
        "Cantidad",
        labels,
        values
      );
    });

  // Obtener los datos de la API y generar los gráficos
  fetch(
    "https://quattropy.com/valeria/s1/public/api/stock/json/top-10-maquinas-anual"
  )
    .then((response) => response.json())
    .then((data) => {
      const labels = data.map((item) => item.producto);
      const values = data.map((item) => item["cantidad"]);

      // Llamar a la función generarGrafico para generar el gráfico top-10-productos
      generarGrafico(
        "top-10-maquinas-anual",
        "#0065c510",
        "#0065c5",
        "Cantidad",
        labels,
        values
      );
    });

  fetch(
    "https://quattropy.com/valeria/s1/public/api/stock/json/top-10-maquinas-mensual"
  )
    .then((response) => response.json())
    .then((data) => {
      const labels = data.map((item) => item.producto);
      const values = data.map((item) => item["cantidad"]);

      // Llamar a la función generarGrafico para generar el gráfico top-10-productos-mensual
      generarGrafico(
        "top-10-maquinas-mensual",
        "#0065c510",
        "#0065c5",
        "Cantidad",
        labels,
        values
      );
    });

  fetch(
    "https://quattropy.com/valeria/s1/public/api/stock/json/top-10-maquinas-semanal"
  )
    .then((response) => response.json())
    .then((data) => {
      const labels = data.map((item) => item.producto);
      const values = data.map((item) => item["cantidad"]);

      // Llamar a la función generarGrafico para generar el gráfico top-10-productos-semanal
      generarGrafico(
        "top-10-maquinas-semanal",
        "#0065c510",
        "#0065c5",
        "Cantidad",
        labels,
        values
      );
    });

  fetch(
    "https://quattropy.com/valeria/s1/public/api/stock/json/cantidad-deposito"
  )
    .then((response) => response.json())
    .then((data) => {
      const labels = data.map((item) => item.deposito);
      const values = data.map((item) => item.cantidad);

      // Llamar a la función generarGrafico para generar el gráfico top-10-depositos
      generarGrafico(
        "canva-top-10-depositos",
        "#0065c510",
        "#0065c5",
        "Cantidad",
        labels,
        values
      );
    });

  fetch(
    "https://quattropy.com/valeria/s1/public/api/stock/json/cantidad-ciudad"
  )
    .then((response) => response.json())
    .then((data) => {
      const labels = data.map((item) => item.ciudad);
      const values = data.map((item) => item.cantidad);

      // Llamar a la función generarGrafico para generar el gráfico top-10-ciudad
      generarGrafico(
        "canva-top-10-ciudad",
        "#0065c510",
        "#0065c5",
        "Cantidad",
        labels,
        values
      );
    });

  fetch(
    "https://quattropy.com/valeria/s1/public/api/stock/json/cantidad-usuario"
  )
    .then((response) => response.json())
    .then((data) => {
      const labels = data.map((item) => item.usuario);
      const values = data.map((item) => item.cantidad);

      // Llamar a la función generarGrafico para generar el gráfico top-10-agentes
      generarGrafico(
        "canva-top-10-agentes",
        "#0065c510",
        "#0065c5",
        "Cantidad",
        labels,
        values
      );
    });

  // Realizar una solicitud AJAX para obtener el JSON
  fetch(
    "https://quattropy.com/valeria/s1/public/api/stock/json/maquinas-inventariadas"
  )
    .then((response) => response.json())
    .then((data) => {
      // Obtener el número de máquinas inventariadas y no inventariadas
      const maquinasInventariadas = data.inventariadas;
      const maquinasNoInventariadas = data.no_inventariadas;
      const porcentaje_inventariadas = data.porcentaje_inventariadas;

      // Imprimir los resultados en las etiquetas HTML correspondientes
      document.getElementById("inventariadas").textContent =
        maquinasInventariadas;
      document.getElementById("no_inventariadas").textContent =
        maquinasNoInventariadas;

      var progress = porcentaje_inventariadas; // Ejemplo: 75% de progreso

      // Seleccionar el elemento de la barra de progreso
      var progressBar = document.getElementById("progreso_inventariadas");
      var avance_inventariadas = document.getElementById(
        "avance_inventariadas"
      );

      // Establecer el ancho de la barra de progreso en función del progreso actual
      progressBar.style.width = progress + "%";
      progressBar.setAttribute("aria-valuenow", progress);
      avance_inventariadas.textContent = progress + "%";
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });

  // Realizar una solicitud AJAX para obtener el JSON
  fetch(
    "https://quattropy.com/valeria/s1/public/api/stock/json/maq-reparacion-7-dias"
  )
    .then((response) => response.json())
    .then((data) => {
      // Obtener el número de máquinas inventariadas y no inventariadas
      const cantidad_total = data.cantidad_total;
      const cantidad_siete_dias = data.cantidad_siete_dias;
      const porcentaje = data.porcentaje;

      // Imprimir los resultados en las etiquetas HTML correspondientes
      document.getElementById("cant-7-dias").textContent = cantidad_siete_dias;
      document.getElementById("cant-total-7-dias").textContent = cantidad_total;
      document.getElementById("porcentaje-7-dias").textContent =
        porcentaje + "%";

      // Seleccionar el elemento de la barra de progreso
      var progressBar = document.getElementById("progress-7-dias");

      // Establecer el ancho de la barra de progreso en función del progreso actual
      progressBar.style.width = porcentaje + "%";
      progressBar.setAttribute("aria-valuenow", porcentaje);
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });
});
