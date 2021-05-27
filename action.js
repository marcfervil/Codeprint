class ActionGizmo extends Blueprint{

    constructor(name){
        super(" "+name);
        this.exec = ()=>{
            this.onExec()
            //this.getExec();
            //if()
            this.completedNotifier.exec()
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



class ChangeValue extends ActionGizmo{

    constructor(){
        super("Change Value")
        
    }

    onExec(){
       // console.log(this.notifiers.to)
        this.notifiers.to.set(this.notifiers.to.get())
        //this.notifiers.to.se
       
    }

    getNotifiers(){
        return {
            to: new StringNotifier("Hello world!")
        }
    }

}