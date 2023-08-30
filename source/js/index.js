const urlserver = 'http://localhost:3000' //'https://iotlsmonitor.onrender.com'  // //https://iotserver-zthy.onrender.com

var payments = {
    1: 'Credit Card',
    2: 'Check',
    3: 'PayPal',
    4: 'Bank-wire'
};

var statuses = {
    1: ['Pre-order', 'bg-pink fg-white'],
    2: ['Payed', 'bg-green fg-white'],
    3: ['Payment Error', 'bg-red fg-white'],
    4: ['Delivered', 'bg-teal fg-white'],
    5: ['Preparing', 'bg-yellow'],
    6: ['Awaiting payment', 'bg-cyan fg-white'],
    7: ['Shipped', 'bg-lightGreen fg-white']
};

var shippingPanelButtons = [
    {
        html: "<span class='mif-cog'>",
        cls: "bg-transparent",
        onclick: "alert('You press shipping cog button')"
    }
];
var billingPanelButtons = [
    {
        html: "<span class='mif-cog'>",
        cls: "bg-transparent",
        onclick: "alert('You press billing cog button')"
    }
];
var customerPanelButtons = [
    {
        html: "<span class='mif-cog'>",
        cls: "bg-transparent",
        onclick: "alert('You press customer cog button')"
    }
];

$(function () {
    var hash = location.hash;
    var target = hash.length > 0 ? hash.substr(1) : "dashboard";
    var link = $(".navview-menu a[href*=" + target + "]");
    var menu = link.closest("ul[data-role=dropdown]");
    var node = link.parent("li").addClass("active");

    function getContent(target) {
        window.on_page_functions = [];
        $.get(target + ".html").then(
            function (response) {
                $("#content-wrapper").html(response);

                window.on_page_functions.forEach(function (func) {
                    Metro.utils.exec(func, []);
                });
            }
        );
    }

    getContent(target);

    if (menu.length > 0) {
        Metro.getPlugin(menu, "dropdown").open();
    }

    $(".navview-menu").on(Metro.events.click, "a", function (e) {
        var href = $(this).attr("href");
        var pane = $(this).closest(".navview-pane");
        var hash;

        if (Metro.utils.isValue(href) && href.indexOf(".html") > -1) {
            document.location.href = href;
            return false;
        }

        if (href === "#") {
            return false;
        }

        hash = href.substr(1);
        href = hash + ".html";

        getContent(hash);

        if (pane.hasClass("open")) {
            pane.removeClass("open");
        }

        pane.find("li").removeClass("active");
        $(this).closest("li").addClass("active");

        window.history.pushState(href, href, "index.html#" + hash);

        return false;
    });

    function updateOrderStatus() {
        var val = $("#sel-statuses").val();
        var table = $("#table-order-statuses").find("tbody");
        var tr, td;

        tr = $("<tr>");
        td = $("<code>").addClass(statuses[val][1]).html(statuses[val][0]);

        $("<td>").html(td).appendTo(tr);
        $("<td>").addClass("text-right").html("" + (new Date()).format("%m/%d/%Y %H:%M")).appendTo(tr);

        table.prepend(tr);
    }
});

function getCompanyList() {
    $.ajax({
        url: urlserver + '/get-company',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            const data = response.reduce((result, item) => {
                result[item.id] = item.id + ' - ' + item.name;
                return result;
            }, {});
            var select = Metro.getPlugin("#ddl-company", 'select');
            select.data(data);
            $(select).trigger('change');
        },
        error: function (error) {
            console.error('Erro ao carregar branches:', error);
        }
    });
}

function getBranchList(pIdCompany) {
    $.ajax({
        url: urlserver + '/get-branch?idcompany=' + pIdCompany,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            const data = response.reduce((result, item) => {
                result[item.id] = item.id + ' - ' + item.name;
                return result;
            }, {});
            var select = Metro.getPlugin("#ddl-branch", 'select');
            select.data(data);
            $(select).trigger('change');
        },
        error: function (error) {
            console.error('Erro ao carregar branches:', error);
        }
    });
}

function getDepartmentList(pIdBranch) {
    $.ajax({
        url: urlserver + '/get-department?idbranch=' + pIdBranch,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            
            const data = response.reduce((result, item) => {
                result[item.id] = item.id + ' - ' + item.name;
                return result;
            }, {});
            var select = Metro.getPlugin("#ddl-department", 'select');
            select.data(data);
            $(select).trigger('change');
        },
        error: function (xhr, status, error) {
            console.error('Erro ao buscar dados:', error);
        }
    });
}

function getPanelList(pIdDepartment) {
    $.ajax({
        url: urlserver + '/get-panel?iddepartment=' + pIdDepartment,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            var select = Metro.getPlugin("#ddl-panel", 'select');
            select.reset();
            const data = response.reduce((result, item) => {
                result[item.id] = item.id + ' - ' + item.name;
                return result;
            }, {});
            select.data(data);
            $(select).trigger('change');
        },
        error: function (xhr, status, error) {
            console.error('Erro ao buscar dados:', error);
        }, complete: function() {
            $("#ddl-panel").trigger('change');
        }
    });
}

function getSensorList() {
    $.ajax({
        url: urlserver + '/get-sensor',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            const data = response.reduce((result, item) => {
                result[item.id] = item.id + ' - ' + item.name;
                return result;
            }, {});
            var select = Metro.getPlugin("#ddl-sensor", 'select');
            select.data(data);
            $(select).trigger('change');
        },
        error: function (xhr, status, error) {
            console.error('Erro ao buscar dados:', error);
        }
    });
}

function getSenderList() {
    $.ajax({
        url: urlserver + '/get-sender',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            const data = response.reduce((result, item) => {
                result[item.id] = item.id + ' - ' + item.name;
                return result;
            }, {});
            var select = Metro.getPlugin("#ddl-sender", 'select');
            select.data(data);
            $(select).trigger('change');
        },
        error: function (xhr, status, error) {
            console.error('Erro ao buscar dados:', error);
        }
    });
}

function getSensorTypeList() {
    $.ajax({
        url: urlserver + '/get-sensortype',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var $ddlSensorType = $('#ddl-sensortype');
            $.each(data, function (index, option) {
                $ddlSensorType.append($('<option>', {
                    value: option.id,
                    text: option.id + ' - ' + option.name
                }));
            });
            $ddlSensorType.data('select').reset();
            $('#ddl-sensortype').trigger('change');
        },
        error: function (xhr, status, error) {
            console.error('Erro ao buscar dados:', error);
        }
    });
}

function openDemoDialogActions(){
    Metro.dialog.create({
        title: "Falia na salvação!",
        content: "<div>Preencha os campos direito, ASNO.</div>",
        actions: [
            {
                caption: "Agree",
                cls: "js-dialog-close alert",

            }
        ]
    });
}