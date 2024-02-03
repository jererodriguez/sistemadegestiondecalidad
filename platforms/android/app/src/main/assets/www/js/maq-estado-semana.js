document.addEventListener("DOMContentLoaded", maq_estado_semana);

function maq_estado_semana () {
    // Obtener los elementos HTML por su ID
const cntOperativas = document.getElementById('cnt_operativas');
const colorOperativas = document.getElementById('color_operativas');
const porcentajeOperativas = document.getElementById('porcentaje_operativas');
const flechaOperativas = document.getElementById('flecha_operativas');

const cntDisponibles = document.getElementById('cnt_disponibles');
const colorDisponibles = document.getElementById('color_disponibles');
const porcentajeDisponibles = document.getElementById('porcentaje_disponibles');
const flechaDisponibles = document.getElementById('flecha_disponibles');

const cntTransito = document.getElementById('cnt_transito');
const colorTransito = document.getElementById('color_transito');
const porcentajeTransito = document.getElementById('porcentaje_transito');
const flechaTransito = document.getElementById('flecha_transito');

const cntReparacion = document.getElementById('cnt_reparacion');
const colorReparacion = document.getElementById('color_reparacion');
const porcentajeReparacion = document.getElementById('porcentaje_reparacion');
const flechaReparacion = document.getElementById('flecha_reparacion');

const cntTotal = document.getElementById('cnt_total');
const colorTotal = document.getElementById('color_total');
const porcentajeTotal = document.getElementById('porcentaje_total');
const flechaTotal = document.getElementById('flecha_total');

// Obtener el JSON desde la URL
fetch('https://quattropy.com/valeria/s1/public/api/stock/json/maq-estado-semana')
  .then(response => response.json())
  .then(data => {
    // Obtener los datos del JSON
    const operativas = data.operativas[0];
    const disponibles = data.disponibles[0];
    const transito = data.transito[0];
    const reparacion = data.reparacion[0];
    const total = data.total;

    // Modificar los elementos HTML con los datos correspondientes
    cntOperativas.innerHTML = operativas.operativashoy;
    colorOperativas.className = (operativas.resultado === 'negativo') ? 'color-danger' : 'color-success';
    porcentajeOperativas.innerHTML = operativas.semanaanterior;
    flechaOperativas.className = (operativas.resultado === 'positivo') ? 'las la-arrow-up' : 'las la-arrow-down';

    cntDisponibles.innerHTML = disponibles.disponibleshoy;
    colorDisponibles.className = (disponibles.resultado === 'negativo') ? 'color-danger' : 'color-success';
    porcentajeDisponibles.innerHTML = disponibles.semanaanterior;
    flechaDisponibles.className = (disponibles.resultado === 'positivo') ? 'las la-arrow-up' : 'las la-arrow-down';

    cntTransito.innerHTML = transito.transitohoy;
    colorTransito.className = (transito.resultado === 'negativo') ? 'color-danger' : 'color-success';
    porcentajeTransito.innerHTML = transito.semanaanterior;
    flechaTransito.className = (transito.resultado === 'positivo') ? 'las la-arrow-up' : 'las la-arrow-down';

    cntReparacion.innerHTML = reparacion.reparacionhoy;
    colorReparacion.className = (reparacion.resultado === 'negativo') ? 'color-danger' : 'color-success';
    porcentajeReparacion.innerHTML = reparacion.semanaanterior;
    flechaReparacion.className = (reparacion.resultado === 'positivo') ? 'las la-arrow-up' : 'las la-arrow-down';

    cntTotal.innerHTML = total.totalhoy;
    colorTotal.className = (total.resultado === 'negativo') ? 'color-danger' : 'color-success';
    porcentajeTotal.innerHTML = total.semanaanterior;
    flechaTotal.className = (total.resultado === 'positivo') ? 'las la-arrow-up' : 'las la-arrow-down';
  })
  .catch(error => {
    console.log('Error:', error);
  });

}