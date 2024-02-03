$(document).ready(function () {
	// JSON data
	var jsonData = {
		"code": 200,
		"status": "success",
		"message": "Operacion exitosa",
		"data": [
		{
		"id_producto": null,
		"producto": "Maquina de cafe",
		"descripcion": "",
		"id_proveedor": 2,
		"codigo": "11",
		"precio": "11111.00",
		"precio_mayorista": "1111.00",
		"costo": "1111.00",
		"iva": 21,
		"peso": "0.000",
		"id_estado_producto": 1,
		"etiqueta": "maquina de cafe contiene componentes",
		"fecha_carga": "2023-10-11 01:11:27",
		"id_usuario_carga": 1,
		"cantidad_minima": 111,
		"medida": "",
		"id_empresa": null,
		"produccion": 0,
		"productos": "",
		"caducidad": 0,
		"link": "link",
		"unidad_medida": 1,
		"prod_requiere_mantenimiento": "0",
		"tipoagrupacion": "1",
		"stock": null,
		"foto": "images/productos/prod66526206fd4e18.png",
		"id_promo": null,
		"inicio_promo": null,
		"fin_promo": null,
		"minorista_promo": null,
		"mayorista_promo": null,
		"estado_promo": null,
		"id": 6
		},
		{
		"id_producto": null,
		"producto": "Cacao en polvo",
		"descripcion": "<div>​Cacao en Polvio listo para usarse.</div>",
		"id_proveedor": 2,
		"codigo": "33",
		"precio": "20000.00",
		"precio_mayorista": "19000.00",
		"costo": "15000.00",
		"iva": 21,
		"peso": "0.000",
		"id_estado_producto": 1,
		"etiqueta": "",
		"fecha_carga": "2023-10-31 17:43:11",
		"id_usuario_carga": 1,
		"cantidad_minima": 10,
		"medida": "",
		"id_empresa": null,
		"produccion": 0,
		"productos": "",
		"caducidad": 31,
		"link": "#",
		"unidad_medida": 3,
		"prod_requiere_mantenimiento": "0",
		"tipoagrupacion": "0",
		"stock": "6",
		"foto": "images/productos/prod7654166df4adde.jpg",
		"id_promo": null,
		"inicio_promo": null,
		"fin_promo": null,
		"minorista_promo": null,
		"mayorista_promo": null,
		"estado_promo": null,
		"id": 7
		}
		]
		}

	// Populate the table dynamically
	var tbody = $('#productos tbody');
	jsonData.data.forEach(function (data) {
		var row = '<tr>';
		row += '<td><div class="userDatatable-content">' + data.id + '</div></td>';
		row += '<td><div class="d-flex"><div class="userDatatable-inline-title"><a href="#" class="text-dark fw-500"><h6>' + data.producto + '</h6></a></div></div></td>';
		row += '<td><div class="userDatatable-content">' + data.precio + '</div></td>';
		row += '<td><div class="userDatatable-content">' + data.stock + '</div></td>';
		row += '<td><div class="userDatatable-content">' + data.iva + '</div></td>';
		row += '<td><div class="userDatatable-content">' + data.descripcion + '</div></td>';
		row += '<td><div class="userDatatable-content d-inline-block"><span class="bg-opacity-success  color-success rounded-pill userDatatable-content-status ' + (data.stock > 0 ? 'active' : 'inactive') + '">' + data.status + '</span></div></td>';
		row += '<td><ul class="orderDatatable_actions mb-0 d-flex flex-wrap">';
		row += '<li><a href="#" class="view"><span data-feather="eye"></span></a></li>';
		row += '<li><a href="#" class="edit"><span data-feather="edit"></span></a></li>';
		row += '<li><a href="#" class="remove"><span data-feather="trash-2"></span></a></li>';
		row += '</ul></td>';
		row += '</tr>';
		tbody.append(row);
	});

	// Initialize DataTable
	$('#productos').DataTable();
});

$(function() {
$('#productos').footable({
filtering: {
enabled: true
},
"paging": {
	  "enabled": true,
	  "current": 1
},
strings: {
enabled: false
},
"filtering": {
	  "enabled": true
  },
components: {
  filtering: FooTable.MyFiltering
},
}); 
});

FooTable.MyFiltering = FooTable.Filtering.extend({
construct: function(instance){
this._super(instance);
this.jobTitles = ['Active','deactivate','Blocked'];
this.jobTitleDefault = 'All';
this.$jobTitle = null;
},
$create: function(){
this._super();
var self = this;
var $job_title_form_grp = $('<div/>', {'class': 'form-group atbd-select d-flex align-items-center adv-table-searchs__status my-md-25 mt-15 mb-0 mr-sm-30 mr-0'})
	.append($('<label/>', {'class': 'd-flex align-items-center mb-sm-0 mb-2', text: 'Status'}))
	.prependTo(self.$form);

self.$jobTitle = $('<select/>', { 'class': 'form-control ml-sm-10 ml-0' })
	.on('change', {self: self}, self._onJobTitleDropdownChanged)
	.append($('<option/>', {text: self.jobTitleDefault}))
	.appendTo($job_title_form_grp);

$.each(self.jobTitles, function(i, jobTitle){
	self.$jobTitle.append($('<option/>').text(jobTitle));
});
},
_onStatusDropdownChanged: function(e){
var self = e.data.self,
	selected = $(this).val();
if (selected !== self.statusDefault){
	self.addFilter('position', selected, ['position']);
} else {
	self.removeFilter('position');
}
self.filter();
},
_onJobTitleDropdownChanged: function(e){
var self = e.data.self,
	selected = $(this).val();
if (selected !== self.jobTitleDefault){
	self.addFilter('status', selected, ['status']);
} else {
	self.removeFilter('status');
}
self.filter();
},
draw: function(){
this._super();
}
});
