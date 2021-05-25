class Notifier{

    constructor(value){
        this.value = value
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

    }

    set(value){
        this.value = value
        for(let uiHook of this.outputHook.outputs){
            uiHook.hook.notifier.set(value);
            uiHook.hook.notifier.updateField(value)
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
        this.field.val(value)
    }

    set(value){
        super.set(value)
        this.textbox.text(value)
        //this.field.val(value)
        //this.field.remove();
        //console.log(this.field)
    }
    
}