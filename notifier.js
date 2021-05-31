class Notifier{

    constructor(value){
        this.value = value
        this.initValue = value;
        this.fieldUpdater = null;
        this.resetUpdater= null
        this.isDeferred = false;
    }

    reset(){
        this.updateField(this.initValue)
        this.set(this.initValue)
        //this.onUnhooked()
        
        if(this.resetUpdater!=null){
            
            this.resetUpdater()
        }
    }

    setHooks(inputHook, outputHook){
        this.inputHook = inputHook;
        this.outputHook = outputHook;
        
    }

    onUnhooked(){
        console.log(this.constructor.name+" unhooked!")
    }

    get(){
        return this.value 
    }

    setField(field){
       
        this.field = field
    }

    updateField(data){
        if(this.fieldUpdater!=null)this.fieldUpdater(data)
        
    }

    onUpdate(callback){
        this.fieldUpdater=callback
    }

    onReset(callback){
        this.resetUpdater=callback
    }

    hasOutput(){
        return true;
    }

    hasInput(){
        return true;
    }

    set(value){
        this.value = value
        //if(uu!=null)console.log("feopwk")
        //console.log(this.gizmo)
        if(this.gizmo?.previewRef != null){
            //console.log(this.gizmo.previewRef.notifiers[this.key])
            //this.gizmo.previewRef.notifiers[this.key].set(value,"eof[k")
            //console.log(this.gizmo.previewRef.notifiers);
        }
        if(this.outputHook!==undefined ){
            for(let uiHook of this.outputHook.outputs){
                //if(!this.isDeferred){
                uiHook.hook.notifier.set(value);
               // uiHook.hook.notifier.updateField(value)
                //}
            }
        }
    }


}

class SelfNotifier extends Notifier{
    constructor(self){
        super(self);
    }
    hasOutput(){
        return false;
    }

    updateField(value){
        super.updateField(value)
        if(value!=null && value!=undefined){
            this.field.text(value.constructor.name)
            this.field.removeClass("italic")
            this.field.addClass("selfNotifier")
        }else{
            this.field.text("nothing")
            this.field.removeClass("selfNotifier")
            this.field.addClass("italic")
        }
    }


}


class TextInputNotifier extends Notifier{

    constructor(textbox){
        
        super(textbox.text())
        this.textbox = textbox
    }

    get(){
        super.get()
        
        return this.textbox.text() 
    }

    updateField(value){
        super.updateField(value)
        this.field.val(value)
    }

    set(value){
        super.set(value)
        this.textbox.text(value)
    }
    
}

class UINotifier extends Notifier{

    constructor(field, fieldGet, fieldSet){
        
        super(fieldGet(field))
        //this.textbox = textbox
        this.fieldGet = fieldGet;
        this.fieldSet = fieldSet;
        this.uiFields = [field ]
        //this.setField(field);
    }

    get(){
        super.get()
        
        return this.fieldGet(this.uiFields[0])
    }

    updateField(value){
        //super.updateField(value)
        //this.field.val(value)
        //this.fieldSet(this.uiField, value)
        if(this.field!=undefined)this.field.val(value)
       // console.log(this.field)
        
    }

    setField(field){
        super.setField(field)
        
       // console.log("FIELD SET!", field)
    }

    set(value){
        super.set(value)
        for(let field of this.uiFields){
            this.fieldSet(field, value)
        }
        
       // console.log("dokok")
       
        this.updateField(value)
    }
    
}




class StringNotifier extends Notifier{

    constructor(initValue){
        
        super(initValue)
    }

    updateField(value){
        super.updateField(value)
        this.field.val(value)
    }

    set(value, update){
        this.value = value
       
        //console.log(this.field)
        //this.field.t
        if(update){
            super.set(value)
            
        }
        this.updateField(value)
        //
    }

    
}

//action to execution is chaining
class ActionNotifier extends Notifier{

    constructor(){
        super(null);
    }

    hasInput(){
        return false;
    }

    exec(){
        //console.log(this.value)
        if(this.value!=null)this.value()
    }

    

    onUnhooked(){
        super.onUnhooked()
        //console.log("action unhooked!")
    }

    set(value){
        super.set(value)
      
    }

   addTrigger(trigger, gizmo){
       trigger(gizmo)
   }

}

class ExecutionNotifier extends Notifier{


    constructor(actionLambda){
        super(actionLambda)
        
    }

    onUnhooked(){
        super.onUnhooked()
        //console.log("exec unhook!")
    }

    set(value){
        //super.set(value)
        //console.log(value)
       //You don't want execution notifiers to get reset
    }



}