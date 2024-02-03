$(document).ready(function () {
    // Obtener datos JSON desde la URL
    $.ajax({
        url: 'http://local/s1/public/api/stock/caja/getProductos',
        method: 'GET',
        dataType: 'json',
        success: function (jsonData) {
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

            // Initialize FooTable
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
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
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