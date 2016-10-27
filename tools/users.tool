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
<script type="text/javascript">
	var users = {
		showInTable: ['firstname', 'lastname', 'nethz', 'legi', 'membership'],
		curUserData: null,

		// Page
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

		//Sorting
		sort: {
			cur: function() {
				return tools.mem.session.get('curSort');
			},
			set: function(sort) {
				tools.mem.session.set('curSort', sort);
				users.get();
			},
			inv: function() {
				var tmp = users.sort.cur();
				if (tmp.charAt(0) == '-')
					users.sort.set(tmp.slice(1));
				else
					users.sort.set('-' + tmp);
			}
		},

		//Searching
		search: {
			cur: function() {
				return tools.mem.session.get('search');
			},
			set: function(dom, val) {
				tools.mem.session.set('search', dom + '==' + val);
				users.page.set(1);
			},
			clr: function() {
				tools.mem.session.set('search', '');
				users.page.set(1);
			},
		},

		// Get users
		get: function() {
			amivcore.users.GET({
				data: {
					'max_results': '50',
					page: users.page.cur(),
					sort: users.sort.cur(),
					where: users.search.cur(),
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
				$('.users-table thead tr, .users-table tbody').html('');

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
				var tmp = '<table class="table table-hover users-user-edit-table" data-etag="' + ret['_etag'] + '" data-id="' + ret.id + '"><tbody>';
				for (var cur in ret)
					if (cur.charAt(0) != '_')
						tmp += '<tr><td>' + cur + '</td><td contenteditable>' + ret[cur] + '</td></tr>'
				tmp += '</tbody></table>';

				tools.modal({
					head: ret.firstname + ' ' + ret.lastname,
					body: tmp,
					button: {
						'Delete': {
							type: 'danger',
							callback: function() {
								if (confirm('Fo\' shizzle my nizzle? U fo\' real?'))
									amivcore.users.DELETE({
										id: $('.users-user-edit-table').first().attr('data-id'),
										header: {
											'If-Match': $('.users-user-edit-table').attr('data-etag')
										},
									}, function(ret) {
										if (ret === undefined) {
											tools.log('User successfully deleted', 's');
											users.get();
											tools.modalClose();
										} else {
											tools.log('Error', 'e');
										}
									});
							}
						},
						'Update': {
							type: 'success',
							close: true,
							callback: users.inspectUser,
						}
					}
				});

			});
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
			var tmp = '<div class="row users-user-add-form"><div class="form-group col-xs-6"><label for="users-fn">Firstname:</label><input type="text" class="form-control" name="firstname" id="users-fn"></div>' +
				'<div class="form-group col-xs-6"><label for="users-ln">Lastname:</label><input type="text" class="form-control" id="users-ln" name="lastname"></div>' +
				'<div class="form-group"><label for="users-email">E-Mail:</label><input type="email" class="form-control" id="users-email" name="email"></div>' +
				'<div class="form-group col-xs-6"><label for="users-membership">Membership:</label><select class="form-control" id="users-membership" name="membership"><option>regular</option><option>honorary</option><option>extraordinary</option></select></div>' +
				'<div class="form-group col-xs-6"><label for="users-gender">Gender:</label><select class="form-control" id="users-gender" name="gender"><option>male</option><option>female</option></select></div>' +
				'</div>';
			tools.modal({
				head: 'Spawn new AMIV slave',
				body: tmp,
				button: {
					'Add': {
						type: 'success',
						callback: function() {
							var newUserData = {};
							$('.users-user-add-form input, .users-user-add-form select').each(function() {
								newUserData[$(this).attr('name')] = $(this).val();
							});
							amivcore.users.POST({
								data: newUserData
							}, function(ret) {
								if (!ret.hasOwnProperty('_status') || ret['_status'] != 'OK')
									tools.log(JSON.stringify(ret.responseJSON['_issues']), 'e');
								else {
									tools.modalClose();
									tools.log('User Added', 's');
									users.get();
								}
							});
						}
					}
				}
			});
		}
	};

	// Setup Menu
	tools.ui.menu({
		'<span class="glyphicon glyphicon-plus" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Create User"></span>': {
			callback: users.add
		},
		'<span class="glyphicon glyphicon-arrow-left" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Previous Page"></span>': {
			callback: users.page.dec
		},
		'<span data-toggle="tooltip" data-placement="bottom" title="Set Page"><span class="users-cur-page-cont" aria-hidden="true"></span> / <span class="users-page-max-cont" aria-hidden="true"></span></span>': {
			callback: function() {
				tools.modal({
					head: 'Go To Page:',
					body: '<div class="form-group"><input type="number" value="' + users.page.cur() + '" class="form-control users-go-page"></div>',
					button: {
						'Go': {
							type: 'success',
							close: true,
							callback: function() {
								users.page.set($('.users-go-page').val());
							},
						}
					}
				});
			}
		},
		'<span class="glyphicon glyphicon-arrow-right" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Next Page"></span>': {
			callback: users.page.inc
		},
		'<span class="glyphicon glyphicon-sort" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Sort"></span>': {
			callback: function() {
				var tmp = '<div class="form-group"><select class="form-control users-sort-select">';
				var cur = users.sort.cur();
				['id', 'firstname', 'lastname', 'membership', 'nethz'].forEach(function(i) {
					tmp += '<option value="' + i + '"' + ((i == cur) ? ' selected' : '') + '>&#8673; ' + i + '</option>';
					tmp += '<option value="-' + i + '"' + (('-' + i == cur) ? ' selected' : '') + '>&#8675; ' + i + '</option>';
				});
				tmp += '</select></div>';
				tools.modal({
					head: 'Sort',
					body: tmp,
					button: {
						'Sort': {
							type: 'success',
							close: true,
							callback: function() {
								users.sort.set($('.users-sort-select').val());
							}
						}
					}

				});
			}
		},
		'<span class="glyphicon glyphicon-search" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Search"></span>': {
			callback: function() {
				var tmp = '<div class="form-group"><select class="form-control users-search-select">';
				var cur = users.search.cur();
				if (cur === null || cur == '')
					cur = '';
				else
					cur = cur.split('==')[1];
				['id', 'firstname', 'lastname'].forEach(function(i) {
					tmp += '<option value="' + i + '"' + ((i == cur) ? ' selected' : '') + '>' + i + '</option>';
				});
				tmp += '</select><br><input type="text" value="' + cur + '" class="form-control users-search-val"></div>';
				tools.modal({
					head: 'Search',
					body: tmp,
					button: {
						'Clear': {
							type: 'warning',
							close: true,
							callback: users.search.clr,
						},
						'Search': {
							type: 'success',
							close: true,
							callback: function() {
								users.search.set($('.users-search-select').val(), $('.users-search-val').val());
							}
						},
					}
				})
			}
		}
	});

	//Set Toolpit
	$('[data-toggle="tooltip"]').tooltip()

	// Set Initail Page and get first users
	if (users.page.cur() === null || isNaN(users.page.cur()))
		users.page.set(1);
	else
		users.page.set(users.page.cur());
</script>
