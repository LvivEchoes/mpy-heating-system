var idx_rule = 0;
var idx_action = 0;


$(document).ready(function () {

    $(".loader").hide();
    $(".tab-link").click(function () {

        tabId = $(this).attr("id");
        tabUrl = $(this).attr("href");

        $(".tab-link").removeClass("current");
        $(this).addClass("current");

        loadTabContent(tabUrl);
        return false;
    });

});


function loadTabContent(tabUrl) {
    $(".loader").show();
    $(".tab-content").hide();
    jQuery.ajax({
        url: tabUrl,
        cache: false,
        success: function (message) {
            $("#tabcontent").empty().append(message);
            $(".loader").hide();
            $(".tab-content").show();
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


function checkRequired(form) {


    if (form.find('[required]').filter(function () {
            $(this).css('border-color', 'red');
            return this.value === ''


        }).length > 0) {
        alert("Деякі поля обов'язкові до заповення.");
        return false;
    }
    return true;
}

$(document).ready(function () {
    $('#new_automation').on('submit', checkRequired);
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
