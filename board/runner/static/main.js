var idx_rule = 0;
var idx_action = 0;
var config = {};
var values = {};
var av_sensors = {};

$(document).ready(function () {

    $(".loader").hide();
    $(".tab-link").click(function () {

        tabId = $(this).attr("id");
        tabUrl = $(this).attr("href");

        $(".tab-link").removeClass("current");
        $(this).addClass("current");

        loadTabContent(tabUrl, tabId);
        return false;
    });

});

function loadTabContent(tabUrl, tabId) {
    $(".tab-content").hide();
    $(".loader").show();

    if (Object.keys(config).length === 0) {
        console.log('Waiting for config...');
        sleepFor(200);
    }


    jQuery.ajax({
        url: tabUrl,
        cache: false,
        success: function (message) {

            $("#tabcontent").empty().append(message);
            $(".loader").hide();
            $(".tab-content").show();

            if (tabId === 'tab-1') {
            }

            else if (tabId === 'tab-2') {
                fill_config(config);
            }

        }
    });
}

function remove_rule(i) {
    $('#new-rule-' + i).remove();
}

function remove_action(i) {
    $('#new-action-' + i).remove();
}


function add_rule() {
    idx_rule += 1;
    jQuery.ajax({
        url: '/static/automation/new_input_rule.html',
        cache: false,
        success: function (message) {
            $("#rules").append(message.split('##id##').join(idx_rule));
            fill_automation_config(config);
        }
    });
}

function add_action() {
    idx_action += 1;

    jQuery.ajax({
        url: '/static/automation/new_action.html',
        cache: false,
        success: function (message) {
            $("#actions").append(message.split('##id##').join(idx_action));
            fill_automation_config(config);
        }
    });
}

function show_rule(rule, i) {
    var rules = document.getElementsByClassName('rule-' + i);

    for (var index = 0; index < rules.length; index++) {
        rules[index].style.display = 'none'
    }

    document.getElementById(rule).style.display = 'block';

    if (rule.indexOf("temp-dependency") > -1) {
        $('#add_action_rule_button').hide();
        $('#add_input_rule_button').hide();
        $('#actions').hide();
        $('.section-labels').hide()

    }
    else {
        $('#add_action_rule_button').show();
        $('#add_input_rule_button').show();
        $('#actions').show();
        $('.section-labels').show()


    }
}

function show_action(action, i) {
    var actions = document.getElementsByClassName('action-' + i);
    for (var index = 0; index < actions.length; index++) {
        actions[index].style.display = 'none'
    }
    document.getElementById(action).style.display = 'block';
}


function checkRequired(container) {


    if (container.find('[required]').filter(function () {
            if (this.value === '') {
                $(this).css('border-color', 'red');
            }
            return this.value === ''


        }).length > 0) {
        alert("Деякі поля обов'язкові до заповення.");
        return false;
    }
    return true;
}

$(document).ready(function () {
    load_config()
});

function check_all() {
    if ($('#actions').children().length == 0) {
        alert("Ви повинні ввести правила та події щоб зберегти нову автоматизацію.");
        return false;
    }

    else if (!checkRequired($('#new_automation'))) {
        return false;
    }
}

function add_rule_ajax() {
    console.log('form data is: ' + $('#new_automation :visible').serialize());

    if (check_all()) {
        $('#new_automation').submit()

    }

}

function rename_value(elm) {
    console.log('Renaming: ', $(elm).attr('bind'));
    var new_name = prompt('Please enter new name for ' + $(elm).closest('.name').attr('class') + ':');
    if ((new_name === null) || (new_name === "")) {
        return
    }
    $.post('/rename_device', {'device': $(elm).attr('bind'), 'new_name': new_name}).done(function (data) {
        var renamed = JSON.parse(data);
        console.log('Deleted: ' + renamed);
    });
    reload();

}

function delete_row(elm) {
    console.log('Deleting: ', $(elm).attr('bind'));
    $.post('/delete_device', {'device': $(elm).attr('bind')}).done(function (data) {
        var deleted = JSON.parse(data);
        console.log('Deleted: ' + deleted);
    });
    reload();
}


function load_config() {
    console.log('Loading config: ');

    $.ajax({url: '/get_config'}).done(function (data) {
        config = JSON.parse(data);
        console.log('Config: ' + config);
    })
}

function load_values() {
    console.log('Loading values: ');

    $.ajax({url: '/get_values'}).done(function (data) {
        values = JSON.parse(data);
        console.log('Values: ' + values);
        $.each(values, function (key, value) {
            $('#' + key).html(value)
        })
    });
    fill_new_devices();

}


