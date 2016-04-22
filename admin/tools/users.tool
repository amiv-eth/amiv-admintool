<div class="users-table-wrapper">
	<table class="table table-hover users-table">
		<thead>
			<tr>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
</div>

<style>
	.users-table-wrapper {
		width: 100%;
		height: 100%;
		overflow: auto;
	}
</style>
<script type="text/javascript">
	tools.ui.menu({
		'Add User': {
			callback: function() {
				console.log('noice');
			}
		}
	});

	function showDetails() {
		console.log($(this).attr('data-id'));
	}

	var showInTable = ['firstname', 'lastname', 'email', 'membership'],
		curData = null;
	amivcore.users.GET({
		data: {
			'max_results': '50'
		}
	}, function(ret) {

		if (!ret || ret['_items'].length == 0) {
			tools.log('No Data', 'w');
			return;
		}

		curData = ret['_items'];

		showInTable.forEach(function(i) {
			$('.users-table thead tr').append('<th>' + i + '</th>');
		});

		for (var n in ret['_items']) {
			var tmp = '';
			showInTable.forEach(function(i) {
				tmp += '<td>' + ret['_items'][n][i] + '</td>';
			});
			$('.users-table tbody').append('<tr data-id="' + ret['_items'][n]['id'] + '">' + tmp + '</tr>');
		}
		$('.users-table tbody tr').click(showDetails);
	});
</script>
