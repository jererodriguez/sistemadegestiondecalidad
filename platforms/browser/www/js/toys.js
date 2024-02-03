// Función para obtener el formato deseado de la fecha
function obtenerFormatoFecha(fecha) {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const diaSemana = dias[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${diaSemana} ${dia} ${mes} ${hora}:${minutos}`;
}

// Función para actualizar la fecha y hora en el DOM
function actualizarFechaHora() {
    const fechaActual = new Date();
    const formatoFechaHora = obtenerFormatoFecha(fechaActual);
    
    // Actualizar el contenido en el elemento con el id 'fechahora' utilizando jQuery
    $('#fechahora').text(formatoFechaHora);
}

// Llamar a la función inicialmente para establecer el tiempo actual
actualizarFechaHora();

// Actualizar el tiempo cada segundo
setInterval(actualizarFechaHora, 1000);
