var dataForList = [{"title": "Dashboard"}, {"title": "Users"}, {"title": "Products"}, {"title": "Locations"}];

var toolbar = { view:"toolbar", paddingY:1, height:50, elements:[
    { view:"label", label:"My App" },
    { view:"button", type:"icon", icon:"user", label:"Profile", width: 100, align:"right", popup: "popupForProfile"}
  ]};
  
var listOnCol = {
    css:"backgroundList",
    rows:[
        {
            view: "list",
            template: "#title#",
            data: dataForList,
            autoheight: true,
            width: 300,
            scroll: false
        },
        { },
        {css: "greenText", view: "label", label: "<span class='webix_icon fa-check'></span>Connected", align: "center"},
        
    ]
    
};

var datatableOnCol = {
    view: "datatable",
    id: "inputData",
    scrollX: false,
    data: small_film_set,
    columns: [
        {id: "title",  header: "Title", fillspace:true},
        {id: "year",   header: "Year" },
        {id: "votes",  header: "Votes"},
        {id: "rating", header: "Rating"},
        {id: "rank",   header: "Rank"}
    ]};            

var formOnCol = {
    view: "form",
    width: 300,
    id: "mainForm",
  	elements:[
        { type:"section", template:"Edit film" },
        { view:"text", label:"Title", name:"title", invalidMessage:"Enter title"},
        { view:"text", label:"Year", name:"year", invalidMessage:"Enter year between 1970 and current"},
        { view:"text", label:"Rating", name:"rating", invalidMessage:"Enter rating more than 0"},
        { view:"text", label:"Votes", name:"votes", invalidMessage:"Enter votes less than 100000"},
        
        { margin:5, cols:[
            { view:"button", label:"Add new", type: "form", 
                click:function(){
                    if ($$("mainForm").validate()){                        
                        var item = $$("mainForm").getValues();
                        
                        for (let i in item){
                            if (item.hasOwnProperty(i)){
                                item[i] = checkReg(item[i]);
                            }
                        }
                        $$("inputData").add(item);
                        webix.message("Validation is successful");
                        
                    }
                }
        
            },
            { view:"button", label:"Clear", 
            click:function(){
                $$("mainForm").clearValidation();
                    webix.confirm({
                        title:"Information",
                        text:"Clear form?",
                        callback: function(result){
                            if (result == true){
                                $$("mainForm").clear();
                            }
                        }
                  });

            }}
        ],},
        { }
      ],
      rules:{
        title: webix.rules.isNotEmpty,
        year: function(value){
            return value >= 1970 && value <= 2018;
        },
        votes: function(value){
            return value < 10000 && value > 0;
        },
        rating: function(value){ 
            return value > 0;
        }
    }           
};

var footer = {
    view: "template", 
    height: 50,
    css:"textTemplate", 
    template: "The software is provided by <a href=\"https://webix.com\" target=\"_blank\">https://webix.com</a>. All rights reserved (c)."
}

var main = {cols: [ listOnCol, { view: "resizer"}, datatableOnCol, formOnCol]}

webix.ui({
    view: "popup",
    id: "popupForProfile",
    head: "Submenu",
    width: 300,
    body: {
        view: "list",
        data: [ "Settings", "Log out"],
        autoheight:true,
		select:true
    },
});

var winMess = webix.ui({
    view:"window",
    id:"windowMess",
    height:100,
    width:300,
    position:"center",
    move:true,
    head:{
        view:"toolbar", cols:[
          {view:"label", label: "Information" },
          { view:"button", label: 'Close', width: 100, align: 'right', click:"$$('windowMess').close();"}
        ]
      }
      ,
      body: {view:"label", label: "Clear form?", align: "center" }
});


webix.ui({
    rows: [toolbar, main, footer]
});


function checkReg(str){
    str = str.replace(/<|>/g, "");
    return str
}
    
