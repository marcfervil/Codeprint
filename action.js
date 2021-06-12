class ActionGizmo extends Blueprint{

    constructor(name){
        super(" "+name);
        this.exec = ()=>{
            let result = this.onExec()
            //console.log(this.completedNotifier)
            if(result!=false)this.completedNotifier.exec()
        }

        this.notifiers = this.getNotifiers()
        this.hookNotifiers(this.notifiers, (key, notifier)=>{
            if(!(notifier instanceof ActionNotifier)){
                notifier.isDeferred = true;
            }
        });
 
        this.execNotifier = new ExecutionNotifier(this.exec);
        
        this.execHook = this.getHook(this.execNotifier, "input");

        this.heading.prepend(this.execHook)
        //this.exec.bind(this);

        this.completedNotifier = new ActionNotifier()
        this.completedHook = this.getHook(this.completedNotifier, "output");
        this.heading.append(this.completedHook.css({
            "float": "right",
            "margin": "5px",
            "marginBottom": "0px"
        }))
     
        $(this).dblclick(()=>{
            this.exec();
        })
    }


    getNotifiers(){
        
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
            this.what = result
        })
    }

    onExec(){
        let what = this.what.getPreview(false)
        //console.log(this);
       // what.setParent(this);
        $(this.to.getPreview()).append(what)
        
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
        this.notifiers.gizmo.onUpdate((gizmo)=>this.gizmoUpdate(gizmo))
        
    }

    gizmoUpdate(gizmo){
        
        this.updateNotifiers = {}


        console.log(gizmo.heading, gizmo instanceof Blueprint)


        //$(this).append(gizmo.heading);
        for(let notiferKey in gizmo.notifiers){
            let notifier = gizmo.notifiers[notiferKey];

            let notifierCopy = notifier.clone()

            this.updateNotifiers[notiferKey] = notifierCopy;
            let inputField = this.getNotiferInputField(notiferKey, notifierCopy)
            $(this).append(inputField);

            
            //this.notifier.fields.push(inputField.gizmo.field)
        }
        
    }


    onExec(){
  
        let gizmoNotifier = this.notifiers.gizmo.get().notifiers;
      
        for(let notifierKey in this.updateNotifiers){
            let notifier = this.updateNotifiers[notifierKey];
            
            gizmoNotifier[notifierKey].set(notifier.get());
        }
    }

    getNotifiers(){
        return {
            gizmo: new SelfNotifier(),
            //to: new StringNotifier("Hello world!")
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