class ActionGizmo extends Blueprint{

    constructor(name){
        super(" "+name);
        this.exec = ()=>{
            this.onExec()
            //this.getExec();
        }

        this.notifiers = this.getNotifiers()
        this.hookNotifiers(this.notifiers);

        this.execNotifier = new ExecutionNotifier(this.exec);
        
        this.execHook = this.getHook(this.execNotifier, "input");

        this.heading.prepend(this.execHook)
        //this.exec.bind(this);

        
       
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
            message: new StringNotifier()
        }
    }

}