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
<!-- <div class="modal fade" id="detail-modal" role="dialog">
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
</div> -->

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

          <!-- <div class="container"> -->
            <!-- <div class="col-md-3"> -->
              <div class="form-group">
                <label for="time_start">Start Time</label>
                <div class="input-group date" id="time_start">
                  <input type="text" class="form-control" />
                  <span class="input-group-addon">
                    <span class="glyphicon-calendar glyphicon"></span>
                  </span>
                </div>
              </div>
            <!-- </div> -->
            <!-- <div class="col-md-3"> -->
              <div class="form-group">
                <label for="time_end">End Time</label>
                <div class="input-group date" id="time_end">
                  <input type="text" class="form-control" />
                  <span class="input-group-addon">
                    <span class="glyphicon-calendar glyphicon"></span>
                  </span>
                </div>
              </div>
            <!-- </div> -->
          <!-- </div> -->

        <label class="checkbox-inline">
          <input type="checkbox" id="signup-required" value="">No Signup
        </label>

        <label class="checkbox-inline">
          <input type="checkbox" id="no-signup-limit" value="">No Signup Limit
        </label>

          <div class="form-group">
            <label for="spots">Spots</label>
            <input type="number" class="form-control" min="-1" id="spots"></input>
          </div>

          <!-- <div class="container"> -->
            <!-- <div class="col-md-3"> -->
              <div class="form-group">
                <label for="time_register_start">Start of Registration</label>
                <div class="input-group date" id="time_register_start">
                  <input type="text" class="form-control" />
                  <span class="input-group-addon">
                    <span class="glyphicon-calendar glyphicon"></span>
                  </span>
                </div>
              </div>
            <!-- </div> -->
            <!-- <div class="col-md-3"> -->
              <div class="form-group">
                <label for="time_register_end">End of Registration</label>
                <div class="input-group date" id="time_register_end">
                  <input type="text" class="form-control" />
                  <span class="input-group-addon">
                    <span class="glyphicon-calendar glyphicon"></span>
                  </span>
                </div>
              </div>
            <!-- </div> -->
          <!-- </div> -->

          <label class="checkbox-inline">
            <input type="checkbox" id="allow_email_signup" value="">Only amiv Members
          </label>

          <div class="form-group">
            <label for="location">Location</label>
            <input type="text" class="form-control" id="location"></input>
          </div>

          <div class="form-group">
            <label for="price">Price</label>
            <input type="number" class="form-control" min="0" id="price"></input>
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
              <input type="checkbox" id="show_announce" value="">Show in Announce (requires stuff)
            </label>
          </div>

          <button type="button" class"btn" data-toggle="collapse" data-target="#english-collapse">show english fields</button>

          <div id="english-collapse" class="collapse">
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
        <button type="button" class="btn btn-primary" onclick="events.submitNewEvent">Submit</button>
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
  var events = {
    showInTable: ['title_de', 'time_start', 'show_website', 'spots'],
    curEventData: null,

    get: function(ret) {
      console.log(ret);
      if (!ret || ret['_items'].length == 0) {
        tools.log('No Data', 'w');
        return;
      }

      for (var n in ret['_items']) {
        var tmp = '';
        events.showInTable.forEach(function(i) {
          tmp += '<td>' + ret['_items'][n][i] + '</td>';
        });
        $('#events-table tbody').append('<tr name="' + ret['_items'][n]['id'] + '"">' + tmp + '</tr>');
      }



      //show modal on click of the table
      $('#events-table tbody tr').click(events.showDetails);
      //   var id = $(this).attr('name')
      //   var clickedEvent = $.grep(ret['_items'], function(e) {
      //     return e.id == id;
      //   })[0];
      //   console.log(clickedEvent);
      //   $('#detail-modal .modal-title').text(clickedEvent['title_de']);
      //   $('#detail-modal').modal('show');
      //
      //   for (var field in clickedEvent) {
      //     var temp = '<td>' + field + '</td><td contenteditable>' + clickedEvent[field] + '</td>';
      //     $('#event-details-table tbody').append('<tr>' + temp + '</tr>');
      //   }
    },



    showDetails: function(){
      amivcore.events.GET({
        id: $(this).attr('name')
      }, function(ret) {
        curEventData = ret;
        var tmp = '<table class="table table-hover" data-etag="' + ret['_etag'] + '"><tbody>';
        for (var cur in ret)
        if (cur.charAt(0) != '_')
        tmp += '<tr><td>' + cur + '</td><td contenteditable>' + ret[cur] + '</td></tr>'
        tmp += '</tbody></table>';

        tools.modal({
          head: ret.title_de,
          body: tmp,
          button: {
            'Update': {
              type: 'success',
              close: true,
              //callback: users.inspectUser,
            }
          }
        });
      });
    },

    submitNewEvent: function(){
      console.log("submitting new event");
      var newEvent = { data: {}};
      newEvent["data"]["title_de"] = setNullIfEmpty($("#title_de").val());
      newEvent["data"]["description_de"] = setNullIfEmpty($("#description_de").val());
      newEvent["data"]["catchphrase_de"] = setNullIfEmpty($("#catchphrase_de").val());

      if (!($("#time_start").data("DateTimePicker").date() == null)){
        //for now, because the api rejects .toISOString format
        newEvent["data"]["time_start"] = $("#time_start").data("DateTimePicker").date().format("YYYY-MM-DDThh:mm:ss") + "Z";
      }
      if (!($("#time_end").data("DateTimePicker").date() == null)){
        //for now, because the api rejects .toISOString format
        newEvent["data"]["time_end"] = $("#time_end").data("DateTimePicker").date().format("YYYY-MM-DDThh:mm:ss") + "Z";
      }

      if (!$("#signup-required").is(":checked")) {
        if ($("#no-signup-limit").is(":checked")) {
          newEvent["data"]["spots"] = 0;
        }
        else {
          if ($("#spots").val() === ""){
            tools.log("Please specify a number of Spots", "e");
            return;
          }
          newEvent["data"]["spots"] = parseInt($("#spots").val());

        }
        if (!($("#time_register_start").data("DateTimePicker").date() == null)){
          //for now, because the api rejects .toISOString format
          newEvent["data"]["time_register_start"] = $("#time_register_start").data("DateTimePicker").date().format("YYYY-MM-DDThh:mm:ss") + "Z";
        }
        else {
          tools.log('field "Start of Registration" required', 'e');
          return;
        }
        if (!($("#time_register_end").data("DateTimePicker").date() == null)){
          //for now, because the api rejects .toISOString format
          newEvent["data"]["time_register_end"] = $("#time_register_end").data("DateTimePicker").date().format("YYYY-MM-DDThh:mm:ss") + "Z";
        }
        else {
          tools.log('field "End of Registration" required', 'e');
          return;
        }
      }
      else {
        newEvent["data"]["spots"] = -1;
      }

      newEvent["data"]["allow_email_signup"] = $("#allow_email_signup").is(':checked');

      newEvent["data"]["location"] = setNullIfEmpty($("#location").val());

      if (!($("#price").val() === "")) {
        newEvent["data"]["price"] = Math.floor((parseFloat($("#price").val()) * 100));
      }

      newEvent["data"]["show_website"] = $("#show_website").is(':checked');
      newEvent["data"]["show_infoscreen"] = $("#show_infoscreen").is(':checked');
      newEvent["data"]["show_announce"] = $("#show_announce").is(':checked');


      newEvent["data"]["title_en"] = setNullIfEmpty($("#title_en").val());
      newEvent["data"]["description_en"] = setNullIfEmpty($("#description_en").val());
      newEvent["data"]["catchphrase_en"] = setNullIfEmpty($("#catchphrase_en").val());

      console.log(newEvent);
      console.log(JSON.stringify(newEvent));
      var response = amivcore.events.POST(newEvent);
      console.log(response);
    }
  }

