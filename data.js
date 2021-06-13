
class ListGizmo extends Blueprint {
    constructor(){
        super("List")
        
        this.items = []
        //this.notifiers = {"": new Notifier(this)}

        this.outputNotifier = new Notifier(this);
        this.completedHook = this.getHook(this.outputNotifier, "output");
        this.heading.append(this.completedHook.css({
            "float": "right",
            "margin": "5px",
            "marginBottom": "0px"
        }))
        
        this.appendBox = $("<input/>").addClass("listInput").attr({
            "type": "text",
            "placeholder": "Add list item"
        })

        this.appendDiv = $("<div/>").addClass("listDiv")
        
        this.appendButton = $("<span/>").append($("<i/>").addClass("fas fa-plus"))


        this.itemDiv = $("<div/>")
        //$(this).append($("<hr>").css({padding:0, margin: 0}))

        $(this).append($("<br/>"))
       

        this.appendDiv.append(this.appendButton);
        this.appendDiv.append(this.appendBox);

        $(this).append(this.itemDiv)
        $(this).append(this.appendDiv)


        this.appendBox.change((e)=>{
            this.addItem($(e.target).val())
            $(e.target).val("")
            
        });
    }

    addItem(item){
        this.itemDiv.css("display", "block")
        this.itemDiv.append($("<div/>").html(`<b>${this.items.length}</b>: ${item}`).addClass("listItemDiv"))
        this.items.push(item)
        //this.getNotiferInputField(notiferKey, notifierCopy)
    }


}


class FunctionGizmo extends Blueprint {
    constructor(name, func = null, noteifierTypes){
        super(" "+name)


        this.func.inputTypes = {}
        func = this.func;

        this.notifiers = { }
        
        let params = getParamNames(this.func);
        for(let param of params){
            let notifierType = (noteifierTypes[param] !== undefined) ? noteifierTypes[param] : StringNotifier;  
            this.notifiers[param] = new notifierType("");
        }

        this.hookNotifiers(this.notifiers, (key, notifier)=>{
            notifier.isDeferred = true;
        });

        this.exec = () => {
            let args = []
            for(let param of params){
                args.push(this.notifiers[param].get())
            }
           // this.outputNotifier.set(this.func(...args))
            return this.func(...args)
        }

        this.execNotifier = new ExecutionNotifier(this.exec);
        
        this.execHook = this.getHook(this.execNotifier, "input");

        this.heading.prepend(this.execHook)
        //this.exec.bind(this);

        this.outputNotifier = new ReturnNotifier("", this.exec);




        this.outputNotifier.isRuntime = true;
       // this.outputNotifier.isDeferred = true;

        this.outputHook = this.getHook(this.outputNotifier, "output");
        this.heading.append(this.outputHook.css({
            "float": "right",
            "margin": "5px",
            "marginBottom": "0px"
        }))

       

        //console.log()
    }

    func(){


    }

}

class GetListItem extends FunctionGizmo{
    
    constructor(){
        super("Get List Item", null, {
            list: SelfNotifier
        })

    }

  
    func(list, index){
       // console.log("here?", list.items[index])
        return list.items[index];

    }

    

}



class Clone extends FunctionGizmo{
    
    constructor(){
        super("Clone", null, {
            gizmo: SelfNotifier
        })

    }

  
    func(gizmo){
        
        return gizmo.cloneNode(true);

    }

    

}