// Función para abrir el modal de descuento en el producto
function abrirModalDescuento(productId, descuento, porcentaje) {
  var inputDesc = document.getElementById(`inputdesc`);
  var descElement = document.getElementById(`descporcentaje`);
  var btnOk = document.getElementById("btnOkModalDescuento");
  btnOk.dataset.producto = productId;
  if (inputDesc && descElement && btnOk) {
    // Mostrar el descuento y porcentaje actuales en el modal
    var carritoProductos = JSON.parse(localStorage.getItem("carrito"));
    var producto = obtenerInformacionProducto(productId, carritoProductos);
    // Mostrar la información del producto en el modal
    document.getElementById("modalFotoProducto").src =
      "http://local/valeria/" + producto.ultima_foto;
    document.getElementById("modalNombreProducto").textContent =
      producto.producto;
    var idproducto = document.getElementById("modal-idproducto");
    document.getElementById("modalPrecioProducto").textContent =
      producto.precio.toFixed(2);
    document.getElementById("modalPrecioMayoristaProducto").textContent =
      producto.precio_mayorista.toFixed(2);
    // Mostrar el descuento y porcentaje actuales en el modal
    inputDesc.value = descuento;
    descElement.value = porcentaje;
    idproducto.value = productId;
    // Guardar el ID del producto actual en un atributo del botón OK
    // Mostrar el modal
    $("#modal-descuento").modal("show");
    setTimeout(function () {
      inputDesc.focus();
    }, 500);
    
  } else {
    console.error("Elementos no encontrados en abrirModalDescuento");
  }
}
$(document).ready(function () {
  var fuenteActualizacion = "";
  function actualizarDescuentoModal() {
    var precio = parseFloat($("#modalPrecioProducto").text());
    var inputdesc = parseFloat($("#inputdesc").val());
    var descporcentaje = parseFloat($("#descporcentaje").val());
    if (fuenteActualizacion === "inputdesc" && !isNaN(inputdesc)) {
      descporcentaje = (inputdesc / precio) * 100;
      $("#descporcentaje").val(descporcentaje.toFixed(2));
    } else if (
      fuenteActualizacion === "descporcentaje" &&
      !isNaN(descporcentaje)
    ) {
      inputdesc = (descporcentaje / 100) * precio;
      $("#inputdesc").val(inputdesc.toFixed(2));
    }
  }
  // Manejador de eventos para inputdesc
  $("#inputdesc").on("input", function () {
    fuenteActualizacion = "inputdesc";
    actualizarDescuentoModal();
  });
  // Manejador de eventos para descporcentaje
  $("#descporcentaje").on("input", function () {
    fuenteActualizacion = "descporcentaje";
    actualizarDescuentoModal();
  });
});
function actualizarDescuento() {
  // Obtener el valor del producto del atributo data-producto del botón Ok
  var productId = $(".descuento-input#modal-idproducto").val();
  // Verificar si el producto fue encontrado
  if (productId !== undefined && productId !== "") {
    // Encontrar el producto en el carrito
    //var product = carritoArray.find(item => item.id === productId);
    var product = ordenArray.find((item) => item.id === parseInt(productId));
    // Actualizar el descuento y el porcentaje del producto
    if (product !== undefined) {
      product.descuento = parseFloat($(".descuento-input#inputdesc").val());
      product.porcentaje = parseFloat($(".descuento-input#descporcentaje").val());
    }
    let productIndex = ordenArray.findIndex(
      (item) => item.id === parseInt(productId)
    );
    ordenArray[productIndex] = product;
    console.log("productIndex: " + productIndex);
    localStorage.setItem("carrito", JSON.stringify(ordenArray));
    // Actualizar el total en función de los nuevos valores
    actualizarTotal(productIndex);
    // Guardar en local storage
    // Actualizar la interfaz de la tabla del carrito
    actualizarTablaCarrito();
  } else {
    alert("ID del producto no válido");
  }
  // Ocultar el modal después de actualizar
  $("#modal-descuento").modal("hide");
}
// Función para abrir el modal de descuento en el ticket
function abrirModalDescuentoTotal() {
  var totalPrecioConDescuentoItems = document.getElementById("txttotalPrecioConDescuentoItems");
  var inputDesc = document.getElementById(`inputdesctotal`);
  var descElement = document.getElementById(`descporcentajetotal`);
  var btnOk = document.getElementById("btnOkModalDescuentoTotal");
  if (inputDesc && descElement && btnOk && ordenArray.length > 0) {
    var subtotal = JSON.parse(localStorage.getItem("subtotales"));
    var descFac = localStorage.getItem("descFac");
    var descFacPorcentaje = localStorage.getItem("descFacPorcentaje");
    totalPrecioConDescuentoItems.textContent = subtotal.totalPrecioConDescuentoItems.toFixed(2);
    inputDesc.value = descFac || 0;
    descElement.value = descFacPorcentaje || 0;
    // Mostrar el modal
    $("#modal-DescuentoTotal").modal("show");
    setTimeout(function () {
      inputDesc.focus();
    }, 500);
  } else {
    console.error("Elementos no encontrados");
  }
}
$(document).ready(function () {
  var fuente = "";
  function actualizarDescuentoModalTotal() {
    var total = parseFloat($("#txttotalPrecioConDescuentoItems").text());
    var inputdesc = parseFloat($("#inputdesctotal").val());
    var descporcentaje = parseFloat($("#descporcentajetotal").val());
    if (fuente === "inputdesc" && !isNaN(inputdesc)) {
      descporcentaje = (inputdesc / total) * 100;
      $("#descporcentajetotal").val(descporcentaje.toFixed(2));
    } else if (fuente === "descporcentaje" && !isNaN(descporcentaje)) {
      inputdesc = (descporcentaje / 100) * total;
      $("#inputdesctotal").val(inputdesc.toFixed(2));
    }
  }
  // Manejador de eventos para inputdesc
  $("#inputdesctotal").on("input", function () {
    fuente = "inputdesc";
    actualizarDescuentoModalTotal();
  });
  // Manejador de eventos para descporcentaje
  $("#descporcentajetotal").on("input", function () {
    fuente = "descporcentaje";
    actualizarDescuentoModalTotal();
  });
});
function actualizarDescuentoTotal() {
  var inputDesc = document.getElementById("inputdesctotal");
  var descElement = document.getElementById("descporcentajetotal");
  if (inputDesc && descElement) {
    // Obtener la información actualizada del modal
    //$("#descuentoAlTotal").show()
   
    var descuentoTotal = parseFloat(inputDesc.value) || 0;
    var descuentoPorcentaje = parseFloat(descElement.value) || 0;
    localStorage.setItem("descFac", descuentoTotal);
    localStorage.setItem("descFacPorcentaje", descuentoPorcentaje);
    // Cerrar el modal
    $("#modal-DescuentoTotal").modal("hide");
    calcularTotales()
  } else {
    console.error("Elementos no encontrados en actualizarDescuentoTotal");
  }
}
// Funcion para abrir el modal de Cargar Delivery
function abrirModalDelivery() {
  var inputDelivery = document.getElementById(`inputDelivery`);
  var btnOk = document.getElementById("btnOkModalDelivery");
  if (inputDelivery && btnOk) {
    var delivery = localStorage.getItem("delivery");
    // Mostrar el descuento y porcentaje actuales en el modal
    inputDelivery.value = delivery || 0;
    // Guardar el ID del producto actual en un atributo del botón OK
    // Mostrar el modal
    $("#modal-Delivery").modal("show");
    setTimeout(function () {
      inputDelivery.focus();
    }, 500);
  } else {
    console.error("Elementos no encontrados en abrirModalDelivery");
  }
}
function actualizarDelivery() {
  var inputDelivery = document.getElementById("inputDelivery");
  if (inputDelivery) {
    // Obtener la información actualizada del modal
    var montodelivery = parseFloat(inputDelivery.value) || 0;
    localStorage.setItem("delivery", montodelivery);
    // Cerrar el modal
    $("#modal-Delivery").modal("hide");
  } else {
    console.error("Elementos no encontrados en actualizarDescuentoTotal");
  }
  calcularTotales()
}
// Funcion para abrir el modal de Cargar Cupon
function abrirModalCupon() {
  var cuponNombre = document.getElementById(`cuponNombre`);
  var cuponCod = document.getElementById(`cuponCod`);
  var btnOk = document.getElementById("btnOkModalCupon");
  if (cuponNombre && cuponCod && btnOk) {
    // Mostrar el modal
    $("#modal-Cupon").modal("show");
    setTimeout(function () {
      cuponNombre.focus();
    }, 500);
  } else {
    console.error("Elementos no encontrados en abrirModalDescuento");
  }
}
function actualizarCupon() {
  var cuponNombre = document.getElementById(`cuponNombre`);
  var cuponCod = document.getElementById(`cuponCod`);
  if (cuponNombre && cuponCod) {
    // Obtener la información actualizada del modal
    alert('Nombre: ' + cuponNombre.value + '\n' + 'Cod. Cupon: ' + cuponCod.value)
    // Cerrar el modal
    $("#modal-Cupon").modal("hide");
  } else {
    console.error("Elementos no encontrados en actualizarCupon");
  }
}
// Funcion para abrir el modal para cargar el carrito por peso
function abrirModalPeso(productId) {
  var pesokg = document.getElementById(`pesokg`);
  var btnOk = document.getElementById("btnOkModalPeso");
  btnOk.dataset.producto = productId;
  if (pesokg && btnOk) {
    var carritoProductos = JSON.parse(localStorage.getItem("productos"));
    var producto = obtenerInformacionProducto(productId, carritoProductos);
    document.getElementById("modalFotoProductoPeso").src = "http://local/valeria/" + producto.ultima_foto;
    document.getElementById("modalNombreProductoPeso").textContent = producto.producto;
    var idproducto = document.getElementById("modal-idproductoPeso");
    pesokg.value = '';
    idproducto.value = productId;
    $("#modal-peso").modal("show");
    setTimeout(function () {
      pesokg.focus();
    }, 500);
  } else {
    console.error("Elementos no encontrados en abrirModalDescuento");
  }
}
function obtenerCantidadDesdeModalPeso() {
  var cantidad = parseFloat($("#pesokg").val()) || 0; // Obtener la cantidad desde el campo de entrada de peso
  var idproducto = $("#modal-idproductoPeso").val()
  cargarCarrito(idproducto, cantidad, false); // Llamar a cargarCarrito con la cantidad
  $('#modal-peso').modal('hide'); // Ocultar el modal después de cargar al carrito
}
// Funcion para abrir el modal Detalles
function abrirModalDetalles() {
  var DetallesNombre = document.getElementById(`DetallesNombre`);
  var btnOk = document.getElementById("btnOkModalDetalles");
  if (DetallesNombre && btnOk) {
    // Mostrar el modal
    $("#modal-Detalles").modal("show");
    setTimeout(function () {
      DetallesNombre.focus();
    }, 500);
  } else {
    console.error("Elementos no encontrados en abrirModalDetalles");
  }
}
function actualizarDetalles() {
  var DetallesNombre = document.getElementById(`DetallesNombre`);
  if (DetallesNombre) {
    // Obtener la información actualizada del modal
    alert('Detalles: ' + DetallesNombre.value)
    // Cerrar el modal
    $("#modal-Detalles").modal("hide");
  } else {
    console.error("Elementos no encontrados en actualizarDetalles");
  }
}

