// Array para almacenar los productos seleccionados
var ordenArray = [];

// Función para cargar el JSON
function cargarCarrito(productId) {
    var productIndex = ordenArray.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        // Si el producto ya está en el array, incrementar la cantidad
        ordenArray[productIndex].cantidad += 1;
    } else {
        // Si el producto no está en el array, agregarlo con cantidad 1
        ordenArray.push({
            id: productId,
            cantidad: 1,
            // Otros datos que quieras agregar
        });
    }

    // Guardar en local storage
    localStorage.setItem("carrito", JSON.stringify(ordenArray));

    // Actualizar algún elemento en la interfaz si es necesario
    // ...
}

$(document).ready(function () {
    // Obtener datos JSON desde la URL
    $.ajax({
        url: "http://local/s1/public/api/stock/caja/getProductos",
        method: "GET",
        dataType: "json",
        cache: false,
        success: function (jsonData) {
            // Populate the table dynamically
            var tbody = $("#productos tbody");
            localStorage.setItem('productos',JSON.stringify(jsonData.data))
            jsonData.data.forEach(function (data) {
                var row = "<tr>";
                row +=
                    '<td class="Product-cart-title"><div class="media  align-items-center"><img class="mr-3 wh-50 align-self-center radius-xl bg-opacity-primary"src="http://local/valeria/'+data.ultima_foto+'" alt="'+data.descripcion+'"><div class="media-body"><h5 class="mt-0">'+data.producto+'</h5><div class="d-flex"><p>IVA:<span>'+data.iva+'</span></p><p>Disp:<span>'+data.total_stock+'</span></p></div></div></div></td>';
                row +=
                    '<td><div class="userDatatable-content">' +
                    data.precio +
                    "</div></td>";
                row +=
                    '<td><div class="userDatatable-content">' +
                    data.precio_mayorista +
                    "</div></td>";
               
                row += '<td><div class="userDatatable-content">' + data.categoria + "</div></td>";
                row += '<td><div class="quantity product-cart__quantity"><input type="button" value="+1" onclick="cargarCarrito('+data.id+')" class="qty-plus bttn bttn-right wh-36" style="font-size:1em;"></div></td>';
                row += "</tr>";
                tbody.append(row);
            });

            // Initialize Footable with filtering on the 'categoria' column
            $("#productos").footable({
                "paging": {
                    "enabled": true
                },
                "sorting": {
                    "enabled": true
                },
                "filtering": {
                    "enabled": true
                },
                "columns": [
                    { "name": "actions", "filterable": false },
                    { "name": "producto", "filterable": true },
                    { "name": "categoria" } // Agregamos la columna 'categoria' al filtro de Footable
                ]
            });
        },
        error: function (error) {
            console.error("Error fetching data:", error);
        },
    });
});
