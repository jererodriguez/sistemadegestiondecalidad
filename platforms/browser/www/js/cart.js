// Array para almacenar los productos seleccionados
var ordenArray = [];
// Llamar a actualizarTablaCarrito al cargar la página
actualizarTablaCarrito();
$(document).ready(function () {
  // Obtener datos JSON desde la URL
  var cacheKey = "productos";
  var cacheExpiration = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

  // Obtener los datos de productos almacenados en caché, si existen y no han expirado
  var cachedData = localStorage.getItem(cacheKey);
  var cacheTimestamp = localStorage.getItem(cacheKey + "_timestamp");
  var currentTime = new Date().getTime();

  if (
    cachedData &&
    cacheTimestamp &&
    currentTime - cacheTimestamp < cacheExpiration
  ) {
    // Usar los datos almacenados en caché
    populateTable(JSON.parse(cachedData));
  } else {
    // Realizar la petición AJAX para obtener los datos de productos
    $.ajax({
      url: "http://local/s1/public/api/stock/caja/getProductos",
      method: "GET",
      dataType: "json",
      cache: false, // Aunque no se utilice el caché del navegador, se implementará un caché personalizado con localStorage
      success: function (jsonData) {
        // Guardar los datos en caché
        localStorage.setItem(cacheKey, JSON.stringify(jsonData.data));
        localStorage.setItem(cacheKey + "_timestamp", currentTime);

        populateTable(jsonData.data);
      },
      error: function (error) {
        console.error("Error fetching data:", error);
      },
    });
  }

  // Función para poblar la tabla con datos
  function populateTable(data) {
    var tbody = $("#productos tbody");
    tbody.empty(); // Limpiar el cuerpo de la tabla antes de agregar nuevos datos

    data.forEach(function (dataItem) {
      // (Aquí el mismo código que ya tienes para construir cada fila)
      var row = "<tr class='row'>";
      row +=
        '<td class="col-md-6"><div class="media  align-items-center"><img class="mr-3 wh-50 align-self-center radius-xl bg-opacity-primary" src="http://local/valeria/' +
        dataItem.ultima_foto +
        '" alt="' +
        dataItem.producto +
        '"><div class="media-body"><h5>' +
        dataItem.producto +
        '</h5><div class="d-flex"><div class="detalles">ID:' +
        dataItem.id +
        " IVA:" +
        dataItem.iva +
        " Disp:" +
        dataItem.total_stock +
        "</div> </div></div></div></td>";
      // Formatear el precio con comas para decimales y puntos como separador de miles
      var precioFormateado = parseFloat(dataItem.precio).toLocaleString(
        "es-ES",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      );

      // Eliminar decimales si son "00"
      if (precioFormateado.endsWith("00")) {
        precioFormateado = precioFormateado.substring(
          0,
          precioFormateado.length - 3
        );
      }

      row += '<td class="col-md-2 detalles">' + precioFormateado + "</td>";

      row += '<td class="col-md-3 detalles">' + dataItem.categoria + "</td>";
      // Verifica si la unidad de medida es 4
      if (dataItem.simbolo !== "U") {
        // Si es 4, cambia el evento onclick
        row +=
          '<td class="col-md-1"><div class="quantity product-cart__quantity"><input type="button" value="+1" onclick="abrirModalPeso(' +
          dataItem.id +
          ')" class="qty-plus bttn bttn-right wh-36" style="font-size:1em;"></div></td>';
      } else {
        // Si no es 4, utiliza el evento onclick original
        row +=
          '<td class="col-md-1"><div class="quantity product-cart__quantity"><input type="button" value="+1" onclick="cargarCarrito(' +
          dataItem.id +
          ')" class="qty-plus bttn bttn-right wh-36" style="font-size:1em;"></div></td>';
      }
      tbody.append(row);
    });

    // Inicializar Footable con las opciones deseadas
    var table = $("#productos").footable({
      paging: {
        enabled: true,
      },
      sorting: {
        enabled: true,
      },
      filtering: {
        enabled: true,
      },
      columns: [{ name: "producto" }, { name: "categoria" }],
    });
  }

  const productos = JSON.parse(localStorage.getItem("productos"));
  const categorias = [
    ...new Set(productos.map((producto) => producto.categoria)),
  ]; // Obtener categorías únicas
  const selectCat = document.getElementById("select_cat");

  categorias.forEach((categoria) => {
    const option = new Option(categoria, categoria, false, false);
    selectCat.appendChild(option);
  });

  // Aplicar Select2 al elemento select múltiple
  //$("#select_cat").select2();

  $("#select_cat").select2({
    placeholder: "Cat.",
  });

  $("#select_cat").on("change", function () {
    var categoriasSeleccionadas = $(this).val() || []; // Obtener categorías seleccionadas
    $("#buscador").val(categoriasSeleccionadas.join(" OR "));
    $("#buscador").keypress();
  });
});