//var showInTable = ['title_de', 'time_start', 'show_website', 'spots'];

amivcore.events.GET({data: {'max_results': '50'}}, events.get);

//setting up the date time picker
$(function () {
  $('#time_start').datetimepicker({
    locale: "de"
  });
  $('#time_end').datetimepicker({
    locale: "de",
    useCurrent: false //Important! See issue #1075
  });
  $('#time_register_start').datetimepicker({
    locale: "de"
  });
  $('#time_register_end').datetimepicker({
    locale: "de",
    useCurrent: false //Important! See issue #1075
  });
  $("#time_register_start").on("dp.change", function (e) {
    $('#time_register_end').data("DateTimePicker").minDate(e.date);
  });
  $("#time_register_end").on("dp.change", function (e) {
    $('#time_register_start').data("DateTimePicker").maxDate(e.date);
  });
  $("#time_start").on("dp.change", function (e) {
    $('#time_end').data("DateTimePicker").minDate(e.date);
  });
  $("#time_end").on("dp.change", function (e) {
    $('#time_start').data("DateTimePicker").maxDate(e.date);
  });
});

$('#signup-required').click(function(){
   $('#no-signup-limit').attr('disabled',this.checked);
   $('#spots').attr('disabled',this.checked);
   $('#time_register_end>input').attr('disabled',this.checked);
   $('#time_register_start>input').attr('disabled',this.checked);
});

$('#no-signup-limit').click(function(){
   $('#spots').attr('disabled',this.checked);
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





function setNullIfEmpty(formData){
  if (formData === ""){
    return null;
  }
  return formData;
}

</script>
