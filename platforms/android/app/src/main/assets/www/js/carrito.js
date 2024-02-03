
$(document).ready(function () {
  var idioma_espanol = {
    searchBuilder: {
      add: "Añadir condición",
      clearAll: "Borrar todo",
      data: "Columna",
      condition: "Condición",
      conditions: {
        date: {
          after: "Después",
          before: "Antes",
          between: "Entre",
          empty: "Vacío",
          equals: "Igual a",
          not: "No",
          notBetween: "No entre",
          notEmpty: "No vacío",
        },
        number: {
          between: "Entre",
          empty: "Vacío",
          equals: "Igual a",
          gt: "Mayor que",
          gte: "Mayor o igual que",
          lt: "Menor que",
          lte: "Menor o igual que",
          not: "No",
          notBetween: "No entre",
          notEmpty: "No vacío",
        },
        string: {
          contains: "Contiene",
          empty: "Vacío",
          endsWith: "Termina con",
          equals: "Igual a",
          not: "No",
          notEmpty: "No vacío",
          startsWith: "Empieza con",
        },
      },
      deleteTitle: "Eliminar condición",
      logicAnd: "Y",
      logicOr: "O",
      title: {
        _: "Requerimientos de búsqueda",
        0: "Requerimientos de búsqueda",
      },
      value: "Valor",
      valueJoiner: "y",
    },
    sProcessing: "Procesando...",
    sLengthMenu: "Mostrar _MENU_ registros",
    sZeroRecords: "No se encontraron resultados",
    sEmptyTable: "Ningún dato disponible en esta tabla",
    sInfo:
      "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
    sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
    sInfoPostFix: "",
    sSearch: "Buscar:",
    sUrl: "",
    sInfoThousands: ",",
    sLoadingRecords: "Cargando...",
    oPaginate: {
      sFirst: "Primero",
      sLast: "Último",
      sNext: "Siguiente",
      sPrevious: "Anterior",
    },
    oAria: {
      sSortAscending: ": Activar para ordenar la columna de manera ascendente",
      sSortDescending:
        ": Activar para ordenar la columna de manera descendente",
    },
    buttons: {
      copy: "Copiar",
      colvis: "Visibilidad",
    },
  };

  var cacheKey = "cachedJson";
  var cacheExpiration = 6 * 60 * 60 * 1000; // 6 horas en milisegundos

  // Obtener el JSON almacenado en caché, si existe y no ha expirado
  var cachedJson = localStorage.getItem(cacheKey);
  var cacheTimestamp = localStorage.getItem(cacheKey + "_timestamp");
  var currentTime = new Date().getTime();

  if (
    cachedJson &&
    cacheTimestamp &&
    currentTime - cacheTimestamp < cacheExpiration
  ) {
    // Cargar el JSON almacenado en caché
    var result = JSON.parse(cachedJson);
    initializeDataTable(result);
  } else {
    // Realizar la petición AJAX para obtener el JSON
    $.ajax({
      url: "http://local/s1/public/api/stock/caja/getProductos",
      method: "GET",
      dataType: "json",
      async: true,
      beforeSend: function () {
        // Mostrar indicador de carga o mensaje de espera
        // Puedes agregar un elemento HTML o mostrar una animación de carga
      },
      success: function (result) {
        // Guardar el JSON en caché
        localStorage.setItem(cacheKey, JSON.stringify(result));
        localStorage.setItem(cacheKey + "_timestamp", currentTime);

        initializeDataTable(result);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error:", errorThrown);
      },
      complete: function () {
        // Ocultar el indicador de carga o mensaje de espera
      },
    });
  }
  function initializeDataTable(result) {
    var miTabla = $("#productos").DataTable({
      data: result,
      columns: [
        { data: "data.foto", title: "Foto" },
        { data: "data.producto", title: "Producto" },
        { data: "precio", title: "Precio" },
        { data: "precio_mayorista", title: "P.May" },
        { data: "stock", title: "Disp" }
      ],
      language: idioma_espanol,
      rowCallback: function (row, data) {
        console.log(data)
      },
      dom: "Qlfrtip", // Agrega el contenedor de SearchBuilder a la estructura DOM
      searchBuilder: true, // Habilita SearchBuilder
      initComplete: function () {
        
      // Obtén el elemento con la clase "dtsb-searchBuilder"
      var divOrigen = document.querySelector(".dtsb-searchBuilder");
  
      // Obtén el elemento con el ID "#buscador-avanzado"
      var divDestino = document.getElementById("buscador-avanzado");
  
      // Verifica si ambos elementos existen en el documento
      if (divOrigen && divDestino) {
        // Mueve el elemento de origen al elemento de destino
        divDestino.appendChild(divOrigen);
      } else {
        // Alguno de los elementos no existe
        console.log("No se encontró el elemento de origen o destino.");
      }

      $('#buscador-avanzado').find('.dtsb-button').addClass('btn btn-primary');
      $('#buscador-avanzado').find('.dtsb-clearAll').addClass('btn btn-secondary');
      }
    });
  
    
    // Espera a que la tabla se haya inicializado completamente

    $("#buscar").on("keyup", function () {
      miTabla.search(this.value).draw();
    });

  }
  
});


