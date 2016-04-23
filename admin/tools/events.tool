<div class="events-table-wrapper">
  <div class="tools-full-height">
    <table class="table table-hover events-table" id="events-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Date</th>
          <th>on website</th>
          <th>spots</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>
</div>

<!-- modal for details of events-->
<div class="modal fade" id="detail-modal" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 id="event-modal-title" class="modal-title"></h4>
      </div>
      <div class="modal-body">
        <table class="table table-hover" id="event-details-table">
          <thead>
            <tr>
              <th>field</th>
              <th>value</th>
            </tr>
          </thead>
          <tbody name="table-body">
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- modal for creating new events-->

<div class="modal fade" id="new-event-modal" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Create new Event</h4>
      </div>
      <div class="modal-body">
        <form id="new-event">
          <div class="form-group">
            <label for="title_de">Title</label>
            <input type="text" class="form-control" id="title_de"></input>
          </div>
          <div class="form-group">
            <label for="description_de">Description</label>
            <textarea type="text" class="form-control" rows="3" id="description_de"></textarea>
          </div>
          <div class="form-group">
            <label for="catchphrase_de">Catchphrase</label>
            <input type="text" class="form-control" id="catchphrase_de"></input>
          </div>

          <div class="form-group">
            <label for="time_start">Start Time</label>
            <input type="datetime" class="form-control" id="time_start"></input>
          </div>
          <div class="form-group">
            <label for="time_end">End Time</label>
            <input type="datetime" class="form-control" id="time_end"></input>
          </div>

            <label class="checkbox-inline">
              <input type="checkbox" id="signup-required" value="">No Signup
            </label>

          <label class="checkbox-inline">
            <input type="checkbox" id="no-signup-limit" value="">No Signup Limit
          </label>

          <div class="form-group">
            <label for="spots">Spots</label>
            <input type="number" class="form-control" id="spots"></input>
          </div>

          <label class="checkbox-inline">
            <input type="checkbox" id="allow_email_signup" value="">Only amiv Members
          </label>

          <div class="form-group">
            <label for="time_register_start">Start of Registration</label>
            <input type="datetime" class="form-control" id="time_register_start"></input>
          </div>
          <div class="form-group">
            <label for="time_register_end">End of Registration</label>
            <input type="datetime" class="form-control" id="time_register_end"></input>
          </div>

          <div class="form-group">
            <label for="location">Location</label>
            <input type="text" class="form-control" id="location"></input>
          </div>

          <div class="form-group">
            <label for="price">Price</label>
            <input type="number" class="form-control" id="price"></input>
          </div>

          <div>
            <label class="checkbox-inline">
              <input type="checkbox" id="show_website" value="">Show on Webstite (requires banner image and title)
            </label>
          </div>
          <div>
            <label class="checkbox-inline">
              <input type="checkbox" id="show_infoscreen" value="">Show ond Infoscreen (requires infoscreen image)
            </label>
          </div>
          <div>
            <label class="checkbox-inline">
              <input type="checkbox" id="show announce" value="">Show in Announce (requires stuff)
            </label>
          </div>

          <button type="button" class"btn" data-toggle="collapse" data-target="#english-collapse">show english fields</button>

          <div name="english-collapse" class="collapse">
            <div class="form-group">
              <label for="title_en">Title english</label>
              <input type="text" class="form-control" id="title_en"></input>
            </div>
            <div class="form-group">
              <label for="description_en">Description english</label>
              <textarea type="text" class="form-control" rows="3" id="description_en"></textarea>
            </div>
            <div class="form-group">
              <label for="catchphrase_en">Catchphrase english</label>
              <input type="text" class="form-control" id="catchphrase_en"></input>
            </div>
          </div>
          <!-- <input type="submit"> -->
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick="submitNewEvent()">Submit</button>
      </div>
    </div>
  </div>
</div>

<style>
.events-table-wrapper {
  position: relative;
}
.events-table-wrapper>div {
  overflow: auto;
}

#new-event-modal {
  overflow: auto;
}

#new-event-modal .checkbox-inline{
  margin-bottom: 10px;

}

.users-sidebar {
  background: #fff;
}
</style>

<script type="text/javascript">
var showInTable = ['title_de', 'time_start', 'show_website', 'spots'];
//var tableTitles = ['Title', 'Date', 'on website', 'spots'];

amivcore.events.GET({
  data: {
    'max_results': '50'
  }
}, function(ret) {
  console.log(ret);
  if (!ret || ret['_items'].length == 0) {
    tools.log('No Data', 'w');
    return;
  }

  //  tableTitles.forEach(function(i) {
  //      $('.events-table thead tr').append('<th>' + i + '</th>');
  //  });
  for (var n in ret['_items']) {
    var tmp = '';
    showInTable.forEach(function(i) {
      tmp += '<td>' + ret['_items'][n][i] + '</td>';
    });
    $('#events-table tbody').append('<tr name="' + ret['_items'][n]['id'] + '"">' + tmp + '</tr>');
  }



  //show modal on click of the table
  $('#events-table tbody tr').click(function(event) {
    var id = $(this).attr('name')
    var clickedEvent = $.grep(ret['_items'], function(e) {
      return e.id == id;
    })[0];
    console.log(clickedEvent);
    $('#detail-modal .modal-title').text(clickedEvent['title_de']);
    $('#detail-modal').modal('show');

    for (var field in clickedEvent) {
      var temp = '<td>' + field + '</td><td>' + clickedEvent[field] + '</td>';
      $('#event-details-table tbody').append('<tr>' + temp + '</tr>');
    }
  });

});
$('#detail-modal').on("hidden.bs.modal", function(e) {
  $(e.target).removeData("bs.modal").find(".modal-content tbody").empty();
});

tools.ui.menu({
  'New Event':{
    callback: function (){
      $('#new-event-modal').modal('show');
    }
  }
});

function submitNewEvent(){
  console.log("submitting new event");
  var newEvent = { data: {}};
  newEvent["data"]["title_de"] = "test"//$("#title_de").val();
  // newEvent["data"]["allow_email_signup"] = $(#signup-required).is(':checked');
  // newEvent["data"]["allow_email_signup"] = $(#signup-required).is(':checked');
  // newEvent["data"]["spots"] = parseInt(newEvent["data"]["spots"]);
  //newEvent["data"]["price"] = parseInt(newEvent["data"]["price"]);

  console.log(newEvent);
  //console.log(amivcore.events.POST({data:{"allow_email_signup":true, 'title_de':'fucking awesome event', 'spots':-1}}));
}
</script>
