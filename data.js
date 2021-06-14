
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
        this.hookResults = {}
        this.ready = false

        let params = getParamNames(this.func);
        for(let param of params){
            let notifierType = (noteifierTypes[param] !== undefined) ? noteifierTypes[param] : StringNotifier;  
            this.notifiers[param] = new notifierType("");
        }

        this.hookNotifiers(this.notifiers, (key, notifier)=>{
            notifier.isDeferred = true;
            notifier.onUpdate((result)=>{
                //console.log("foewk")
                if(result!==undefined && result!==null){
                    this.hookResults[key] = result;
                    console.log(Object.keys(this.hookResults).length,"vs",Object.keys(this.notifiers).length)

                    if(Object.keys(this.hookResults).length==Object.keys(this.notifiers).length){
                        //console.log("ofpwke")
                        this.onReady();
                        
                    }
                }
                
            });
        });

        this.exec = () => {
            if(!this.ready){
                console.log("NOT READY")
                return null
            }
            let args = []
            for(let param of params){
                let note = this.notifiers[param]
                
            
                args.push(note.get())
            }
            
            return this.func(...args)
        }

    

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

    onReady(){
        this.ready = true
    }

}

class GetListItem extends FunctionGizmo{
    
    constructor(){
        super("Get List Item", null, {
            list: SelfNotifier,
        })

    }

  
    func(list, index){
       // console.log("here?", list.items[index]) 
        //return list.items[index];
        return "works...!"
    }

    

}



class Clone extends FunctionGizmo{
    
    constructor(){
        super("Clone", null, {
            gizmo: SelfNotifier
        })

    }

  
    func(gizmo){
        console.log(gizmo)
        let clone = gizmo.cloneNode(true);
        //clone.style.opacity = 0.5;
        //gizmo.parent.addGizmo(clone)

        return clone;
        //

    }

    

}