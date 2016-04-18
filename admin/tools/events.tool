<div class="users-table-wrapper">
	<div class="tools-full-height">
		<table class="table table-hover events-table">
			<thead>
				<tr>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
</div>
<style>
.users-table-wrapper {
	position: relative;
}
.users-table-wrapper>div {
	overflow: auto;
}

.users-sidebar {
	background: #fff;
}
</style>
<script type="text/javascript">
var showInTable = ['title_de', 'catchphrase_de', 'show_website', 'spots'];
amivcore.events.GET({data:{'max_results':'50'}}, function(ret){
	console.log(ret);
	if(!ret || ret['_items'].length == 0){
		tools.log('No Data', 'w');
		return;
	}

	showInTable.forEach(function(i){
		$('.events-table thead tr').append('<th>'+ i +'</th>');
	});

	for(var n in ret['_items']){
		var tmp = '';
		showInTable.forEach(function(i){
			tmp += '<td>'+ ret['_items'][n][i] +'</td>';
		});
		$('.events-table tbody').append('<tr>'+tmp+'</tr>');
		//$('.users-table tbody').append('<tr><td>'+ret['_items'][n].firstname+'</td></tr>');
	}
});
</script>
