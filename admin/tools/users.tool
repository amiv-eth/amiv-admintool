<div class="users">
  
</div>
<style>
  .users {
	  width: 100%;
	  height: 100%;
  }
</style>
<script type="text/javascript">
  amivcore.users.GET({}, function(ret){
	  console.log(ret);
	  $('.users').html(JSON.stringify(ret));
  });
</script>