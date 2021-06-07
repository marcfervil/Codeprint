class Notifier{

    constructor(value){
        this.value = value
        this.initValue = value;
        this.fieldUpdater = null;
        this.resetUpdater= null
        this.isDeferred = false;
        this.linkedNotifer = null;

        
    }

    reset(){
        this.updateField(this.initValue)
        this.set(this.initValue)
        //this.onUnhooked()
        //console.log("reset, value is ", this.value)
        if(this.resetUpdater!=null){
            
            this.resetUpdater()
        }
    }

    setHooks(inputHook, outputHook){
        this.inputHook = inputHook;
        this.outputHook = outputHook;
        
    }

    onUnhooked(){
       // console.log(this.constructor.name+" unhooked!")
       if(this.resetUpdater!=null)this.resetUpdater();
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
        this.fieldUpdater = callback
    }

    onReset(callback){
        this.resetUpdater = callback
    }

    hasOutput(){
        return true;
    }

    hasInput(){
        return true;
    }

    set(value){
       // value = this.prefix() + value + this.suffix()
        this.value = value
        //if(uu!=null)console.log("feopwk")
        //console.log(this.gizmo)
        if(this.gizmo?.previewRef != null){
            //console.log(this.gizmo.previewRef.notifiers[this.key])
            //this.gizmo.previewRef.notifiers[this.key].set(value,"eof[k")
            //console.log(this.gizmo.previewRef.notifiers);
        }
        if(this.linkedNotifer!=null){
            
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
        if(this.field != undefined){
            if(value!=null && value!=undefined ){
                
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

        this.fieldGet = fieldGet;
        this.fieldSet = fieldSet;
        this.uiFields = [field]
        this.fieldAttrs = {}
        this.onFieldSet = null;

        this.prefix = () => "";
        this.suffix = () => "";
    }

    get(){
        super.get()
        
        return this.fieldGet(this.uiFields[0])
    }

    decorate(prefix, suffix){
        this.prefix = (prefix instanceof Function) ? prefix : () => prefix;
        this.suffix = (suffix instanceof Function) ? suffix : () => suffix;
        return this;
    }

    updateField(value){
        //console.log(value)
        //value = this.prefix() + value + this.suffix()
        if(this.field!=undefined)this.field.val(value)
        
    }

    setField(field){
        super.setField(field)
        $(field).attr(this.fieldAttrs)
        if(this.onFieldSet!=null)this.onFieldSet()
    }

    slider(min, max, start=min){
        this.onFieldSet = () => {
            this.field.attr({
                type: "range",
                min: min,
                max: max,
                step: 0.1,
                value: 0
            })
            this.field.val(0)
        }
        return this
    }

    set(value, updateField = false){
        //value = 
        super.set(value)
        for(let field of this.uiFields){
            this.fieldSet(field, this.prefix() + value + this.suffix())
        }
 
        this.updateField(value)
    }
    
}

class StyleNotifier extends UINotifier{

    constructor(field, fieldName){
        
        let getField = (field) => field[0].style[fieldName];
        let setField = (field, value) => field[0].style[fieldName] = value;
        super(field, getField, setField)

        
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

    reset(){
        super.reset();
     //    console.log("reset, value is ", this.value)
    }

    onUnhooked(){
        super.onUnhooked()
        //console.log("action unhooked!")
    }

    set(value){
        super.set(value)
        //console.log(value)
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
       // console.log(value)
        //super.set(value)
        //console.log(value)
       //You don't want execution notifiers to get reset
    }



}

class AggregateNotifier extends Notifier {
    
    constructor(notifiers){
        super(notifiers);
    }


    hasOutput(){
        return false;
    }
}