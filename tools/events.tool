<div class="events-table-wrapper">
    <div class="tools-full-height">
        <table class="table table-hover events-table" id="events-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>on website</th>
                    <th>spots</th>
                    <th>signups</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>

<!-- modal for creating new events, easier to do it this way than js-->

<div class="modal fade" id="event-modal" role="dialog" data-etag="" data-backdrop="static" 
   data-keyboard="false" >
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" >&times;</button>
                <h4 class="modal-title" id="event-modal-title"></h4>
            </div>
            <div class="modal-body">
                <form id="event-modal-form">
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


                    <div class="form-group">
                        <label for="time_start">Start Advertising</label>
                        <div class="input-group date" id="time_advertising_start">
                            <input type="text" class="form-control" />
                            <span class="input-group-addon">
                    <span class="glyphicon-calendar glyphicon"></span>
                            </span>
                        </div>
                    </div>
                    <!-- </div> -->
                    <!-- <div class="col-md-3"> -->
                    <div class="form-group">
                        <label for="time_end">End Advertising</label>
                        <div class="input-group date" id="time_advertising_end">
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
                        <label for="price">Price [CHF]</label>
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

                    <div class="form-group">
                        <label for="price">Priority [1-10]</label>
                        <input type="number" class="form-control" min="0" id="priority" value=5></input>
                    </div>

                    <div class="form-group">
                        <label for="description_de">Additional Fields (JSON schema)</label>
                        <textarea type="text" class="form-control" rows="3" id="additional_fields"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="img_infoscreen">Infoscreen Image</label>
                        <input type="file" id="img_infoscreen" name="myFile"/>
                        <img class="event-image" visibility="invisble" src="" id="actual_img_infoscreen">
                    </div>
                    <div class="form-group"> 
                        <label for="img_banner">Banner Image</label>
                        <input type="file" id="img_banner"/>
                        <img class="event-image" visibility="invisble" src="" id="actual_img_banner">
                    </div>
                    <div class="form-group">
                        <label for="img_poster">Poster Image</label>
                        <input type="file" id="img_poster"/>
                        <img class="event-image" visibility="invisble" src="" id="actual_img_poster">
                    </div>
                    <div class="form-group">
                        <label for="img_thumbnail">Thumbnail</label>
                        <input type="file" id="img_thumbnail"/>
                        <img class="event-image" visibility="invisble" src="" id="actual_img_thumbnail">
                    </div>


                    <button type="button" class "btn" data-toggle="collapse" data-target="#english-collapse">show english fields</button>

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

                    <div id="additional_info">
                    </div>
                    <!-- <input type="submit"> -->
                </form>
            </div>
            <div class="modal-footer" id="event-modal-footer">
                <!-- footer content here -->
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

    #event-modal {
        overflow: auto;
    }

    #event-modal .checkbox-inline {
        margin-bottom: 10px;
    }

    .users-sidebar {
        background: #fff;
    }

    .tooltip-inner {
        white-space: nowrap;
        max-width: none;
    }

    .event-image {
        margin-top: 10px;
        width: 100%;
    }
</style>