// Funcion para abrir el modal de Pagar
function abrirModalPagar() {
  var btnOk = document.getElementById("btnOkModalPagar");
  PagarNombre = $(".montoInput")
  if (btnOk) {
    // Mostrar el modal
    $("#modal-Pagar").modal("show");
    setTimeout(function () {
      PagarNombre.focus();
    }, 500);
  } else {
    console.error("Elementos no encontrados en abrirModalPagar");
  }
}

$(document).ready(function() {
  function realizarCalculos() {
      var montoIngresado = parseFloat($('.montoInput').last().val()) || 0;
      var montoAPagar = 70400000;

      $('#montoAPagar').text('Monto a Pagar G$ ' + montoAPagar.toLocaleString());

      if (montoIngresado < montoAPagar) {
          $('#vueltoRow').show();

          var montoRestante = montoAPagar - montoIngresado;
          $('#vuelto').text('G$ ' + montoRestante.toLocaleString());

          $('#montoRestanteRow').show();
      } else {
          $('#vueltoRow').hide();
          $('#montoRestanteRow').hide();
      }
  }

  $(document).on('keyup', '.montoInput', function(event) {
      if (event.key === "Enter") {
          event.preventDefault();
          realizarCalculos();
      }
  });

  function imprimirTicket() {
      console.log("Ticket impreso");
  }

  $(document).on('keyup', '.montoInput', function(event) {
      if (event.key === "Enter") {
          event.preventDefault();
          var montoIngresado = parseFloat($('.montoInput').last().val()) || 0;
          var montoAPagar = 70400000;
          if (montoIngresado >= montoAPagar) {
              imprimirTicket();
          }
      }
  });
});