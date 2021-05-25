class Notifier{

    constructor(value){
        this.value = value
        this.fieldUpdater = null;
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
    }

    onUpdate(callback){
        this.fieldUpdater=callback
    }

    hasOutput(){
        return true;
    }

    set(value){
        this.value = value
        for(let uiHook of this.outputHook.outputs){
            uiHook.hook.notifier.set(value);
            uiHook.hook.notifier.updateField(value)
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