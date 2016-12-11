<div class="studydocuments-table-wrapper">
	<table class="table table-hover studydocuments-table">
		<thead>
			<tr>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
</div>
<script type="text/javascript">
	var studydocuments = {
		showInTable: ['_id', '_updated', '_created', 'author'],
		curStudydocumentsData: null,

		// Page
		page: {
			max: Number.MAX_VALUE,
			cur: function() {
				return parseInt(tools.mem.session.get('curPage'));
			},
			set: function(num) {
				num = parseInt(num);
				if (num > 0 && num < studydocuments.page.max + 1)
					tools.mem.session.set('curPage', num);
				$('.studydocuments-cur-page-cont').html(studydocuments.page.cur());
				studydocuments.get();
			},
			inc: function() {
				studydocuments.page.set(studydocuments.page.cur() + 1);
			},
			dec: function() {
				studydocuments.page.set(studydocuments.page.cur() - 1);
			}
		},

		//Sorting
		sort: {
			cur: function() {
				return tools.mem.session.get('curSort');
			},
			set: function(sort) {
				tools.mem.session.set('curSort', sort);
				studydocuments.get();
			},
			inv: function() {
				var tmp = studydocuments.sort.cur();
				if (tmp.charAt(0) == '-')
					studydocuments.sort.set(tmp.slice(1));
				else
					studydocuments.sort.set('-' + tmp);
			}
		},

		//Searching
		search: {
			cur: function() {
				return tools.mem.session.get('search');
			},
			set: function(dom, val) {
				tools.mem.session.set('search', dom + '==' + val);
				studydocuments.page.set(1);
			},
			clr: function() {
				tools.mem.session.set('search', '');
				studydocuments.page.set(1);
			},
		},

		// Get studydocuments
		get: function() {
			amivcore.studydocuments.GET({
				data: {
					'max_results': '50',
					page: studydocuments.page.cur(),
					sort: studydocuments.sort.cur(),
					where: studydocuments.search.cur(),
				}
			}, function(ret) {

				if (ret === undefined || ret['_items'].length == 0) {
					tools.log('No Data', 'w');
					return;
				}

				studydocuments.meta = ret['_meta'];
				studydocuments.page.max = Math.ceil(studydocuments.meta.total / studydocuments.meta.max_results);
				$('.studydocuments-page-max-cont').html(studydocuments.page.max);

				// Clear table from previous contentent
				$('.studydocuments-table thead tr, .studydocuments-table tbody').html('');

				studydocuments.showInTable.forEach(function(i) {
					$('.studydocuments-table thead tr').append('<th>' + i + '</th>');
				});

				for (var n in ret['_items']) {
					var tmp = '';
					studydocuments.showInTable.forEach(function(i) {
						tmp += '<td>' + ret['_items'][n][i] + '</td>';
					});
					$('.studydocuments-table tbody').append('<tr data-id="' + ret['_items'][n]['_id'] + '">' + tmp + '</tr>');
				}
				$('.studydocuments-table tbody tr').click(studydocuments.showDetails);
			});
		},

		// Make Modal with editable table data
		showDetails: function() {
			amivcore.studydocuments.GET({
				id: $(this).attr('data-id')
			}, function(ret) {
				curStudydocumentsData = ret;
				var tmp = '<table class="table table-hover studydocuments-studydocuments-edit-table" data-etag="' + ret['_etag'] + '" data-id="' + ret._id + '"><tbody>';
				for (var cur in ret)
					if (cur.charAt(0) != '_'){
						if (cur == 'files'){
							tmp += '<tr><td>' + cur + '</td><td contenteditable>';
							for (var fileIdx in ret[cur]){
								var file = ret[cur][fileIdx];
								console.log(file)
								tmp += file.name;
							}
							tmp += '</td></tr>';
						}else{
							tmp += '<tr><td>' + cur + '</td><td contenteditable>' + ret[cur] + '</td></tr>';
						}
					}
				tmp += '</tbody></table>';

				tools.modal({
					head: ret.firstname + ' ' + ret.lastname,
					body: tmp,
					button: {
						'Delete': {
							type: 'danger',
							callback: function() {
								if (confirm('Fo\' shizzle my nizzle? U fo\' real?'))
									amivcore.studydocuments.DELETE({
										id: $('.studydocuments-studydocuments-edit-table').first().attr('data-id'),
										header: {
											'If-Match': $('.studydocuments-studydocuments-edit-table').attr('data-etag')
										},
									}, function(ret) {
										if (ret === undefined) {
											tools.log('Studydocuments successfully deleted', 's');
											studydocuments.get();
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
							callback: studydocuments.inspectStudydocuments,
						}
					}
				});

			});
		},

		// Check wether changes were maid and saves it in that case
		inspectStudydocuments: function() {
			var newStudydocumentsData = {};
			$('.studydocuments-studydocuments-edit-table tr').each(function() {
				newStudydocumentsData[$(this).children('td:nth-child(1)').html()] = $(this).children('td:nth-child(2)').html();
			});
			var changed = false,
				curStudydocumentsDataChanged = {};
			for (var i in newStudydocumentsData) {
				if (newStudydocumentsData[i] != String(curStudydocumentsData[i])) {
					changed = true;
					curStudydocumentsDataChanged[i] = newStudydocumentsData[i];
				}
			}
			if (changed) {
				amivcore.studydocuments.PATCH({
					id: curStudydocumentsData._id,
					header: {
						'If-Match': $('.studydocuments-studydocuments-edit-table').attr('data-etag')
					},
					data: curStudydocumentsDataChanged
				}, function() {
					tools.log('Studydocuments Updated', 's');
					studydocuments.get();
				});
			}
		},

		//Make new studydocuments
		add: function() {
			var tmp = '<div class="row studydocuments-studydocuments-add-form"><div class="form-group col-xs-6"><label for="studydocuments-fn">Firstname:</label><input type="text" class="form-control" name="firstname" id="studydocuments-fn"></div>' +
				'<div class="form-group col-xs-6"><label for="studydocuments-ln">Lastname:</label><input type="text" class="form-control" id="studydocuments-ln" name="lastname"></div>' +
				'<div class="form-group"><label for="studydocuments-email">E-Mail:</label><input type="email" class="form-control" id="studydocuments-email" name="email"></div>' +
				'<div class="form-group col-xs-6"><label for="studydocuments-membership">Membership:</label><select class="form-control" id="studydocuments-membership" name="membership"><option>regular</option><option>honorary</option><option>extraordinary</option></select></div>' +
				'<div class="form-group col-xs-6"><label for="studydocuments-gender">Gender:</label><select class="form-control" id="studydocuments-gender" name="gender"><option>male</option><option>female</option></select></div>' +
				'</div>';
			tools.modal({
				head: 'Spawn new AMIV slave',
				body: tmp,
				button: {
					'Add': {
						type: 'success',
						callback: function() {
							var newStudydocumentsData = {};
							$('.studydocuments-studydocuments-add-form input, .studydocuments-studydocuments-add-form select').each(function() {
								newStudydocumentsData[$(this).attr('name')] = $(this).val();
							});
							amivcore.studydocuments.POST({
								data: newStudydocumentsData
							}, function(ret) {
								if (!ret.hasOwnProperty('_status') || ret['_status'] != 'OK')
									tools.log(JSON.stringify(ret.responseJSON['_issues']), 'e');
								else {
									tools.modalClose();
									tools.log('Studydocuments Added', 's');
									studydocuments.get();
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
		'<span class="glyphicon glyphicon-plus" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Create Studydocuments"></span>': {
			callback: studydocuments.add
		},
		'<span class="glyphicon glyphicon-arrow-left" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Previous Page"></span>': {
			callback: studydocuments.page.dec
		},
		'<span data-toggle="tooltip" data-placement="bottom" title="Set Page"><span class="studydocuments-cur-page-cont" aria-hidden="true"></span> / <span class="studydocuments-page-max-cont" aria-hidden="true"></span></span>': {
			callback: function() {
				tools.modal({
					head: 'Go To Page:',
					body: '<div class="form-group"><input type="number" value="' + studydocuments.page.cur() + '" class="form-control studydocuments-go-page"></div>',
					button: {
						'Go': {
							type: 'success',
							close: true,
							callback: function() {
								studydocuments.page.set($('.studydocuments-go-page').val());
							},
						}
					}
				});
			}
		},
		'<span class="glyphicon glyphicon-arrow-right" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Next Page"></span>': {
			callback: studydocuments.page.inc
		},
		'<span class="glyphicon glyphicon-sort" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Sort"></span>': {
			callback: function() {
				var tmp = '<div class="form-group"><select class="form-control studydocuments-sort-select">';
				var cur = studydocuments.sort.cur();
				studydocuments.showInTable.forEach(function(i) {
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
								studydocuments.sort.set($('.studydocuments-sort-select').val());
							}
						}
					}

				});
			}
		},
		'<span class="glyphicon glyphicon-search" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="Search"></span>': {
			callback: function() {
				var tmp = '<div class="form-group"><select class="form-control studydocuments-search-select">';
				var cur = studydocuments.search.cur();
				if (cur === null || cur == '')
					cur = '';
				else
					cur = cur.split('==')[1];
				['_id', 'firstname', 'lastname'].forEach(function(i) {
					tmp += '<option value="' + i + '"' + ((i == cur) ? ' selected' : '') + '>' + i + '</option>';
				});
				tmp += '</select><br><input type="text" value="' + cur + '" class="form-control studydocuments-search-val"></div>';
				tools.modal({
					head: 'Search',
					body: tmp,
					button: {
						'Clear': {
							type: 'warning',
							close: true,
							callback: studydocuments.search.clr,
						},
						'Search': {
							type: 'success',
							close: true,
							callback: function() {
								studydocuments.search.set($('.studydocuments-search-select').val(), $('.studydocuments-search-val').val());
							}
						},
					}
				})
			}
		}
	});

	//Set Toolpit
	$('[data-toggle="tooltip"]').tooltip()

	// Set Initail Page and get first studydocuments
	if (studydocuments.page.cur() === null || isNaN(studydocuments.page.cur()))
		studydocuments.page.set(1);
	else
		studydocuments.page.set(studydocuments.page.cur());
</script>