<script type="text/javascript">
    var events = {
        API_url: 'http://192.168.1.100',
        somethingChanged: false,
        showInTable: ['title_de', 'time_start', 'show_website', 'spots', 'signup_count'],
        curEventData: null,

        // Page
        page: {
            max: Number.MAX_VALUE,
            cur: function() {
                return parseInt(tools.mem.session.get('curPage'));
            },
            set: function(num) {
                num = parseInt(num);
                if (num > 0 && num < events.page.max + 1)
                    tools.mem.session.set('curPage', num);
                $('.events-cur-page-cont').html(events.page.cur());
                events.get();
            },
            inc: function() {
                events.page.set(events.page.cur() + 1);
            },
            dec: function() {
                events.page.set(events.page.cur() - 1);
            }
        },

        //Sorting
        sort: {
            cur: function() {
                return tools.mem.session.get('curSort');
            },
            set: function(sort) {
                tools.mem.session.set('curSort', sort);
                events.get();
            },
            inv: function() {
                var tmp = events.sort.cur();
                if (tmp.charAt(0) == '-')
                    events.sort.set(tmp.slice(1));
                else
                    events.sort.set('-' + tmp);
            }
        },

        //Searching
        search: {
            cur: function() {
                return tools.mem.session.get('search');
            },
            set: function(dom, val) {
                tools.mem.session.set('search', dom + '==' + val);
                events.page.set(1);
            },
            clr: function() {
                tools.mem.session.set('search', '');
                events.page.set(1);
            },
        },

        get: function() {
            $('#wheel-logo').css('transform', 'rotate(360deg)');
            console.log('getting events...');
            amivcore.events.GET({
                data: {
                    'max_results': '50',
                    page: events.page.cur(),
                    sort: events.sort.cur(),
                    where: events.search.cur(),
                }
            }, function(ret) {
                console.log(ret);
                if (ret === undefined || ret['_items'].length == 0) {
                    tools.log('No Data', 'w');
                    // Clear table from previous contentent
                    $('.events-table tbody').html('');
                    return;
                }
                events.meta = ret['_meta'];
                events.page.max = Math.ceil(events.meta.total / events.meta.max_results);
                $('.events-page-max-cont').html(events.page.max);

                // Clear table from previous contentent
                $('.events-table tbody').html('');

                for (var n in ret['_items']) {
                    var tmp = '';
                    events.showInTable.forEach(function(i) {
                        tmp += '<td>' + ret['_items'][n][i] + '</td>';
                    });
                    $('.events-table tbody').append('<tr data-id="' + ret['_items'][n]['_id'] + '">' + tmp + '</tr>');
                }
                $('.events-table tbody tr').click(events.showDetails);
                $('#wheel-logo').css('transform', 'rotate(0deg)');
            });

        },

        createEvent: function() {
            
            $("#event-modal-title").text("Create Event");
            $('#event-modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" onclick="events.submitEvent(true)">Submit</button>');
            $('#event-modal').modal('show');
        },

        //show details of an event in a modal
        //TODO: fill the more beautiful event-modal
        showDetails: function() {
            somethingChanged = false;
            console.log($(this).attr('data-id'));
            amivcore.events.GET({
                id: $(this).attr('data-id')
            }, function(ret) {
                curEventData = ret;
                console.log(curEventData);
                etag = ret['_etag'];
                $("#event-modal-title").text("Edit Event");
                $('#event-modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" onclick="events.submitEvent(false)">update</button><button type="button" class="btn btn-danger" onclick="events.deleteEvent()">Delete</button>');

                imageData = ['img_infoscreen', 'img_thumbnail', 'img_poster', 'img_banner'];

                for (i = 0; i < imageData.length; i++){
                    if (ret[imageData[i]]){
                        console.log(events.API_url + ret[imageData[i]]['file']);
                        $('#actual_' + imageData[i]).attr('src', events.API_url + ret[imageData[i]]['file']);
                    }
                }

                //fill fields of the form with content that has the same ID
                $('#event-modal-form').find('input, textarea').val(function (index, value) {
                    if (this.type != 'file')
                        return ret[this.id];
                });

                //array of elements that are represented by checkboxes
                var booleanEventData = ['no-signup-limit', 'allow_email_signup', 'show_website', 'show_infoscreen', 'show_announce'];

                var dateEventData = ['time_start', 'time_end', 'time_register_start', 'time_register_end', 'time_advertising_start', 'time_advertising_end'];

                //set the datepickers
                for (i = 0; i < dateEventData.length; i++){
                    if (ret[dateEventData[i]] != null){
                        $('#' + dateEventData[i]).data("DateTimePicker").date(new Date(ret[dateEventData[i]]));
                    }
                }

                for (i = 0; i < booleanEventData.length; i++){
                    $("#" + booleanEventData[i]).prop('checked', ret[booleanEventData[i]]);
                }

                //edge cases (signup required is inverted)
                // if (spots == null){
                    $('#signup-required').prop('checked', !ret['signup-required']);
                // }

                
                $('#event-modal').modal('show');

                
            });
        },


        deleteEvent: function() {
            console.log(curEventData._etag);
            if (confirm("Delete " + curEventData.title_de + "?")) {
                amivcore.events.DELETE({
                    id: curEventData._id,
                    header: {
                        // 'If-Match': $('#event-modal').attr('data-etag')
                        'If-Match': curEventData._etag
                    }
                }, function(response) {
                    console.log(response);
                });
                events.get();
                tools.log('Event deleted', 'w');
                tools.modalClose();
            } else {
                tools.log('Event not Deleted', 'i');
            }
        },


        showSignups: function(curEventData) {
            var tmp = '<table class="table table-hover events-edit-table" data-etag="' + curEventData['_etag'] + '"><tbody>';
            for (var user in curEventData['signups']) {
                tmp += '<tr><td>' + user + '</td><td contenteditable>' + curEventData['signups'][cur] + '</td></tr>';
            }
            tmp += '</tbody></table>';
            tools.modal({
                head: curEventData.title_de,
                body: tmp,
                button: {
                    'Update': {
                        type: 'success',
                        close: false
                            //callback
                    }
                }
            });
        },

        submitEvent: function(isNew) {
            console.log("submitting new event");
            var newEvent = {
                data: {}
            };
            newEvent["data"]["title_de"] = setNullIfEmpty($("#title_de").val());
            newEvent["data"]["description_de"] = setNullIfEmpty($("#description_de").val());
            newEvent["data"]["catchphrase_de"] = setNullIfEmpty($("#catchphrase_de").val());

            if (!($("#time_start").data("DateTimePicker").date() == null)) {
                newEvent["data"]["time_start"] = $("#time_start").data("DateTimePicker").date().toISOString().split('.')[0]+"Z";
            }
            if (!($("#time_end").data("DateTimePicker").date() == null)) {
                newEvent["data"]["time_end"] = $("#time_end").data("DateTimePicker").date().toISOString().split('.')[0]+"Z";
            }


            if (!($("#time_advertising_start").data("DateTimePicker").date() == null)) {
                newEvent["data"]["time_advertising_start"] = $("#time_advertising_start").data("DateTimePicker").date().toISOString().split('.')[0]+"Z";
            }
            if (!($("#time_advertising_end").data("DateTimePicker").date() == null)) {
                newEvent["data"]["time_advertising_end"] = $("#time_advertising_end").data("DateTimePicker").date().toISOString().split('.')[0]+"Z";
            }



            if (!$("#signup-required").is(":checked")) {
                if ($("#no-signup-limit").is(":checked")) {
                    newEvent["data"]["spots"] = 0;
                } else {
                    if ($("#spots").val() === "") {
                        tools.log("Please specify a number of Spots", "e");
                        return;
                    }
                    newEvent["data"]["spots"] = parseInt($("#spots").val());

                }
                if (!($("#time_register_start").data("DateTimePicker").date() == null)) {
                    newEvent["data"]["time_register_start"] = $("#time_register_start").data("DateTimePicker").date();
                } else {
                    tools.log('field "Start of Registration" required', 'e');
                    return;
                }
                if (!($("#time_register_end").data("DateTimePicker").date() == null)) {
                    newEvent["data"]["time_register_end"] = $("#time_register_end").data("DateTimePicker").date();
                } else {
                    tools.log('field "End of Registration" required', 'e');
                    return;
                }
                newEvent["data"]["allow_email_signup"] = $("#allow_email_signup").is(':checked');
            } else {
                newEvent["data"]["spots"] = null;
            }

           

            newEvent["data"]["location"] = setNullIfEmpty($("#location").val());

            if (!($("#price").val() === "")) {
                newEvent["data"]["price"] = Math.floor((parseFloat($("#price").val()) * 100));
            }

            newEvent["data"]["show_website"] = $("#show_website").is(':checked');
            newEvent["data"]["show_infoscreen"] = $("#show_infoscreen").is(':checked');
            newEvent["data"]["show_announce"] = $("#show_announce").is(':checked');
            newEvent["data"]["priority"] = (parseInt($("#priority").val()));
            newEvent["data"]["additional_fields"] = setNullIfEmpty($("#additional_fields").val());

            newEvent["data"]["title_en"] = setNullIfEmpty($("#title_en").val());
            newEvent["data"]["description_en"] = setNullIfEmpty($("#description_en").val());
            newEvent["data"]["catchphrase_en"] = setNullIfEmpty($("#catchphrase_en").val());

            console.log(newEvent);

            form = new FormData();
            // for (data in newEvent.data){
            //     form.append(data, newEvent['data'][data]);
            // }
            var imageData = ['img_infoscreen', 'img_thumbnail', 'img_poster', 'img_banner'];
            for (i = 0; i < imageData.length; i++){
                if ($('#' + imageData[i])[0].files[0] != undefined)
                    form.append(imageData[i], $('#' + imageData[i])[0].files[0]);
            }

            console.log(JSON.stringify(newEvent));
            if(isNew) {
                var response = amivcore.events.POST(newEvent, function(ret) {
                    if (!ret.hasOwnProperty('_status') || ret['_status'] != 'OK')
                        tools.log(JSON.stringify(ret.responseJSON['_issues']), 'e');
                    else {
                        console.log(ret);
                        curEventData = ret;
                        events.uploadCallback(form);
                    }
                });
            } 
            else {
                newEvent['header'] = {};
                newEvent['header']['If-Match'] = curEventData._etag;
                newEvent['id'] = curEventData._id;
                console.log(newEvent);
                var response = amivcore.events.PATCH(newEvent, function(ret) {
                    if (!ret.hasOwnProperty('_status') || ret['_status'] != 'OK')
                        tools.log(JSON.stringify(ret.responseJSON['_issues']), 'e');
                    else {
                        events.uploadCallback(form);
                    }
                });
            }  
            console.log(response);
        },

        //images need to be uploaded seperately after POSTing using PATCH
        uploadCallback: function(form){
            amivcore.getEtag('events', curEventData._id, function(ret){
                $.ajax({
                    url: events.API_url + '/events/' + curEventData._id,
                    headers: {'Authorization':'root', 'If-Match': ret},
                    data: form,
                    type: 'PATCH',
                    // THIS MUST BE DONE FOR FILE UPLOADING
                    contentType: false,
                    processData: false,
                    // ... Other options like success and etc
                    success: function(data){
                        console.log(data);
                        tools.log('Event Added', 's');
                        $('#event-modal').modal('hide');
                        $("#event-modal-form").trigger('reset');
                        events.get();
                    }
                });
            });
                
        }
    }


    //setting up the date time picker
    $(function() {
        $('#time_start').datetimepicker({
            locale: "de",
            sideBySide: true
        });

        $('#time_end').datetimepicker({
            locale: "de",
            useCurrent: false, //Important! See issue #1075aa
            sideBySide: true
        });

        $('#time_advertising_start').datetimepicker({
            locale: "de",
            sideBySide: true
        });

        $('#time_advertising_end').datetimepicker({
            locale: "de",
            useCurrent: false, //Important! See issue #1075aa
            sideBySide: true
        });

        $('#time_register_start').datetimepicker({
            locale: "de",
            sideBySide: true
        });
        $('#time_register_end').datetimepicker({
            locale: "de",
            useCurrent: false, //Important! See issue #107534
            sideBySide: true
        });
        $("#time_register_start").on("dp.change", function(e) {
            $('#time_register_end').data("DateTimePicker").minDate(e.date);
        });
        $("#time_register_end").on("dp.change", function(e) {
            $('#time_register_start').data("DateTimePicker").maxDate(e.date);
        });
        $("#time_advertising_start").on("dp.change", function(e) {
            $('#time_advertising_end').data("DateTimePicker").minDate(e.date);
        });
        $("#time_advertising_end").on("dp.change", function(e) {
            $('#time_advertising_start').data("DateTimePicker").maxDate(e.date);
        });
        $("#time_start").on("dp.change", function(e) {
            $('#time_end').data("DateTimePicker").minDate(e.date);
        });
        $("#time_end").on("dp.change", function(e) {
            $('#time_start').data("DateTimePicker").maxDate(e.date);
        });
    });

    $('#signup-required').click(function() {
        $('#no-signup-limit').attr('disabled', this.checked);
        $('#spots').attr('disabled', this.checked);
        $('#time_register_end>input').attr('disabled', this.checked);
        $('#time_register_start>input').attr('disabled', this.checked);
    });

    $('#no-signup-limit').click(function() {
        $('#spots').attr('disabled', this.checked);
    });

    $('#event-modal').on('hidden.bs.modal', function () {
  // do something…
        $('#event-modal img').attr('src', '');
        $("#event-modal-form").trigger('reset');
    })

