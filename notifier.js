class Notifier{

    constructor(value){
        this.value = value
        this.initValue = value;
        this.fieldUpdater = null;
        this.isDeferred = false;
        this.linkedNotifer = null;
    }

    reset(){
        this.updateField(this.initValue)
        this.set(this.initValue)
    }

    setHooks(inputHook, outputHook){
        this.inputHook = inputHook;
        this.outputHook = outputHook;
        
    }


    get(){
        return this.value 
    }

    setField(field){
       
        this.field = field
    }

    updateField(data){
        if(this.fieldUpdater!=null)this.fieldUpdater(data)
        //console.log("linked", this.linkedNotifer)
    }

    onUpdate(callback){
        this.fieldUpdater=callback
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
            this.gizmo.previewRef.notifiers[this.key].set(value,"eof[k")
            //console.log(this.gizmo.previewRef.notifiers);
        }
        if(this.linkedNotifer!=null){
            
        }
        if(this.outputHook!==undefined ){
            for(let uiHook of this.outputHook.outputs){
                //if(!this.isDeferred){
                    uiHook.hook.notifier.set(value);
                    uiHook.hook.notifier.updateField(value)
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

class ActionNotifier extends Notifier{

    constructor(){
        super(null);
    }

    hasInput(){
        return false;
    }

    exec(){
        if(this.value!=null)this.value()
    }

    set(value){
        super.set(value)
    }

   addTrigger(trigger, gizmo){
       trigger(gizmo)
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
        this.uiField = field 
        //this.setField(field);
    }

    get(){
        super.get()
        
        return this.fieldGet(this.uiField)
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

    set(value, updateField = false){
        super.set(value)
        this.fieldSet(this.uiField, value)
        
        if(updateField)this.updateField(value)
        //this.updateField(value)
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
            this.updateField(value)
        }
        //
    }

    
}


class ExecutionNotifier extends Notifier{


    constructor(actionLambda){
        super(actionLambda)
        
    }

    set(value){
       //You don't want execution notifiers to get reset
    }



}