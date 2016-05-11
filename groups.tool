<div>
    <table class="table table-hover groups-table">
        <thead>
            <tr>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>

<script type="text/javascript">
    var groups = {
        showInTable: ['name'],
        curUserData: null,

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
            amivcore.groups.GET({
                data: {
                    'max_results': '50',
                    page: groups.page.cur(),
                    sort: groups.sort.cur(),
                    where: groups.search.cur(),
                }
            }, function(ret) {

                if (ret === undefined || ret['_items'].length == 0) {
                    tools.log('No Data', 'w');
                    return;
                }

                groups.meta = ret['_meta'];
                groups.page.max = Math.ceil(groups.meta.total / groups.meta.max_results);
                $('.groups-page-max-cont').html(groups.page.max);

                // Clear table from previous contentent
                $('.groups-table thead tr, .groups-table tbody').html('');

                groups.showInTable.forEach(function(i) {
                    $('.groups-table thead tr').append('<th>' + i + '</th>');
                });

                for (var n in ret['_items']) {
                    var tmp = '';
                    groups.showInTable.forEach(function(i) {
                        tmp += '<td>' + ret['_items'][n][i] + '</td>';
                    });
                    $('.groups-table tbody').append('<tr data-id="' + ret['_items'][n]['id'] + '">' + tmp + '</tr>');
                }
                $('.groups-table tbody tr').click(groups.showDetails);
            });
        },

        // Make Modal with editable table data
        showDetails: function(id) {
            if (typeof(id) !== 'number')
                id = $(this).attr('data-id');

            amivcore.groups.GET({
                'id': id
            }, function(ret) {
                curUserData = ret;

                var tmp = '<div class="groups-edit-cont" data-etag="' + ret['_etag'] + '" data-id="' + ret['id'] + '">';
                for (var cur in ret)
                    if (cur.charAt(0) != '_')
                        if (cur == 'user_subscribers') {
                            tmp += '<p><strong>Subscribed: <kbd>' + ret[cur].length + '</kbd> <kbd onclick="groups.sub.show(' + ret.id + ')"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></kbd></strong></p>';
                        } else {
                            switch (amivcore.getParamType('groups', cur)) {
                                case 'boolean':
                                    tmp += '<div class="checkbox"><label><input type="checkbox" name="' + cur + '" ' + ((ret[cur] == 'true') ? 'checked' : '') + '>' + cur + '</label></div>';
                                    break;

                                case 'integer':
                                    tmp += '<div class="form-group"><label>' + cur + ':</label><input type="number" value="' + ret[cur] + '" class="form-control" name="' + cur + '" min="0" step="1"></div>';
                                    break;

                                default:
                                    tmp += '<div class="form-group"><label>' + cur + ':</label><input type="text" value="' + ret[cur] + '" class="form-control" name="' + cur + '"></div>';
                                    break;
                            }
                        }
                tmp += '</div>';

                tools.modal({
                    head: ret.name,
                    body: tmp,
                    button: {
                        'Delete': {
                            type: 'danger',
                            callback: function() {
                                if (confirm('Fo\' shizzle my nizzle? U fo\' real?'))
                                    amivcore.groups.DELETE({
                                        id: $('.groups-edit-cont').first().attr('data-id'),
                                        header: {
                                            'If-Match': $('.groups-edit-cont').attr('data-etag')
                                        },
                                    }, function(ret) {
                                        if (ret === undefined) {
                                            tools.log('Group successfully deleted', 's');
                                            groups.get();
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
                            callback: groups.inspect,
                        },
                    }
                });

            });
        },

        // Check wether changes were maid and saves it in that case
        inspect: function() {
            var newUserData = {};
            $('.groups-edit-cont tr').each(function() {
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
                amivcore.groups.PATCH({
                    id: curUserData.id,
                    header: {
                        'If-Match': $('.groups-edit-cont').attr('data-etag')
                    },
                    data: curUserDataChanged
                }, function() {
                    tools.log('User Updated', 's');
                    groups.get();
                });
            }
        },

        //Make new user
        add: function() {
            var tmp = '<div class="row groups-user-add-form">' +
                '<div class="form-group"><label for="groups-name">Name:</label><input type="text" class="form-control" name="name" id="groups-name"></div>' +
                '<div class="form-group"><label for="groups-moderator">Group Admin:</label><input type="text" class="form-control" id="groups-moderator" name="moderator_id"></div>' +
                '<label class="checkbox-inline"><input type="checkbox" name="has_zoidberg_share">Has Zoidberg share</label>' +
                '<label class="checkbox-inline pull-right"><input type="checkbox" name="allow_self_enrollment">Self-Enrollment</label>' +
                '</div>';
            tools.modal({
                head: 'Create Group',
                body: tmp,
                button: {
                    'Add': {
                        type: 'success',
                        callback: function() {
                            var modName = $('#groups-moderator').val().trim().split(' ');
                            if (modName.length != 2) {
                                tools.log('Wrong input for Moderator', 'w');
                                return;
                            }
                            amivcore.users.GET({
                                data: {
                                    where: 'firstname==' + modName[0] + ';lastname==' + modName[1]
                                }
                            }, function(ret) {
                                if (ret['_items'].length !== 1) {
                                    tools.log('Moderator not found', 'w');
                                    return;
                                }
                                var newUserData = {};
                                $('.groups-user-add-form input').each(function() {
                                    newUserData[$(this).attr('name')] = $(this).val();
                                });
                                newUserData['moderator_id'] = ret['_items'][0].id;
                                amivcore.groups.POST({
                                    data: newUserData
                                }, function(ret) {
                                    if (!ret.hasOwnProperty('_status') || ret['_status'] != 'OK')
                                        tools.log(JSON.stringify(ret.responseJSON['_issues']), 'e');
                                    else {
                                        tools.modalClose();
                                        tools.log('Group Created', 's');
                                        groups.get();
                                    }
                                });
                            });
                        }
                    }
                }
            });
        },

        // See al Subscribed people
        sub: {
            show: function(id) {
                var showSubDetails = ['firstname', 'lastname'];
                amivcore.groups.GET({
                    'id': id
                }, function(ret) {
                    if (ret === undefined || ret.user_subscribers.length === 0) {
                        tools.log('No Subscriptions', 'i');
                        return;
                    }
                    ret.user_subscribers.forEach(function(curSub) {
                        amivcore.users.GET({
                            id: curSub.user_id
                        }, function(curSubUser) {
                            var tmp = '';
                            showSubDetails.forEach(function(i) {
                                tmp += '<td>' + curSubUser[i] + '</td>';
                            });
                            tmp += '<td><span class="glyphicon glyphicon-trash" aria-hidden="true" onclick="groups.sub.delete(' + curSub.id + ',\'' + curSub._etag + '\')"></span></td>';
                            $('.groups-show-sub tbody').append('<tr>' + tmp + '</tr>');
                        })
                    })
                    tools.modal({
                        head: 'Subscribers',
                        body: '<div class="form-group"><label>Add User:</label><input type="text" class="form-control groups-add-sub" data-group-id="' +
                            id + '"></div><strong>Subscribed:</strong><table class="table table-hover groups-show-sub"><tbody></tbody></table>',
                        button: {
                            'Back': {
                                type: 'warning',
                                callback: function() {
                                    groups.showDetails(id);
                                }
                            },
                            'Add': {
                                type: 'success',
                                callback: function() {
                                    groups.sub.add(id);
                                }
                            }
                        }
                    });
                });
            },
            add: function() {
                var modName = $('.groups-add-sub').first().val().trim().split(' ');
                if (modName.length != 2) {
                    tools.log('Wrong input for Moderator', 'w');
                    return;
                }
                amivcore.users.GET({
                    data: {
                        where: 'firstname==' + modName[0] + ';lastname==' + modName[1]
                    }
                }, function(ret) {
                    if (ret['_items'].length !== 1) {
                        tools.log('User not found', 'w');
                        return;
                    }
                    amivcore.groupusermembers.POST({
                        data: {
                            group_id: $('.groups-add-sub').first().attr('data-group-id'),
                            user_id: ret['_items'][0].id
                        },
                    }, function(retFinal) {
                        console.log(retFinal);
                        if (retFinal.hasOwnProperty('_status') && retFinal['_status'] == 'OK') {
                            tools.log('User added', 's');
                            groups.sub.show(parseInt($('.groups-add-sub').first().attr('data-group-id')));
                        } else {
                            tools.log(JSON.stringify(retFinal.responseJSON['_issues']), 'e');
                        }
                    });
                });
            },
            delete: function(id, etag) {
                if (confirm('Fo\' shizzle my nizzle? U fo\' real?'))
                    amivcore.groupusermembers.DELETE({
                        'id': id,
                        header: {
                            'If-Match': etag
                        },
                    }, function(ret) {
                        if (ret === undefined) {
                            tools.log('User successfully removed', 's');
                            groups.sub.show(parseInt($('.groups-add-sub').first().attr('data-group-id')));
                        } else {
                            tools.log('Error', 'e');
                        }
                    });
            }
        }
    };

    // Setup Menu
    tools.ui.menu({
        '<span class="glyphicon glyphicon-plus" aria-hidden="true" data-toggle="tooltip" data-placement="bottom" title="New Group"></span>': {
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
                ['name'].forEach(function(i) {
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
                ['name'].forEach(function(i) {
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
