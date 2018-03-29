var dataForList = [{"title": "Dashboard"}, {"title": "Users"}, {"title": "Products"}, {"title": "Locations"}];

var toolbar = { view:"toolbar", paddingY:1, height:50, elements:[
    { view:"label", label:"My App" },
    { view:"button", type:"icon", icon:"user", label:"Profile", width: 100, align:"right"}
  ]};
  
var listOnCol = {
    rows:[
        {
            view: "list",
            template: "#title#",
            data: dataForList,
            autoheight: true,
            width: 300,
            scroll: false,
            css: "backgroundList"
        },
        {css:"backgroundList" },
        {css: "greenText backgroundList", view: "label", label: "<span class='webix_icon fa-check'></span>Connected", align: "center"},
        
    ]
    
};

var datatableOnCol = {
    view: "datatable",
    scrollX: false,
    autoConfig:true,
    data: small_film_set,
    columns: [
        {id: "title",  header: "Title", fillspace:true},
        {id: "year",   header: "Year" },
        {id: "votes",  header: "Votes"},
        {id: "rating", header: "Rating"},
        {id: "rank",   header: "Rank"}
    ]};            

var formOnCol = {
    view:"form", scroll:false,
      width:300,
      
  	elements:[
        { type:"section", template:"EDIT FILM" },
        { view:"text", label:"Title"},
        { view:"text", label:"Year"},
        { view:"text", label:"Rating"},
        { view:"text", label:"Votes"},
        
        { margin:5, cols:[
            { view:"button", label:"Add new", css:"greenButton"},
            { view:"button", label:"Clear"}
        ]},
        { }
  	]           
};

var footer = {
    view: "template", 
    height: 40,
    css:"textTemplate", 
    template: "The software is provided by <a href=\"https://webix.com\">https://webix.com</a>. All rights reserved (c)."
}

var main = {cols: [ listOnCol, { view: "resizer"}, datatableOnCol, formOnCol]}

webix.ui({
    rows: [toolbar, main, footer]
});
