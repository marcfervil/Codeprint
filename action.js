class ActionGizmo extends Blueprint{

    constructor(name){
        super(" "+name);
        this.exec = ()=>{
            let result = this.onExec()

            if(result!=false)this.completedNotifier.exec()
        }

        this.notifiers = this.getNotifiers()
        this.hookNotifiers(this.notifiers, (key, notifier)=>{
            notifier.isDeferred = true;
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
        let what = this.what.getPreview()
        what.setParent(this);
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

class IfGizmo extends ActionGizmo{

    constructor(){
        super("If")
        
    }

    onExec(){
       // console.log(this.notifiers.to)
        //this.notifiers.to.set(this.notifiers.to.get(), true)
        //this.notifiers.to.se
        console.log(this.notifiers.value1.get() == this.notifiers.value2.get())
        console.log(this.notifiers.value1.get(), this.notifiers.value2.get())
        return(this.notifiers.value1.get()==this.notifiers.value2.get())
            
        
    }

    getNotifiers(){
        return {
            value1: new StringNotifier("first value"),
            value2: new StringNotifier("second value")
        }
    }

}