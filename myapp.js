var dataForList = ["Dashboard", "Users", "Products", "Locations"];
var options = "data/categories.js";

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

var tabbar = {
    view: "tabbar", id: "datatableTabbar",value:"table",  multiview: true, options: [
        { id: "table", value: "All"},
        { id: "tableOld", value: "Old"},
        { id: "tableModern", value: "Modern" },
        { id: "tableNew", value: "New" }
    ],
};


var datatableOnCol = {
    cells: [
            {view: "datatable",
            id: "table",
            scrollX: false,
            select: "row",
            multiselect: true,
            hover: "mouseHover",
            url: "data/data.js",
            editable: true,
            columns: [
                { id: "id", header: "", width: 40, sort: "int" },
                { id: "title", header: ["Film title", { content: "textFilter" }], fillspace: true, sort: "string" },
                { id: "categoryId", header: "Category", editor: "select", collection: options },
                { id: "year", header: ["Released", { content: "textFilter" }], sort: "int" },
                { id: "votes", header: ["Votes", { content: "textFilter" }], sort: "realNumbers" },
                { id: "rating", header: ["Rating", { content: "textFilter" }], sort: "realNumbers" },
                { id: "rank", header: ["Rank", { content: "textFilter" }], sort: "int" },
                { id: "delete", header: "Delete", template: "{common.trashIcon()}" }
            ],
            /*on: {
                onSelectChange: function () {
                    var item = $$("table").getSelectedItem();
                    $$("mainForm").setValues(item);
                },
            },*/
            onClick: {
                "fa-trash": function () {
                    $$("table").remove($$("table").getSelectedId());
                    return false;
                }
            },
            scheme: {
                $init: function (obj) {
                    obj.categoryId = Math.floor((Math.random() * 100) % 4) + 1;

                }
            }},
            {
                view: "datatable",
                id: "tableOld"
            },
            {},
            {}
        ]
};

/*$$('table').bind($$('tableOld'), function(obj){
    return obj.year == 1970
});*/

/*$$("table").filterByAll=function(){
    //get filter values
    var old = this.getFilter("year").value;
    var modern = this.getFilter("year").value;
    //unfilter if values were not selected
    if (!title	&& !year) return this.filter();
    //filter using OR logic
    this.filter(function(obj){
        if (year !== "" && obj.year == year) return true;
        if (title !== "" && obj.title.toLowerCase().indexOf(title)!=-1) return true;
        return false;
    });
};*/


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
            margin: 5, rows: [
                {
                    cols: [
                        {
                            view: "button", label: "Submit", type: "form", click:
                                function () {
                                    var form = $$('mainForm');
                                    if (form.isDirty()) {
                                        if (!form.validate())
                                            return false;
                                        form.save();
                                    } else {
                                        webix.message("Form is empty!");
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
                {
                    view: "button", label: "Unselect",
                    click: function () {
                        $$("table").unselectAll();
                    }
                }
            ]
        },

        {}
    ],
    rules: {
        title: webix.rules.isNotEmpty,
        year: function (value) {
            return value >= 1970 && value <= 2018;
        },
        votes: function (value) {
            return parseFloat(value) < 100000 && parseFloat(value) > 0;
        },
        rating: function (value) {
            return parseFloat(value) > 0;
        }
    }
};

var footer = {
    view: "template",
    height: 50,
    css: "textTemplate",
    template: "The software is provided by <a href=\"https://webix.com\" target=\"_blank\">https://webix.com</a>. All rights reserved (c)."
};

webix.protoUI({
    name: "editlist"
}, webix.EditAbility, webix.ui.list);

var editList = {

    view: "editlist",
    id: "usersList",
    template: "#id#. <strong>#name#</strong> from #country# <span class='webix_icon fa-trash'></span>",
    url: "data/users.js",
    select: true,
    editable: true,
    editor: "text",
    editValue: "name",
    editaction: "click",
    scheme: {
        $init: function (obj) {
            if (obj.age < 26) {
                obj.$css = "yellowBg";
            }
        }
    },
    onClick: {
        "fa-trash": function () {
            var id = this.getSelectedId();
            $$("usersList").remove(id);
            webix.message("Delete" + id);
            $$("usersChart").remove(id);
            return false;
        }
    },
    on: {
        onAfterDelete: function () {
            if (!this.count()) {
                webix.extend(this, webix.OverlayBox);
                this.showOverlay("<div style='margin:75px; font-size:20px;'>There is no data</div>");
            }
        }

    },
    rules: {
        name: webix.rules.isNotEmpty,
    }

}

var usersTabbar = {
    cols: [
        {
            view: "text",
            id: "textFilter",
            placeholder: "Type to filter..",
            on: {
                onTimedKeyPress: function () {
                    var item = this.getValue().toLowerCase();
                    $$("usersList").filter(function (obj) {
                        return obj.name.toLowerCase().indexOf(item) == 0;
                    })
                }
            }
        },
        {
            view: "button",
            id: "buttonSortAsc",
            value: "Sort asc",
            click: function () {
                $$("usersList").sort("#name#");
            }
        },
        {
            view: "button",
            id: "buttonSortDesc",
            value: "Sort desc",
            click: function () {
                $$("usersList").sort("#name#", "desc");
            }
        },
        {
            view: "button",
            id: "addUser",
            value: "Add user",
            collection: "data/countries.js",
            click:function () {
                var country = collection[Math.floor(Math.random() * 10 % 8 + 1)].value;
                var age = Math.floor(Math.random() * 100 % 60 + 1);
                var id = $$("usersList").getLastId();
                while($$("usersList").exists(id))
                    id++;
                $$("usersList").add({id:id, name:"Change this field!", age:age, country:country});

            }
        }
    ]
}

var usersChart = {
    view: "chart",
    id: "usersChart",
    type: "bar",
    url: "data/users.js",
    value: "#age#",
    xAxis: {
        template: "#country#"
    },
    yAxis: {
        start: 0,
        end: 10,
        step: 2,
    },
    ready: function () {
        $$("usersChart").group({
            by: "country",
            map: {
                age: ["age", "count"]
            }
        });

    }

};

var usersList = {
    rows: [usersTabbar, editList]
};

var productsTree = {
    view: "treetable",
    id: "productsTree",
    select: true,
    url: "data/products.js",
    select: true,
    editable: true,
    editaction: "dblclick",
    columns: [
        { id: "id", header: "", width: 50 },
        { id: "title", header: "Title", fillspace: true, template: "{common.treetable()} #title#", editor: "text" },
        { id: "price", header: "Price", editor: "text" }
    ],
    ready: function () {
        $$("productsTree").openAll();
    },
    rules: {
        title: webix.rules.isNotEmpty,
        price: function (value) {
            return (value == null || value > 0);
        }
    },
    on: {
        onAfterEditStop: function (state, editor, ignoreUpdate) {
            if (state.value != state.old) {
                $$("table").validateEditor();
            }
        }
    }


}

var cells = {
    cells: [
        { id: "Dashboard", cols: [{ rows: [tabbar, datatableOnCol] }, formOnCol] },
        { id: "Users", rows: [usersList, usersChart] },
        { id: "Products", cols: [productsTree] },
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

$$("mylist").select("Dashboards");
$$('mainForm').bind($$('table'));
$$("usersChart").data.sync($$("usersList"));

function checkReg(str) {
    str = str.replace(/(<([^>]+)>)/ig, "");
    return str
};

webix.DataStore.prototype.sorting.as.realNumbers =
    function (a, b) {
        return parseFloat(a) > parseFloat(b) ? 1 : -1
};
