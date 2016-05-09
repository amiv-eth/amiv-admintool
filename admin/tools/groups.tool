<div class="groups-table-wrapper">
	<table class="table table-hover groups-table">
		<thead>
			<tr>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
</div>

<style>
	.groups-table-wrapper {
		width: 100%;
		height: 100%;
		overflow: auto;
	}
</style>
<script type="text/javascript">
	var groups = {
		tableTitles: ['Name', 'Zoidberg', 'self enrollment', '# Of Subscribers'],
		showInTable: ['name', 'has_zoidberg_share', 'allow_self_enrollment'],
		curgroupData: null,

		// Page
		page: {
			max: Number.MAX_VALUE,
			cur: function() {
				return parseInt(tools.mem.session.get('curPage'));
			},
			set: function(num) {
				num = parseInt(num);
				if (num > 0 && num < groups.page.max + 1)
					tools.mem.session.set('curPage', num);
				$('.groups-cur-page-cont').html(groups.page.cur());
				groups.get();
			},
			inc: function() {
				groups.page.set(groups.page.cur() + 1);
			},
			dec: function() {
				groups.page.set(groups.page.cur() - 1);
			}
		},

		//Sorting
		sort: {
			cur: function() {
				return tools.mem.session.get('curSort');
			},
			set: function(sort) {
				tools.mem.session.set('curSort', sort);
				groups.get();
			},
			inv: function() {
				var tmp = groups.sort.cur();
				if (tmp.charAt(0) == '-')
					groups.sort.set(tmp.slice(1));
				else
					groups.sort.set('-' + tmp);
			}
		},

		//Searching
		search: {
			cur: function() {
				return tools.mem.session.get('search');
			},
			set: function(dom, val) {
				tools.mem.session.set('search', dom + '==' + val);
				groups.page.set(1);
			},
			clr: function() {
				tools.mem.session.set('search', '');
				groups.page.set(1);
			},
		},

		// Get groups
		get: function() {
			$('#wheel-logo').css('transform', 'rotate(360deg)');
			amivcore.groups.GET({
				data: {
					'max_results': '50',
					page: groups.page.cur(),
					sort: groups.sort.cur(),
					where: groups.search.cur(),
				}
			}, function(ret) {
				console.log(ret);

				if (ret === undefined || ret['_items'].length == 0) {
					tools.log('No Data', 'w');
					$('#wheel-logo').css('transform', 'rotate(0deg)');
					return;
				}
				groups.meta = ret['_meta'];
				groups.page.max = Math.ceil(groups.meta.total / groups.meta.max_results);
				$('.groups-page-max-cont').html(groups.page.max);

				// Clear table from previous contentent
				$('.groups-table thead tr, .groups-table tbody').html('');

				groups.tableTitles.forEach(function(i) {
					$('.groups-table thead tr').append('<th>' + i + '</th>');
				});

				for (var n in ret['_items']) {
					var tmp = '';
					groups.showInTable.forEach(function(i) {
						tmp += '<td>' + ret['_items'][n][i] + '</td>';
					});
					tmp += '<td>' + ret['_items'][n]['user_subscribers'].length + '</td>';
					$('.groups-table tbody').append('<tr data-id="' + ret['_items'][n]['id'] + '">' + tmp + '</tr>');
				}
				$('#wheel-logo').css('transform', 'rotate(0deg)');
				$('.groups-table tbody tr').click(groups.showDetails);
			});
		},

		// Make Modal with editable table data
		showDetails: function() {
			amivcore.groups.GET({
				id: $(this).attr('data-id')
			}, function(ret) {
				curgroupData = ret;
				var tmp = '<table class="table table-hover groups-group-edit-table" data-etag="' + ret['_etag'] + '"><tbody>';
				for (var cur in ret)
					if (cur.charAt(0) != '_')
						tmp += '<tr><td>' + cur + '</td><td contenteditable>' + ret[cur] + '</td></tr>'
				tmp += '</tbody></table>';

				tools.modal({
					head: ret.firstname + ' ' + ret.lastname,
					body: tmp,
					button: {
						'Update': {
							type: 'success',
							close: true,
							callback: groups.inspectgroup,
						}
					}
				});

			});;
		},

		// Check wether changes were maid and saves it in that case
		inspectgroup: function() {
			var newgroupData = {};
			$('.groups-group-edit-table tr').each(function() {
				newgroupData[$(this).children('td:nth-child(1)').html()] = $(this).children('td:nth-child(2)').html();
			});
			var changed = false,
				curgroupDataChanged = {};
			for (var i in newgroupData) {
				if (newgroupData[i] != String(curgroupData[i])) {
					changed = true;
					curgroupDataChanged[i] = newgroupData[i];
				}
			}
			if (changed) {
				amivcore.groups.PATCH({
					id: curgroupData.id,
					header: {
						'If-Match': $('.groups-group-edit-table').attr('data-etag')
					},
					data: curgroupDataChanged
				}, function() {
					tools.log('group Updated', 's');
					groups.get();
				});
			}
		},

		//Make new group
		add: function() {
			var tmp = '<table class="table table-hover table-bordered groups-group-add-table"><tbody>',
				reqFields = amivcore.getRequiredFields('groups', 'POST');
			for (var reqField in reqFields)
				tmp += '<tr><td>' + reqField + '</td><td contenteditable></td></tr>'
			tmp += '</tbody></table>';
			tools.modal({
				head: 'New group',
				body: tmp,
				button: {
					'Add': {
						type: 'success',
						close: true,
						callback: function() {
							var newgroupData = {};
							$('.groups-group-add-table tr').each(function() {
								newgroupData[$(this).children('td:nth-child(1)').html()] = $(this).children('td:nth-child(2)').html();
							});
							amivcore.groups.POST({
								data: newgroupData
							}, function(ret) {
								if (!ret.hasOwnProperty('_status') || ret['_status'] != 'OK')
									tools.log(JSON.stringify(ret.responseJSON['_issues']), 'e');
								else {
									tools.log('group Added', 's');
									groups.get();
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
		'<span class="glyphicon glyphicon-group" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Create group"></span>': {
			callback: groups.add
		},
		'<span class="glyphicon glyphicon-arrow-left" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Previous Page"></span>': {
			callback: groups.page.dec
		},
		'<span data-toggle="tooltip" data-placement="bottom" title="Set Page"><span class="groups-cur-page-cont" aria-hidden="true"></span> / <span class="groups-page-max-cont" aria-hidden="true"></span></span>': {
			callback: function() {
				tools.modal({
					head: 'Go To Page:',
					body: '<div class="form-group"><input type="number" value="' + groups.page.cur() + '" class="form-control groups-go-page"></div>',
					button: {
						'Go': {
							type: 'success',
							close: true,
							callback: function() {
								groups.page.set($('.groups-go-page').val());
							},
						}
					}
				});
			}
		},
		'<span class="glyphicon glyphicon-arrow-right" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Next Page"></span>': {
			callback: groups.page.inc
		},
		'<span class="glyphicon glyphicon-sort" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Sort"></span>': {
			callback: function() {
				var tmp = '<div class="form-group"><select class="form-control groups-sort-select">';
				var cur = groups.sort.cur();
				['id', 'name', 'has_zoidberg_share', 'allow_self_enrollment'].forEach(function(i) {
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
								groups.sort.set($('.groups-sort-select').val());
							}
						}
					}

				});
			}
		},
		'<span class="glyphicon glyphicon-search" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Search"></span>': {
			callback: function() {
				var tmp = '<div class="form-group"><select class="form-control groups-search-select">';
				var cur = groups.search.cur();
				if (cur === null || cur == '')
					cur = '';
				else
					cur = cur.split('==')[1];
				['id', 'name', 'has_zoidberg_share', 'allow_self_enrollment'].forEach(function(i) {
					tmp += '<option value="' + i + '"' + ((i == cur) ? ' selected' : '') + '>' + i + '</option>';
				});
				tmp += '</select><br><input type="text" value="' + cur + '" class="form-control groups-search-val"></div>';
				tools.modal({
					head: 'Search',
					body: tmp,
					button: {
						'Clear': {
							type: 'warning',
							close: true,
							callback: groups.search.clr,
						},
						'Search': {
							type: 'success',
							close: true,
							callback: function() {
								groups.search.set($('.groups-search-select').val(), $('.groups-search-val').val());
							}
						},
					}
				})
			}
		}
	});

	//Set Toolpit
	$('[data-toggle="tooltip"]').tooltip()

	// Set Initail Page and get first groups
	if (groups.page.cur() === null || isNaN(groups.page.cur()))
		groups.page.set(1);
	else
		groups.page.set(groups.page.cur());
</script>