// tools in the top bar
    tools.ui.menu({
        '<span class="glyphicon glyphicon-plus"  data-toggle="tooltip" aria-hidden="true" title="Create new Event" data-placement="bottom"></span>': {
            callback: events.createEvent
        },
        '<span class="glyphicon glyphicon-refresh" aria-hidden="true"  data-toggle="tooltip" title="Refresh" data-placement="bottom"></span>': {
            callback: events.get
        },
        '<span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>': {
            callback: events.page.dec
        },
        '<span class="events-cur-page-cont" aria-hidden="true"></span> / <span class="events-page-max-cont" aria-hidden="true"></span>': {
            callback: function() {
                tools.modal({
                    head: 'Go To Page:',
                    body: '<div class="form-group"><input type="number" value="' + events.page.cur() + '" class="form-control events-go-page"></div>',
                    button: {
                        'Go': {
                            type: 'success',
                            close: true,
                            callback: function() {
                                events.page.set($('.events-go-page').val());
                            },
                        }
                    }
                });
            }
        },
        '<span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>': {
            callback: events.page.inc
        },
        '<span class="glyphicon glyphicon-sort" aria-hidden="true" data-toggle="tooltip" title="Sort" data-placement="bottom"></span>': {
            callback: function() {
                var tmp = '<div class="form-group"><select class="form-control events-sort-select">';
                var cur = events.sort.cur();
                ['_id', 'title_de', 'description_de', 'time_start', 'time_register_start', 'time_end', 'time_register_end', 'show_website', 'show_announce', 'show_infoscreen', 'price', '_updated', 'location'].forEach(function(i) {
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
                                events.sort.set($('.events-sort-select').val());
                            }
                        }
                    }

                });
            }
        },
        '<span class="glyphicon glyphicon-search" aria-hidden="true" data-toggle="tooltip" title="Search" data-placement="bottom"></span>': {
            callback: function() {
                var tmp = '<div class="form-group"><select class="form-control events-search-select">';
                var cur = events.search.cur();
                if (cur === null || cur == '')
                    cur = '';
                else
                    cur = cur.split('==')[1];
                ['_id', 'title_de', 'description_de', 'title_en', 'description_en', 'time_start', 'time_register_start', 'time_end', 'time_register_end', 'show_website', 'show_announce', 'show_infoscreen', 'price', '_updated', 'location']
                .forEach(
                    function(i) {
                        tmp += '<option value="' + i + '"' + ((i == cur) ? ' selected' : '') + '>' + i + '</option>';
                    });
                tmp += '</select><br><input type="text" value="' + cur + '" class="form-control events-search-val"></div>';
                tools.modal({
                    head: 'Search',
                    body: tmp,
                    button: {
                        'Clear': {
                            type: 'warning',
                            close: true,
                            callback: events.search.clr,
                        },
                        'Search': {
                            type: 'success',
                            close: true,
                            callback: function() {
                                events.search.set($('.events-search-select').val(), $('.events-search-val').val());
                            }
                        },
                    }
                })
            }
        }
    });

    if (events.page.cur() === null || isNaN(events.page.cur()))
        events.page.set(1);
    else
        events.page.set(events.page.cur());

    $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
        $('#event-modal-form').on('keyup change', 'input, select, textarea, span ', function(){
            console.log('changed shit');
            events.somethingChanged = true;
        });
    });

    function setNullIfEmpty(formData) {
        if (formData === "") {
            return null;
        }
        return formData;
    }
</script>
