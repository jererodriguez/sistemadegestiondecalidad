$(document).ready(function () {
  // Obtener referencia al campo pesokg y al botón btnOkModalPeso
  var pesokg = document.getElementById('pesokg');
  var btnOk = document.getElementById('btnOkModalPeso');
  // Agregar evento para la tecla Enter en el campo pesokg
  pesokg.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') { // Verificar si la tecla presionada es Enter
      obtenerCantidadDesdeModalPeso(); // Llamar a la función para guardar la información
    }
  });

  
  var inputDesctotal = document.getElementById('inputdesctotal');
  var descPorcentajeTotal = document.getElementById('descporcentajetotal');
  // Agregar evento para la tecla Enter en inputdesctotal
  inputDesctotal.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      actualizarDescuentoTotal();
    }
  });
  // Agregar evento para la tecla Enter en descporcentajetotal
  descPorcentajeTotal.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      actualizarDescuentoTotal();
    }
  });


    // Lógica para el Modal Descuento
    var inputDesc = document.getElementById('inputdesc');
    var descPorcentaje = document.getElementById('descporcentaje');
    var btnOkModalDescuento = document.getElementById('btnOkModalDescuento');

    inputDesc.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            actualizarDescuento();
        }
    });

    descPorcentaje.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            actualizarDescuento();
        }
    });

    btnOkModalDescuento.addEventListener('click', function () {
        actualizarDescuento();
    });

    // Lógica para el Modal Descuento Total
    var inputDesctotal = document.getElementById('inputdesctotal');
    var descPorcentajeTotal = document.getElementById('descporcentajetotal');
    var btnOkModalDescuentoTotal = document.getElementById('btnOkModalDescuentoTotal');

    inputDesctotal.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            actualizarDescuentoTotal();
        }
    });

    descPorcentajeTotal.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            actualizarDescuentoTotal();
        }
    });

    btnOkModalDescuentoTotal.addEventListener('click', function () {
        actualizarDescuentoTotal();
    });

        // Lógica para el Modal Delivery
        var inputDelivery = document.getElementById('inputDelivery');
        var btnOkModalDelivery = document.getElementById('btnOkModalDelivery');
    
        inputDelivery.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                actualizarDelivery();
            }
        });
    
        btnOkModalDelivery.addEventListener('click', function () {
            actualizarDelivery();
        });
    
        // Lógica para el Modal Cupon
        var cuponNombre = document.getElementById('cuponNombre');
        var cuponCod = document.getElementById('cuponCod');
        var btnOkModalCupon = document.getElementById('btnOkModalCupon');
    
        cuponNombre.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                actualizarCupon();
            }
        });
    
        cuponCod.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                actualizarCupon();
            }
        });
    
        btnOkModalCupon.addEventListener('click', function () {
            actualizarCupon();
        });

});