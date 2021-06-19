
class ListGizmo extends Blueprint {
    constructor(items=[]){
        super("List")
        
        this.items = []
      
   
        this.appendBox = $("<input/>").addClass("listInput").attr({
            "type": "text",
            "placeholder": "Add list item"
        })
        this.heading.addClass("dataHeading")
        this.appendDiv = $("<div/>").addClass("listDiv")
        
        this.appendButton = $("<span/>").append($("<i/>").addClass("fas fa-plus"))


        this.itemDiv = $("<div/>")
        //$(this).append($("<hr>").css({padding:0, margin: 0}))

//        $(this).append($("<br/>"))
       

        this.appendDiv.append(this.appendButton);
        this.appendDiv.append(this.appendBox);

        $(this).append(this.itemDiv)
        $(this).append(this.appendDiv)


        this.appendBox.change((e)=>{
            this.addItem($(e.target).val())
            $(e.target).val("")
            
        });
        if(items.length > 0){
            for(let item of items){
                this.addItem(item);
            }
        }
    }

    getHookOutput(){
        this.outputNotifier = new Notifier(this);
        this.completedHook = this.getHook(this.outputNotifier, "output");
        this.heading.append(this.completedHook.css({
            "float": "right",
            "margin": "5px",
            "marginBottom": "0px"
        }))
    }

    addItem(item){
        this.itemDiv.css("display", "block")
        this.itemDiv.append($("<div/>").html(`<b>${this.items.length}</b>: ${item}`).addClass("listItemDiv"))
        this.items.push(item)
        //this.getNotiferInputField(notiferKey, notifierCopy)
    }


}

/*
class FunctionGizmo extends Blueprint {
    constructor(name, func = null, noteifierTypes){
        super(" "+name)


        this.func.inputTypes = {}
        func = this.func;

        this.notifiers = { }
        this.hookResults = {}
        this.ready = false

        let params = getParamNames(this.func);
        for(let param of params){
            let notifierType = (noteifierTypes[param] !== undefined) ? noteifierTypes[param] : StringNotifier;  
            this.notifiers[param] = new notifierType("");
        }

        this.hookNotifiers(this.notifiers, (key, notifier)=>{
            //notifier.isDeferred = true;
            notifier.onUpdate((result)=>{
                //console.log("foewk")
                if(result!==undefined && result!==null ){
                    this.hookResults[key] = result;
                    //console.log(Object.keys(this.hookResults).length,"vs",Object.keys(this.notifiers).length)

                    if(Object.keys(this.hookResults).length==Object.keys(this.notifiers).length){
                        //console.log("ofpwke")
                        if(this.ready && result=="" && notifier instanceof SelfNotifier){
                            this.outputNotifier.set(this.outputNotifier);
                        }
                        this.onReady();
                        //if()
                    }
                }
                
            });
        });

        this.exec = () => {
            if(!this.ready){
                //console.log("NOT READY")
                return null
            }
            let args = []
            for(let param of params){
                let note = this.notifiers[param]
                
            
                args.push(note.get())
            }
            
            return this.func(...args)
        }

    

        this.outputNotifier = new ReturnNotifier( this.exec);




        this.outputNotifier.isRuntime = true;
       // this.outputNotifier.isDeferred = true;

        this.outputHook = this.getHook(this.outputNotifier, "output");
        //console.log(this.outputHook)
   
        this.outputHook.notifier.setHooks(null, this.outputHook)
        //console.log(this.outputHook.outputHook)
        this.heading.append(this.outputHook.css({
            "float": "right",
            "margin": "5px",
            "marginBottom": "0px"
        }))

       

        //console.log()
    }

    func(){


    }

    onReady(){
        console.log("IM READY")
        this.ready = true
        //console.log("EXEC", this.outputNotifier.exec())
      //  setTimeout(()=>{
        console.log("EXEC", this.outputNotifier.exec())
        this.outputNotifier.set(this.outputNotifier);
       // },100)
        
        //this.outputNotifier.set("dopskop");
    }

}*/


class NumberGizmo extends Blueprint {

   
   // static catagory = "data";

    constructor(){
        super("Number");
        this.notifiers = this.getNotifiers()
        this.heading.addClass("dataHeading");
        
        this.hookNotifiers(this.notifiers )
        
       // console.log(this.notifiers)
        //$(this).append(this.getNotiferInputField("number", this.notifiers.number))
        //this.notifiers.number.isDeferred = false;
    }

    getNotifiers(){
        return {
            "number":  new StringNotifier(0, false)
        }
    }

    static getMenuName(){
        return "Number"
    } 

    static getCatagory(){
        return "data";
    }

}
editor.addToMenu(NumberGizmo);

//console.log(NumberGizmo.prototype instanceof Blueprint);

//editor.menuItems.push({name: "Number", gizmo: NumberGizmo , catagory: "data"})