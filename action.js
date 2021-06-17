class ActionGizmo extends Blueprint{

    constructor(name){
        super(" "+name);
        

        this.notifiers = this.getNotifiers()
        this.hookNotifiers(this.notifiers, (key, notifier)=>{
            //notifier.blueprint = this;
            if(!(notifier instanceof ActionNotifier)){
                notifier.isDeferred = true;
            }
        });
 
       
        this.heading.prepend(this.execHook)
        //this.exec.bind(this);

        
     
        $(this).dblclick(()=>{
            this.exec();
        })
    }

    getHookInput(){
        this.exec = ()=>{
            let result = this.onExec()
            //console.log(this.completedNotifier)
            if(result!=false)this.completedNotifier.exec()
        }
        this.execNotifier = new ExecutionNotifier(this.exec);
        
        this.execHook = this.getHook(this.execNotifier, "input");
        return this.execHook;
    }

    getHookOutput(){
        this.completedNotifier = new ActionNotifier()
        this.completedHook = this.getHook(this.completedNotifier, "output");
        return this.completedHook;
    }


    getNotifiers(){
        
    }

}

class FunctionAction extends ActionGizmo{

    constructor(name){
        super(name);
        this.resultNotifier = new SelfNotifier(null);
        this.resultNotifier.isDeferred=true;
        this.resultNotifier.hasOutput = ()=>true;
        this.resultNotifier.hasInput = ()=>false;
        this.resultField = this.getNotiferInputField("Result",  this.resultNotifier);

        //this.resultHoo
        $(this).append($("<hr>").css({padding:0, margin: 0}))
      //  console.log(this.resultHook)
        $(this).append(this.resultField);


        //this.resultHook.setHooks(null, this.resultHook)
    }

    

}


class Clone extends FunctionAction{

    constructor(){
        super("Clone");
       
    }

    getNotifiers(){
        return {
            "gizmo" : new SelfNotifier()
        }
    }

    onExec(){
        let gizmo = this.notifiers.gizmo.get();
        let clone = gizmo.cloneNode(true);
     
        this.resultNotifier.set(clone);
        this.resultNotifier.updateField(clone);
    }

}


class GetListItem extends FunctionAction{

    constructor(){
        super("Clone");
       
    }

    getNotifiers(){
        return {
            "list" : new SelfNotifier(),
            "index" : new StringNotifier("")
        }
    }

    onExec(){
        let x = this.notifiers.list.get().items[this.notifiers.index.get()];
      
        this.resultNotifier.set(x);
        this.resultNotifier.updateField(x);
    }

}



class PopupGizmo extends ActionGizmo{

    constructor(){
        super("Popup")
        
    }

    onExec(){
        alert(this.notifiers.message.get())
    }

    getNotifiers(){
        return {
            message: new StringNotifier("Hello World!")
        }
    }

}

class LogGizmo extends ActionGizmo{

    constructor(){
        super("Log")
    }

    onExec(){
        console.log(this.notifiers.message.get())
    }

    getNotifiers(){
        return {
            message: new StringNotifier("Hello World!")
        }
    }

}



class RenderGizmo extends ActionGizmo{

    constructor(){
        super("Show Gizmo")
        this.notifiers.to.onUpdate((result)=>{
           
            this.to = result
        })
        this.notifiers.what.onUpdate((result)=>{
            //console.log("wooow",this.what)
            this.what = result
        })
    }

    onExec(){
        //console.log(this.what)
       // console.log( this.notifiers.what.get(true));
       //console.log(this.notifiers.what.value)
        let what = this.notifiers.what.get()
        //.getPreview(false)
        //console.log(this);
        this.notifiers.to.get().addGizmo(what);
      // console.log("fodpkop")
      //  $(this.to.getPreview()).append(what)
        
    }

    getNotifiers(){
        return {
            what: new SelfNotifier(),
            to: new SelfNotifier()
        }
    }

}


class ChangeValue extends ActionGizmo{

    constructor(){
        super("Change Value")
        
    }

    onExec(){
       // console.log(this.notifiers.to)
        this.notifiers.to.set(this.notifiers.to.get(), true)
        //this.notifiers.to.se
       
    }

    getNotifiers(){
        return {
            to: new StringNotifier("Hello world!")
            
        }
    }

}


class ChangeValue2 extends ActionGizmo{

    constructor(){
        super("Change Value")
       // this.notifiers.gizmo.onUpdate((gizmo)=>this.gizmoUpdate(gizmo))
        this.content = $("<div/>");
       
        $(this).append(this.content);
        this.notifiers.type.onUpdate((value)=>{
            
            let itemClass = editor.menuItems.find((item)=>item.name == value).gizmo;
            
            this.gizmoUpdate(new itemClass())
        });
        $(this.content).on("repaint", ()=>{
            
            $(this.content).children().trigger("repaint.div")
            
        });
    }

    

    gizmoUpdate(gizmo){
        
        this.updateNotifiers = {}
       // console.log("ropwofprk")
        if(gizmo==undefined)return
        this.content.empty()
        if(Object.entries(gizmo.notifiers).length>0)$(this.content).append($("<hr>").css({padding:0, margin: 0}))
        for(let notiferKey in gizmo.notifiers){
            let notifier = gizmo.notifiers[notiferKey];

            let notifierCopy = notifier.clone()

            notifierCopy.modified = false;
            this.updateNotifiers[notiferKey] = notifierCopy;
            let inputField = this.getNotiferInputField(notiferKey, notifierCopy)
            this.content.append(inputField);
    
        }
        
    }


    onExec(){
  
        let gizmoNotifier = this.notifiers.gizmo.get().notifiers;
 
        for(let notifierKey in this.updateNotifiers){
            let notifier = this.updateNotifiers[notifierKey];

            if(notifier.modified || notifier instanceof AggregateNotifier){
 
                gizmoNotifier[notifierKey].set(notifier.value);
            }
            
        }
    }

    getNotifiers(){
        let gizmos = editor.menuItems.filter((item)=>item.catagory=="gizmo").map((item)=>item.name)
        return {
            type: new OptionNotifier(gizmos),
            gizmo: new SelfNotifier(),
           
        }
    }

}

class IfGizmo extends ActionGizmo{

    constructor(){
        super("If")

    }

    eventTrigger(self,value){
      
    }

    onExec(){
       // console.log(this.notifiers.to)
        //this.notifiers.to.set(this.notifiers.to.get(), true)
        //this.notifiers.to.se
        //console.log(this.notifiers.value1.get() == this.notifiers.value2.get())
        //console.log(this.notifiers.value1.get(), this.notifiers.value2.get())
        let check = this.notifiers.value1.get()==this.notifiers.value2.get()
        if(!check) {
           // console.log("woa", this.notifiers.else)
            this.notifiers.else.exec()
        }
        return check;
            
        
    }

    getNotifiers(){
        return {
            value1: new StringNotifier("first value"),
            value2: new StringNotifier("second value"),
            else: new ActionNotifier()
        }
    }

}