function fill_new_devices() {
    var templates = {
        "temp": "<select required name='##type##' class='new_temp_values'><option value='0'></option></select>",
        "port": "<select required name='##type##' class='new_port_values'><option value='0'></option></select>"
    };

    $.ajax({url: '/get_available_devices'}).done(function (data) {
        av_sensors = JSON.parse(data);
        console.log('Available devices: ' + av_sensors);


        $.each(av_sensors, function (key, value) {
            var html = templates[key];
            if (templates.hasOwnProperty(key)) {

                $('.new_' + key).each(function (idx_0, el) {
                    var param = $(el).attr('id');
                    console.log(param);
                    $(el).html(html.split('##type##').join(param));
                });
                $.each(value, function (idx, address) {
                    $('.new_' + key + '_values').append("<option value='" + address + "'>" + address + "</option>\n")
                });

            }
        })
    });


}

function fill_config(config) {

    var templates = {
        "temp": " <tr id='##id##' class='row'>\n" +
        "                <td class='device_name'>##name##</td>\n" +
        "                <td>##address##</td>\n" +
        "                <td id='temp_##id##'><div class='loading_value'></td>\n" +
        "                <td><input bind='temp_##id##' type='button' value='перейменувати' onclick='rename_value(this)'></td>\n" +
        "                <td><input bind='temp_##id##' type='button' value='видалити' onclick='delete_row(this)'></td>\n" +
        "            </tr>\n",
        "pomp": "            <tr>\n" +
        "                <td class='device_name'>##name##</td>\n" +
        "                <td>##port##</td>\n" +
        "                <td id='pomp_##id##'><div class='loading_value'></td>\n" +
        "                <td><input bind='pomp_##id##' type='button' value='перейменувати' onclick='rename_value(this)'></td>\n" +
        "                <td><input bind='pomp_##id##' type='button' value='видалити' onclick='delete_row(this)'></td>\n" +
        "            </tr>\n",
        "clap": "<tr>\n" +
        "                <td class='device_name'>##name##</td>\n" +
        "                <td>##port##</td>\n" +
        "                <td id='clap_##id##'><div class='loading_value'></td>\n" +
        "                <td><input bind='clap_##id##' type='button' value='перейменувати' onclick='rename_value(this)'></td>\n" +
        "                <td><input bind='clap_##id##' type='button' value='видалити' onclick='delete_row(this)'></td>\n" +
        "            </tr>",
        "3way": " <tr>\n" +
        "                <td class='device_name'>##name##</td>\n" +
        "                <td>##port_1##</td>\n" +
        "                <td>##port_2##</td>\n" +
        "                <td id='3way_##id##'><div class='loading_value'></div></td>\n" +
        "                <td><input bind='3way_##id##' type='button' value='перейменувати' onclick='rename_value(this)'></td>\n" +
        "                <td><input bind='3way_##id##' type='button' value='видалити' onclick='delete_row(this)'></td>\n" +
        "            </tr>"
    };

    $.each(config, function (key, value) {
        var html_to_append = "";
        $.each(value, function (key_a, value_a) {
            console.log('----' + key + '----');
            console.log(key_a, value_a);
            var html = '';
            if (templates.hasOwnProperty(key)) {
                html = templates[key];
                html = html.split('##id##').join(key_a);
                $.each(value_a, function (key_b, value_b) {
                    console.log('replacing ##' + key_b + '## with ' + value_b);
                    html = html.split('##' + key_b + '##').join(value_b);
                });
            }
            html_to_append += html
        });

        $('#' + key).append(html_to_append);
    });

    load_values();
}


function store(url, data) {
    $.post(url, data).done(function (resp) {
        parsed_response = JSON.parse(resp);
        console.log('Data stored: ' + parsed_response);
    });
}

function add_row(elm) {
    if (!checkRequired(elm.closest('.new-row'))) {
        return false;
    }
    else {
        new_row_data = elm.closest('.new-row').find('input,select').serialize();
        store('/add_device', new_row_data);
    }
    reload();
}


function reload() {
    config = {};
    var tabUrl = $('.tab-link.current').attr('href');
    var tabId = $('.tab-link.current').attr('id');
    load_config();
    loadTabContent(tabUrl, tabId);
}

function sleepFor(sleepDuration) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) { /* do nothing */
    }
}


function fill_automation_config(config) {

    var template = "<option value='##item_name##'>##item_label##</option>";

    console.log('fill_automation_config: ', config);
    $.each(config, function (key, value) {
        console.log(key, value);

        $('.data_' + key).each(function (idx_0, el) {
            console.log(idx_0, el);
            $.each(value, function (idx, item) {
                var value_to_insert = template
                    .split('##item_name##').join(key + '_' + idx)
                    .split('##item_label##').join(item.name);
                $(el).append(value_to_insert);
            });
        });
    })


}