// Función para generar un UUID v4 (versión 4)
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
// Función para cargar el JSON
function cargarCarrito(productId, nuevaCantidad = 1, actualizar = false) {
  // Obtener el producto correspondiente desde localstorage.productos
  var productos = JSON.parse(localStorage.getItem("productos"));
  var productoSeleccionado = productos.find(
    (producto) => producto.id === parseInt(productId)
  );
  if (!productoSeleccionado) {
    console.error("Producto no encontrado con ID: ", productId);
    console.log("Productos disponibles: ", productos);
    return;
  }
  // Generar un UUID para el producto cargado en el carrito
  var productoUUID = generateUUID();
  var productIndex = ordenArray.findIndex((item) => item.id === productId);
  if (productIndex !== -1) {
    // Si el producto ya está en el array, actualizar la cantidad
    if (nuevaCantidad > 1 || actualizar == true) {
      ordenArray[productIndex].cantidad = nuevaCantidad;
    } else {
      ordenArray[productIndex].cantidad += 1;
    }
    // Actualizar el total en función de la nueva cantidad
    actualizarTotal(productIndex);
  } else {
    // Si el producto no está en el array, agregarlo con la nueva cantidad
    var cantidad = nuevaCantidad; // Utiliza la cantidad pasada como parámetro
    var descuento = 0;
    var porcentaje = ((descuento / productoSeleccionado.precio) * 100).toFixed(
      2
    );
    ordenArray.unshift({
      uuid: productoUUID, // Agregar el identificador único (UUID)
      id: productId,
      cantidad: cantidad,
      descuento: descuento,
      porcentaje: porcentaje,
      total: calcularTotal(productoSeleccionado.precio, cantidad, descuento),
      ...productoSeleccionado, // Agregar la información detallada del producto
    });
    calcularTotales();
  }
  // Guardar en local storage
  localStorage.setItem("carrito", JSON.stringify(ordenArray));
  // Actualizar la interfaz de la tabla del carrito
  if ($("#carrito").css("display") === "none" && nuevaCantidad > 0) {
    // Mostrar el div con una animación
    $("#carrito").fadeIn("slow");
    $("#divbtnpagar").fadeIn("slow");
  }
  actualizarTablaCarrito();
  // Mostrar notificación
  mostrarNotificacion("Producto cargado al carrito", "", "success", "check");
}
function calcularSubtotales() {
  $("#totales").show();
  // Obtener el carrito del LocalStorage
  var carrito = ordenArray;
  // Inicializar variables
  var cantidad = 0;
  var subtotalPrecioItems = 0;
  var subtotalDescuentoItems = 0;

  // Calcular los valores
  carrito.forEach(function (producto) {
    if (producto.simbolo == "U") {
      cantidad += producto.cantidad;
    } else {
      cantidad++;
    }
    // Calcular el subtotal teniendo en cuenta la cantidad
    subtotalPrecioItems += producto.precio * producto.cantidad;
    // Sumar los descuentos de cada producto
    subtotalDescuentoItems += producto.descuento * producto.cantidad;
  });
  // Calcular el total con descuento
  var totalPrecioConDescuentoItems =
    subtotalPrecioItems - subtotalDescuentoItems;
  var subtotal = {
    cantidad: cantidad,
    subtotalPrecioItems: subtotalPrecioItems,
    subtotalDescuentoItems: Math.abs(subtotalDescuentoItems),
    totalPrecioConDescuentoItems: totalPrecioConDescuentoItems,
  };
  localStorage.setItem("subtotales", JSON.stringify(subtotal));
  calcularTotales();
}
// Función para formatear el número y eliminar decimales "00"
function formatNumber(value) {
  var formattedValue = parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (formattedValue.endsWith('00')) {
      return formattedValue.substring(0, formattedValue.length - 3);
  }
  return formattedValue;
}
function calcularTotales() {
  var subtotal = JSON.parse(localStorage.getItem("subtotales")) || [];
  var delivery = parseFloat(localStorage.getItem("delivery")) || 0;
  var descFac = parseFloat(localStorage.getItem("descFac")) || 0;
  var descFacPorcentaje = localStorage.getItem("descFacPorcentaje");
  var totalaPagar = parseFloat(
    subtotal.totalPrecioConDescuentoItems - descFac + delivery
  );

if (subtotal.subtotalPrecioItems != 0) {
  $(".subtotalPrecioItems").show();
  $(".subtotalPrecioItems span").text("$" + formatNumber(subtotal.subtotalPrecioItems));
} else {
  $(".subtotalPrecioItems").hide();
}

if (subtotal.subtotalDescuentoItems != 0) {
  $(".subtotalDescuentoItems").show();
  $(".subtotalDescuentoItems span").text("-$" + formatNumber(subtotal.subtotalDescuentoItems));
} else {
  $(".subtotalDescuentoItems").hide();
}

if (descFac != 0) {
  $(".descuentoAlTotal").show();
  $(".descuentoAlTotal span").text("$" + formatNumber(descFac));
} else {
  $(".descuentoAlTotal").hide();
}

if (delivery != 0) {
  $(".cabeceraDelivery").show();
  $(".cabeceraDelivery span").text("$" + formatNumber(delivery));
} else {
  $(".cabeceraDelivery").hide();
}


// Formatear el total a pagar con comas para decimales y puntos como separador de miles
var totalFormateado = parseFloat(totalaPagar).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Eliminar decimales si son "00"
if (totalFormateado.endsWith('00')) {
    totalFormateado = totalFormateado.substring(0, totalFormateado.length - 3);
}

$("#totalapagar").text("$" + totalFormateado);
  $(".btnPagar i").text("(" + subtotal.cantidad + ") Items");

}
function actualizarTablaCarrito() {
  console.time("actualizarTablaCarrito");
  // Obtener el contenedor de la tabla del carrito
  var carritoTabla = $("#cart tbody");
  // Limpiar la tabla actual
  carritoTabla.empty();

  // Obtener los productos del carrito desde el ordenArray
  var carritoProductos = ordenArray;

  // Verificar si hay productos en el carrito
  if (carritoProductos && carritoProductos.length > 0) {
    // Construir todas las filas de una vez
    var rows = carritoProductos.map(function (productoCarrito) {
      var row = "<tr class='row'>";
      row += `<td class="Product-cart-title col-md-4">
    <div class="media align-items-center">
        <img class="mr-3 wh-50 align-self-center radius-xl bg-opacity-primary" src="http://local/valeria/${productoCarrito.ultima_foto}" alt="${productoCarrito.producto}">
        <div class="media-body">
            <h5 class="mt-0">${productoCarrito.producto}</h5>
            <div class="d-flex">`;
      // Verificar si el descuento es mayor a 0
      if (productoCarrito.descuento > 0) {
        row += `<p><small>Desc: <a href='#' onclick="abrirModalDescuento(${productoCarrito.id}, ${productoCarrito.descuento}, ${productoCarrito.porcentaje})">${productoCarrito.descuento} (${productoCarrito.porcentaje}%)</a></small></p>`;
      }

      row += `
            </div>
        </div>
    </div>
</td>`;

if (productoCarrito.simbolo == "U") {
  row += `<td class="col-md-2 text-center">
<div class="quantity product-cart__quantity">
    <input type="button" value="-" class="qty-minus bttn bttn-left wh-36" onclick="descontarCarrito(${productoCarrito.id})">
    <input type="number" value="${productoCarrito.cantidad}" class="qty qh-36 input" id="qty-${productoCarrito.id}" onkeypress="if(event.key==='Enter') actualizarCantidadCarrito(${productoCarrito.id})">
    <input type="button" value="+" class="qty-plus bttn bttn-right wh-36" onclick="cargarCarrito(${productoCarrito.id}, 1)">
</div>
</td>`;
} else {
  row += `<td class="col-md-2 text-center">
<div class="quantity product-cart__quantity">
    <input type="button" value="-" class="qty-minus bttn bttn-left wh-36" onclick="descontarCarrito(${productoCarrito.id})" disabled="true" readonly>
    <input type="number" value="${productoCarrito.cantidad}" class="qty qh-36 input" id="qty-${productoCarrito.id}" onkeypress="if(event.key==='Enter') actualizarCantidadCarrito(${productoCarrito.id})">
    <input type="button" value="+" class="qty-plus bttn bttn-right wh-36" onclick="cargarCarrito(${productoCarrito.id}, 1)" disabled="true" readonly>
</div>
</td>`;
}



      // Formatear el total con comas para decimales y puntos como separador de miles
var totalFormateado = parseFloat(productoCarrito.total).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Eliminar decimales si son "00"
if (totalFormateado.endsWith('00')) {
    totalFormateado = totalFormateado.substring(0, totalFormateado.length - 3);
}

row += `<td class="col-md-3" style="text-align: center;">
          ${totalFormateado}
        </td>`;

      row += `<td class='d-flex col-md-3'>
      <button class="btn btn-icon btn-circle btn-outline-primary" style='margin-right:1em; height:33px; width:40px; padding: 0 0.545rem;' onclick="abrirModalDetalles(${productoCarrito.id}, ${productoCarrito.descuento}, ${productoCarrito.porcentaje})">
<span data-feather="message-circle"></span>
</button>
                <button class="btn btn-icon btn-circle btn-outline-primary" style='margin-right:1em; height:33px; width:40px; padding: 0 0.545rem;' onclick="abrirModalDescuento(${productoCarrito.id}, ${productoCarrito.descuento}, ${productoCarrito.porcentaje})">
<span data-feather="percent"></span>
</button>
<button class="btn btn-icon btn-circle btn-outline-danger" style='height:33px; width:40px;  padding: 0 0.545rem;' onclick="eliminarProductoCarrito('${productoCarrito.uuid}')">
<span data-feather="trash"></span>
</button>
                </td>`;
      row += "</tr>";
      return row;
    });
    // Agregar todas las filas al DOM de una vez
    carritoTabla.html(rows.join(""));
  }
  if (ordenArray != "") {
    calcularSubtotales(); //Calcular subtotales
    feather.replace(); // Esto inicializará Feather Icons después de cargar la biblioteca.
  }
  console.timeEnd("actualizarTablaCarrito");
}
// Función para actualizar la cantidad del carrito
function actualizarCantidadCarrito(productId) {
  var nuevoValor = document.getElementById(`qty-${productId}`).value;
  var nuevaCantidad = parseInt(nuevoValor, 10);
  if (!isNaN(nuevaCantidad) && nuevaCantidad >= 0) {
    cargarCarrito(productId, nuevaCantidad, true);
  }
}
function descontarCarrito(productId, cantidadDescontar = 1) {
  // Obtener el producto correspondiente desde localstorage.productos
  var productos = JSON.parse(localStorage.getItem("productos"));
  var productoSeleccionado = productos.find(
    (producto) => producto.id === productId
  );
  var productIndex = ordenArray.findIndex((item) => item.id === productId);
  if (productIndex !== -1) {
    // Si el producto ya está en el array, decrementar la cantidad
    ordenArray[productIndex].cantidad -= cantidadDescontar;
    // Verificar si la cantidad es menor o igual a 0 y eliminar el producto del carrito
    if (ordenArray[productIndex].cantidad <= 0) {
      ordenArray.splice(productIndex, 1);
    } else {
      // Actualizar el total en función de la nueva cantidad
      actualizarTotal(productIndex);
    }
  }
  //  else {
  //   // Si el producto no está en el array, agregarlo con cantidad 1
  //   var cantidad = 1;
  //   var descuento = 0;
  //   ordenArray.push({
  //     id: productId,
  //     cantidad: cantidad,
  //     descuento: descuento,
  //     total: calcularTotal(productoSeleccionado.precio, cantidad, descuento),
  //     ...productoSeleccionado, // Agregar la información detallada del producto
  //   });
  // }
  // Guardar en local storage
  localStorage.setItem("carrito", JSON.stringify(ordenArray));
  // Actualizar la interfaz de la tabla del carrito
  actualizarTablaCarrito();
  // Mostrar notificación
  mostrarNotificacion(
    "Producto descontado del carrito",
    "",
    "success",
    "check"
  );
}
// Función para calcular el total
function calcularTotal(precio, cantidad, descuento) {
  return ((precio - descuento) * cantidad).toFixed(2);
}
// Función para actualizar el total en función de la cantidad
function actualizarTotal(index) {
  console.log("recibido en actualizarTotal " + index);
  var producto = ordenArray[index]; // Acceder al producto en el índice proporcionado
  if (producto) {
    producto["total"] = calcularTotal(
      producto["precio"],
      producto["cantidad"],
      producto["descuento"]
    );
    // Actualizar el total en el array y en el almacenamiento local
    ordenArray[index] = producto;
    localStorage.setItem("carrito", JSON.stringify(ordenArray));
  } else {
    console.error(
      "El producto en el índice proporcionado no se encuentra en el carrito."
    );
  }
}
function eliminarProductoCarrito(productUuid) {
  var productIndex = ordenArray.findIndex((item) => item.uuid === productUuid);
  if (productIndex !== -1) {
    // Eliminar completamente el producto del carrito
    eliminarProducto(productIndex);
    // Mostrar notificación
    mostrarNotificacion(
      "Producto eliminado del carrito",
      "",
      "success",
      "trash"
    );
  }
}
function eliminarProducto(index) {
  // Eliminar el producto del carrito en la posición dada
  ordenArray.splice(index, 1);
  // Guardar en local storage
  localStorage.setItem("carrito", JSON.stringify(ordenArray));
  // Actualizar la interfaz de la tabla del carrito
  actualizarTablaCarrito();
}
function obtenerProductoActual(productoId) {
  // Obtener los productos del carrito desde el local storage
  var carritoProductos = JSON.parse(localStorage.getItem("carrito"));
  // Buscar el producto actual por su ID
  var productoActual = carritoProductos.find(
    (producto) => producto.id === productoId
  );
  return productoActual;
}
function obtenerInformacionProducto(productId, carritoProductos) {
  // Buscar el producto con el productId en el carrito
  var producto = carritoProductos.find(function (item) {
    return item.id === productId;
  });
  if (producto) {
    return producto;
  } else {
    console.error("Producto no encontrado en el carrito");
    // Aquí puedes manejar la situación cuando el producto no se encuentra en el carrito
    // Puedes mostrar un mensaje de error, por ejemplo.
  }
}
// Función para mostrar notificaciones con el nuevo template
function mostrarNotificacion(titulo, mensaje, tipo, icon) {
  const notificationShocase = $(".notification-wrapper");
  let toast = `
        <div class="atbd-notification-box notification-${tipo} notification-${toastCount}">
            <div class="atbd-notification-box__content media">
                <div class="atbd-notification-box__icon">
                    <span data-feather="${icon}"></span>
                </div>
                <div class="atbd-notification-box__text media-body">
                    <h6>${titulo}</h6>
                    <p>
                    ${mensaje}
                    </p>
                </div>
            </div>
        </div>
    `;
  notificationShocase.append(toast);
  feather.replace();
  setTimeout(function () {
    $(document)
      .find(".notification-wrapper .atbd-notification-box")
      .last()
      .fadeOut(100, function () {
        $(this).remove();
      });
  }, 3000); // 3 segundos de duración
}
// Función para manejar el clic del botón
function cargarPedido() {
  // Obtener datos del local storage
  var cabecera = JSON.parse(localStorage.getItem("cabecera"));
  var carrito = JSON.parse(localStorage.getItem("carrito"));
  // Crear el nuevo pedido
  var nuevoPedido = {
    UUID: generateUUID(),
    cliente: "Nombre del Cliente", // Puedes cambiar esto con el nombre real del cliente
    mesa: "Número de Mesa", // Puedes cambiar esto con el número real de la mesa
    carrito: carrito,
    cabecera: cabecera,
    estado: "activo",
  };
  // Obtener la lista de pedidos existentes o inicializarla como un array vacío si es la primera vez
  var pedidosExistente = JSON.parse(localStorage.getItem("pedidos"));
  // Si no hay pedidos existentes, inicializar como un array vacío
  if (!Array.isArray(pedidosExistente)) {
    pedidosExistente = [];
  }
  // Agregar el nuevo pedido a la lista
  pedidosExistente.push(nuevoPedido);
  // Guardar la lista actualizada de pedidos en local storage
  localStorage.setItem("pedidos", JSON.stringify(pedidosExistente));
  // Limpiar cabecera y carrito
  localStorage.removeItem("cabecera");
  localStorage.removeItem("carrito");
  ordenArray = [];
  // Actualizar la tabla del carrito
  actualizarTablaCarrito();
  //crearCabecera();
  // Mostrar mensaje de éxito
  alert("Pedido creado con éxito");
}
