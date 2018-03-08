var idx_rule = 0;
var idx_action = 0;
var config = {};
var values = {};

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
    $(".loader").show();
    $(".tab-content").hide();
    jQuery.ajax({
        url: tabUrl,
        cache: false,
        success: function (message) {
            $("#tabcontent").empty().append(message);
            $(".loader").hide();
            $(".tab-content").show();

            if (tabId === 'tab-2') {
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
        }
    });
}

function show_rule(rule, i) {
    var rules = document.getElementsByClassName('rule-' + i);
    for (var index = 0; index < rules.length; index++) {
        rules[index].style.display = 'none'
    }
    document.getElementById(rule).style.display = 'block';
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
            $(this).css('border-color', 'red');
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
    console.log('Renaming: ', elm.id)

}

function delete_row(elm) {
    console.log('Deleting: ', elm.id)

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
    })
}


function fill_config(config) {

    var templates = {
        "temp": " <tr id='##id##' class='row'>\n" +
        "                <td>##name##</td>\n" +
        "                <td>##address##</td>\n" +
        "                <td id='temp_##id##'><div class='loading_value'></td>\n" +
        "                <td><input id='yard' type='button' value='перейменувати' onclick='rename_value(this)'></td>\n" +
        "                <td><input id='yard' type='button' value='видалити' onclick='delete_row(this)'></td>\n" +
        "            </tr>\n",
        "pomp": "            <tr>\n" +
        "                <td>##name##</td>\n" +
        "                <td>##port##</td>\n" +
        "                <td id='pomp_##id##'><div class='loading_value'></td>\n" +
        "                <td><input id='yard' type='button' value='перейменувати' onclick='rename_value(this)'></td>\n" +
        "                <td><input id='yard' type='button' value='видалити' onclick='delete_row(this)'></td>\n" +
        "            </tr>\n",
        "clap": "<tr>\n" +
        "                <td>##name##</td>\n" +
        "                <td>##port##</td>\n" +
        "                <td id='clap_##id##'><div class='loading_value'></td>\n" +
        "                <td><input id='yard' type='button' value='перейменувати' onclick='rename_value(this)'></td>\n" +
        "                <td><input id='yard' type='button' value='видалити' onclick='delete_row(this)'></td>\n" +
        "            </tr>",
        "3way": " <tr>\n" +
        "                <td>##name##</td>\n" +
        "                <td>##port_1##</td>\n" +
        "                <td>##port_2##</td>\n" +
        "                <td id='3way_##id##'><div class='loading_value'></div></td>\n" +
        "                <td><input id='yard' type='button' value='перейменувати' onclick='rename_value(this)'></td>\n" +
        "                <td><input id='yard' type='button' value='видалити' onclick='delete_row(this)'></td>\n" +
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

function add_row(elm) {
    if (!checkRequired(elm.closest('.new-row'))) {
        return false;
    }
    else {
        new_row_data = elm.closest('.new-row').find('input').serialize();
        console.log(new_row_data);
        // request_here


    }
}
