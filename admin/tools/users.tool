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
	var users = {
		showInTable: ['firstname', 'lastname', 'email', 'membership'],
		curUserData: null,
	};

	tools.ui.menu({
		'<span class="glyphicon glyphicon-user" aria-hidden="true"></span>': {
			callback: function() {}
		},
		'<span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>': {
			callback: function() {}
		},
		'<span class="users-cur-page" aria-hidden="true">0</span>': {
			callback: function() {}
		},
		'<span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>': {
			callback: function() {}
		},
		'<span class="glyphicon glyphicon-search" aria-hidden="true"></span>': {
			callback: function() {}
		}
	});

	function inspectUser() {
		var newUserData = {};
		$('.users-user-edit-table tr').each(function() {
			newUserData[$(this).children('td:nth-child(1)').html()] = $(this).children('td:nth-child(2)').html();
		});
		var changed = false,
			curUserDataChanged = {};
		for (var i in newUserData) {
			if (newUserData[i] != String(curUserData[i])) {
				changed = true;
				curUserDataChanged[i] = newUserData[i];
			}
		}
		if (changed) {
			amivcore.users.PATCH({
				id: curUserData.id,
				header: {
					'If-Match': $('.users-user-edit-table').attr('data-etag')
				},
				data: curUserDataChanged
			}, function(){
				tools.log('User Updated', 's');
				tools.getTool('users');
			});
		}
	}

	function showDetails() {
		amivcore.users.GET({
			id: $(this).attr('data-id')
		}, function(ret) {
			curUserData = ret;
			var tmp = '<table class="table table-hover users-user-edit-table" data-etag="' + ret['_etag'] + '"><tbody>';
			for (var cur in ret)
				if (cur.charAt(0) != '_')
					tmp += '<tr><td>' + cur + '</td><td contenteditable>' + ret[cur] + '</td></tr>'
			tmp += '</tbody></table>';

			tools.modal({
				head: ret.firstname + ' ' + ret.lastname,
				body: tmp,
				button: 'OK',
				success: inspectUser,
				cancel: function() {
					console.log('Canceled');
				}
			});

		});;
	}

	amivcore.users.GET({
		data: {
			//'max_results': '50'
		}
	}, function(ret) {

		if (ret === undefined || ret['_items'].length == 0) {
			tools.log('No Data', 'w');
			return;
		}

		users.showInTable.forEach(function(i) {
			$('.users-table thead tr').append('<th>' + i + '</th>');
		});

		for (var n in ret['_items']) {
			var tmp = '';
			users.showInTable.forEach(function(i) {
				tmp += '<td>' + ret['_items'][n][i] + '</td>';
			});
			$('.users-table tbody').append('<tr data-id="' + ret['_items'][n]['id'] + '">' + tmp + '</tr>');
		}
		$('.users-table tbody tr').click(showDetails);
	});
</script>
