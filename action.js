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

        this.heading.addClass("actionHeading");
        
     
        $(this).dblclick(()=>{
            this.exec();
        })
    }

    getCatagory(){
        return "action"
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

    
        $(this).append($("<hr>").css({padding:0, margin: 0}))

        $(this).append(this.resultField);

        this.exec = ()=>{
            let result = this.onExec()
            this.resultNotifier.set(result);
            this.resultNotifier.updateField(result);
            if(result!=false)this.completedNotifier.exec()
        }

        this.execNotifier.value = this.exec
    }

    

}


class Add extends FunctionAction{

    constructor(){
        super("Add");
       
    }

    static getMenuName(){
        return "Add"
    }

    getNotifiers(){
        return {
            "number1" : new StringNotifier(),
            "number2" : new StringNotifier()
        }
    }

    onExec(){
        let num1 = parseInt(this.get("number1"));
        let num2 = parseInt(this.get("number2"));
        
        return num1 + num2;
    }
}

editor.addToMenu(Add, "action")


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
     
        return clone;
    }

}


class GetListItem extends FunctionAction{

    constructor(){
        super("Get list item");
       
    }

    getNotifiers(){
        return {
            "list" : new SelfNotifier(),
            "index" : new StringNotifier("")
        }
    }

    onExec(){
        return this.notifiers.list.get().items[this.notifiers.index.get()];
        
    }

}


class FunctionGizmo extends FunctionAction{

    constructor(){
        super("Function");
        //console.log(this.notifiers.code.field);
        $(this).find(".blueprintItem").toArray().forEach((item)=>{
            $(item).attr("removeable", "false")
        })
        this.notifiers.code.field.on("focusout", ()=>this.resetParamHooks());
        this.resetParamHooks();
    }

    resetParamHooks(){
        

        this.setHeading(this.getFunc().name)

        $(this).find(".blueprintItem, .removeHr").filter("[removeable!='false']").toArray().forEach((item)=>{
            let unhook = null
            //console.log( $(item)[0].childNodes[0])
            //.unHook)

            
            //if((unhook = $(item)[0].childNodes[0]?.unhook)!=undefined)unhook()
          //  if((unhook = $(item)[2].childNodes[0]?.unhook)!=undefined)unhook()
            
            item.remove()
        })
        
        let paramNames = getParamNames(this.get("code"));
        if(paramNames.length>1)$(this).append($("<hr class='removeHr'>").css("margin","0px"))
        
        let newNotifiers = paramNames.reduce((notifiers, param)=>{
            notifiers[param]=new StringNotifier("")
            return notifiers;
        }, {});

        this.hookNotifiers(newNotifiers);
        Object.assign(this.notifiers, newNotifiers)
    }

    getFunc(){
        
        return eval("("+this.get("code")+")")
    }
    
    onExec(){
        let args = Object.entries(this.notifiers).map(([key, value])=>value.get()).splice(1);
        
        return this.getFunc()(...args); 
    }

    getNotifiers(){
        return {
            
            "code" : new StringNotifier(`function concat(var1, var2){\n\treturn var1+" "+var2\n}`).textarea(4,20),
           // "woo" : new StringNotifier("dpsok")
        }
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

            let cloneifier = notifier.clone()
            this.notifiers[notiferKey] = cloneifier;

            let notifierCopy = cloneifier

            notifierCopy.modified = false;
            this.updateNotifiers[notiferKey] = notifierCopy;
            let inputField = this.getNotiferInputField(notiferKey, notifierCopy)
            this.content.append(inputField);
    
        }
        //console.log(this.notifiers)
        
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

        let notes = {
            type: new OptionNotifier(gizmos),
            gizmo: new SelfNotifier(),
           
        }

        notes.gizmo.hasOutput = ()=>true;

        return notes;
    }

}

class IfGizmo extends ActionGizmo{

    constructor(){
        super("If")

    }

    eventTrigger(self,value){
      
    }

    onExec(){

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


class ForGizmo extends ActionGizmo{

    constructor(){
        super("For Each")

    }

 
    onExec(){

        let iter = this.get("in");
       
        let items = null;
        if(iter instanceof ListGizmo){
            items = iter.items
        }else if(iter instanceof Gizmo){
            items = $(iter).children()
        }
        
        for(let item of items){
            this.notifiers.element.set(item)
            this.notifiers.do.exec()
            //console.log(item)
        }
        
        
        
    }

    getNotifiers(){
        let notes = {
            
            element: new SelfNotifier(),
            in: new SelfNotifier(),
            do: new ActionNotifier()
        }
        //notes.each.hasOutput = ()=>true;
        notes.element.hasOutput = ()=>true;
        return notes;
    }

}

