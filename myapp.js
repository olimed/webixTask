var dataForList = ["Dashboard", "Users", "Products", "Locations"];
var dataFromFile;

var toolbar = {
    view: "toolbar", paddingY: 1, height: 50, elements: [
        { view: "label", label: "My App" },
        { view: "button", type: "icon", icon: "user", label: "Profile", width: 100, align: "right", popup: "popupForProfile" }
    ]
};

var listOnCol = {
    css: "backgroundList",
    rows: [
        {
            view: "list",
            id: "mylist",
            data: dataForList,
            autoheight: true,
            width: 300,
            scroll: false,
            select: true,
            on: {
                onAfterSelect: function (id) {
                    $$(id).show();
                }
            }
        },
        {},
        { css: "greenText", view: "label", label: "<span class='webix_icon fa-check'></span>Connected", align: "center" },

    ]

};

var datatableOnCol = {
    view: "datatable",
    id: "table",
    scrollX: false,
    select: "row",
    multiselect: true,
    hover: "mouseHover",
    url: "data/data.js",
    columns: [
        { id: "id", header: "", width: 40, sort: "int" },
        { id: "title", header: ["Film title", { content: "textFilter" }], fillspace: true, sort: "string" },
        { id: "year", header: ["Released", { content: "textFilter" }], sort: "int" },
        { id: "votes", header: ["Votes", { content: "textFilter" }], sort: "realNumbers" },
        { id: "rating", header: ["Rating", { content: "textFilter" }], sort: "realNumbers" },
        { id: "rank", header: ["Rank", { content: "textFilter" }], sort: "int" },
        { id: "delete", header: "Delete", template: "{common.trashIcon()}" }
    ],
    on: {
        onSelectChange: function () {
            var item = $$("table").getSelectedItem();
            $$("mainForm").setValues({
                title: item.title,
                year: item.year,
                votes: item.votes,
                rating: item.rating
            });
        },
    },
    onClick: {
        "fa-trash": function () {
            $$("table").remove($$("table").getSelectedId());
            return false;
        }
    },
};

var formOnCol = {
    view: "form",
    width: 300,
    id: "mainForm",
    elements: [
        { type: "section", template: "Edit film" },
        { view: "text", label: "Film title", name: "title", invalidMessage: "Enter title" },
        { view: "text", label: "Released", name: "year", invalidMessage: "Enter year between 1970 and current" },
        { view: "text", label: "Rating", name: "rating", invalidMessage: "Enter rating more than 0" },
        { view: "text", label: "Votes", name: "votes", invalidMessage: "Enter votes less than 100000" },

        {
            margin: 5, cols: [
                {
                    view: "button", label: "Submit", type: "form",
                    click: function () {
                        if ($$("table").getSelectedId()) {
                            var item = $$("mainForm").getValues();

                            for (let i in item) {
                                item[i] = checkReg(item[i]);
                            };
                            $$("table").updateItem($$("table").getSelectedId().row, item);
                        } else {
                            if ($$("mainForm").validate()) {
                                var item = $$("mainForm").getValues();

                                for (let i in item) {
                                    item[i] = checkReg(item[i]);
                                };
                                $$("table").add(item);
                                webix.message("Validation is successful");
                            }
                        }
                    }

                },
                {
                    view: "button", label: "Clear",
                    click: function () {
                        webix.confirm({
                            title: "Information",
                            text: "Clear form?",
                            callback: function (result) {
                                if (result == true) {
                                    $$("mainForm").clear();
                                    $$("mainForm").clearValidation();
                                }
                            }
                        });

                    }
                }
            ],
        },

        {}
    ],
    rules: {
        film_title: webix.rules.isNotEmpty,
        released: function (value) {
            return value >= 1970 && value <= 2018;
        },
        votes: function (value) {
            return value < 100000 && value > 0;
        },
        rating: function (value) {
            return value > 0;
        }
    }
};

var footer = {
    view: "template",
    height: 50,
    css: "textTemplate",
    template: "The software is provided by <a href=\"https://webix.com\" target=\"_blank\">https://webix.com</a>. All rights reserved (c)."
};

var usersList = {
    rows: [
        {
            cols:[
                { 
                    view: "text",
                    id: "textFilter",
                    placeholder:"Type to filter..", 
                    on:{
                        onTimedKeyPress:function () {
                            var item = this.getValue().toLowerCase();
                            $$("usersList").filter(function(obj){
                                return obj.name.toLowerCase().indexOf(item)==0;
                            })
                        }
                    }
                },
                {
                    view:"button",
                    id:"buttonSortAsc",
                    value:"Sort asc",
                    click:function () {
                        $$("usersList").sort("#name#");
                    }
                },
                {
                    view:"button",
                    id:"buttonSortDesc",
                    value:"Sort desc",
                    click:function () {
                        $$("usersList").sort("#name#", "desc");
                    }
                }
            ]
        },
        {
            view: "list",
            id: "usersList",
            template: "#id#. <strong>#name#</strong> from #country# <span class='webix_icon fa-trash'></span>",
            url: "data/users.js",
            select: true,
            scheme: {
                $init: function(obj){
                    if (obj.id <= 5){
                        obj.$css = "colorful";
                    };
                }
            },
            onClick: {
                "fa-trash": function(){
                    var id = $$("usersList").getSelectedId();
                    $$("usersList").remove(id);
                    webix.message("Delete" + id);
                    $$("usersChart").remove(id);
                    return false;

                }
            },
            on:{
                onAfterDelete:function () {
                    if (!this.count()){
                        webix.extend(this, webix.OverlayBox);
                        this.showOverlay("<div style='margin:75px; font-size:20px;'>There is no data</div>");
                    }
                }

            },
        }
    ]
};

var usersChart = {
    view: "chart",
    id: "usersChart",
    type: "bar",
    url: "data/users.js",
    value: "#age#",
    xAxis: {
        template: "#age#"
    }
};

var productsTree = {
    view: "treetable",
    id: "productsTree",
    select: true,
    url: "data/products.js",
    columns: [
        { id:"id", header:"", width:50},
        { id:"title", header:"Title", fillspace: true, template:"{common.treetable()} #title#" },
        { id:"price", header:"Price"}
    ],
    ready:function(){
        $$("productsTree").openAll();
    }
}

var cells = {
    cells: [
        { id: "Dashboard", cols: [datatableOnCol, formOnCol] },
        { id: "Users", rows: [usersList, usersChart] },
        { id: "Products", cols: [ productsTree] },
        { id: "Locations", template: "Locations view" }
    ]
};

var main = { cols: [listOnCol, { view: "resizer" }, cells] };

webix.ui({
    view: "popup",
    id: "popupForProfile",
    width: 300,
    body: {
        view: "list",
        data: ["Settings", "Log out"],
        autoheight: true,
        select: true
    }
});

var winMess = webix.ui({
    view: "window",
    id: "windowMess",
    height: 100,
    width: 300,
    position: "center",
    move: true,
    head: {
        view: "toolbar", cols: [
            { view: "label", label: "Information" },
            { view: "button", label: 'Close', width: 100, align: 'right', click: "$$('windowMess').close();" }
        ]
    },
    body: { view: "label", label: "Clear form?", align: "center" }
});


webix.ui({
    rows: [toolbar, main, footer]
});

$$("mylist").select("Dashboard");

function checkReg(str) {
    str = str.replace(/(<([^>]+)>)/ig, "");
    return str
};

webix.DataStore.prototype.sorting.as.realNumbers =
    function (a, b) {
        return parseFloat(a) > parseFloat(b) ? 1 : -1
    };