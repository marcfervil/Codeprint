class ActionGizmo extends Blueprint{

    constructor(name){
        super(" "+name);
        this.notifiers = this.getNotifiers()
        this.hookNotifiers(this.notifiers);

        this.execNotifier = new ExecutionNotifier(this.exec);
        
        this.execHook = this.getHook(this.execNotifier, "input");

        this.heading.prepend(this.execHook)
    }


    getNotifiers(){
        
    }

}

class PopupGizmo extends ActionGizmo{

    constructor(){
        super("Popup")

    }

    exec(){
        alert("It works!!!")
    }

    getNotifiers(){
        return {

        }
    }

}