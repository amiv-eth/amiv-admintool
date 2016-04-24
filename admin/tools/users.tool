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
		page: {
			max: Number.MAX_VALUE,
			cur: function() {
				return parseInt(tools.mem.session.get('curPage'));
			},
			set: function(num) {
				num = parseInt(num);
				if (num > 0 && num < users.page.max + 1)
					tools.mem.session.set('curPage', num);
				$('.users-cur-page-cont').html(users.page.cur());
				users.get();
			},
			inc: function() {
				users.page.set(users.page.cur() + 1);
			},
			dec: function() {
				users.page.set(users.page.cur() - 1);
			}
		},
		get: function() {
			amivcore.users.GET({
				data: {
					'max_results': '50',
					page: users.page.cur(),
				}
			}, function(ret) {

				if (ret === undefined || ret['_items'].length == 0) {
					tools.log('No Data', 'w');
					return;
				}

				users.meta = ret['_meta'];
				users.page.max = Math.ceil(users.meta.total / users.meta.max_results);
				$('.users-page-max-cont').html(users.page.max);

				// Clear table from previous contentent
				$('.users-table thead, .users-table tbody').html('');

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
				$('.users-table tbody tr').click(users.showDetails);
			});
		},

		// Make Modal with editable table data
		showDetails: function() {
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
					success: users.inspectUser
				});

			});;
		},

		// Check wether changes were maid and saves it in that case
		inspectUser: function() {
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
				}, function() {
					tools.log('User Updated', 's');
					users.get();
				});
			}
		},

		//Make new user
		add: function() {
			var tmp = '<table class="table table-hover users-user-add-table"><tbody>',
				reqFields = amivcore.getRequiredFields('users', 'POST');
			for (var reqField in reqFields)
				tmp += '<tr><td>' + reqField + '</td><td contenteditable></td></tr>'
			tmp += '</tbody></table>';
			tools.modal({
				head: 'New User',
				body: tmp,
				button: 'Add',
				success: function() {
					var newUserData = {};
					$('.users-user-add-table tr').each(function() {
						newUserData[$(this).children('td:nth-child(1)').html()] = $(this).children('td:nth-child(2)').html();
					});
					amivcore.users.POST({
						data: newUserData
					}, function(ret) {
						console.log(ret);
					});
				}
			})
		}
	};

	// Setup Menu
	tools.ui.menu({
		'<span class="glyphicon glyphicon-user" aria-hidden="true"></span>': {
			callback: users.add
		},
		'<span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>': {
			callback: users.page.dec
		},
		'<span class="users-cur-page-cont" aria-hidden="true"></span> / <span class="users-page-max-cont" aria-hidden="true"></span>': {
			callback: function() {
				tools.modal({
					head: 'Go To Page:',
					body: '<div class="form-group"><input type="number" value="' + users.page.cur() + '" class="form-control users-go-page"></div>',
					button: 'GO',
					success: function() {
						users.page.set($('.users-go-page').val());
					}
				})
			}
		},
		'<span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>': {
			callback: users.page.inc
		},
		'<span class="glyphicon glyphicon-search" aria-hidden="true"></span>': {
			callback: function() {}
		}
	});

	// Set Initail Page and get first users
	if (users.page.cur() === null || isNaN(users.page.cur()))
		users.page.set(1);
	else
		users.page.set(users.page.cur());
</script>
