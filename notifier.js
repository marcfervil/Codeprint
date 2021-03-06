class Notifier{

    constructor(value){
        this.value = value
        this.initValue = value;

        this.fieldUpdater = null;
        this.resetUpdater= null
        this.isDeferred = false;
        this.isRuntime = false; 
        this.linkedNotifer = null;

        this.modified = false;
    }


    clone(){
        return new this.constructor(this.value)
    }


    reset(){
        this.updateFieldUI(this.initValue)
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

    get(runtime=false){
        if(this.value instanceof ReturnNotifier) return this.value.exec();
        return this.value 
    }

    setField(field){
       
        this.field = field
    }

    updateFieldUI(data){
        if(data instanceof ReturnNotifier) {
            //console.log("eopwfkp")
            data = this.value.exec()
        }
        this.updateField(data)
    }

    updateField(data){
       
        
        if(data instanceof ReturnNotifier) data = data.exec();
        if(this.fieldUpdater!=null)this.fieldUpdater(data)
        //console.log("linked", this.linkedNotifer)
        return data
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
        this.modified = true;
        if(value instanceof ReturnNotifier){
            this.runtimeNotifier = value;
            //console.log("yuh", this.constructor.name)
            //return;
          //  value = value.get(true);
            this.value = "<Logic>"
           
        }

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

    update(value){
        if(this.field != undefined){
            if(value!=null && value!=undefined  && value!=""){
                
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

    updateField(value){
        super.updateField(value)
        
        this.update(value);

    }

    set(value){
        super.set(value)
        this.update(value)

        if(this.outputHook!=undefined){
        for(let uiHook of this.outputHook.outputs){
            //if(!this.isDeferred){
            uiHook.hook.notifier.updateField(value);
           // uiHook.hook.notifier.updateField(value)
            //}
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

        this.fieldCloneRef = field;

        this.fieldGet = fieldGet;
        this.fieldSet = fieldSet;
        this.uiFields = [field]
        this.fieldAttrs = {}
        this.onFieldSet = null;

        this.prefix = () => "";
        this.suffix = () => "";
       // setTimeout(()=>{
            //console.log(fieldGet(field)+"frog")
        this.set(fieldGet(field))
        //},1)
       // console.log(this.value)
       this.cloneable = []
    }

    clone(){
       // console.log("eiowfoij", this.constructor.name)
       // console.log(this.cloneable)
        $(this.fieldCloneRef[0]).val("")
        $(this.fieldCloneRef[0]).text("")
        //console.log(this.initValue)
       // $(this.ff[0]).val("opfewkpfkw")
        //let copy = new this.constructor($(this.fieldCloneRef[0].cloneNode(true)), this.fieldGet, this.fieldSet);
        let fakeValue = "";
        let copy = new this.constructor($(this.fieldCloneRef[0].cloneNode(true)),(field)=>fakeValue, (field, value)=>fakeValue=value);
        //copy.cloneifier = true;
        //copy.uiFields[0] = this.uiFields[0].clone(true);
        return copy;
    }

    get(){
        let get = super.get()
        // console.log("eopwkpk", this.uiFields)
        //return get;
        //if(this.runtimeNotifier!==undefined)return get;
       // if(this.uiFields[0].length==0)return get;
        return this.fieldGet(this.uiFields[0])
    }

    decorate(prefix, suffix){
        this.cloneable.push({func: this.decorate, arg:arguments})
        this.prefix = (prefix instanceof Function) ? prefix : () => prefix;
        this.suffix = (suffix instanceof Function) ? suffix : () => suffix;
        this.set(this.value)
        return this;
    }

    updateField(value){
        //console.log("UPDATING FIELD???",value)
        //value = this.prefix() + value + this.suffix()
        
        if(this.field!=undefined)this.field.val(value)
        
    }

    setField(field){
        //console.log("YFIWEHUIE",field)
        super.setField(field)
        $(field).attr(this.fieldAttrs)
        if(this.onFieldSet!=null)this.onFieldSet(field)
    }

    slider(min, max, start=min){
        this.cloneable.push({func: this.slider, arg:arguments})
        this.onFieldSet = () => {
            this.field.attr({
                type: "range",
                min: min,
                max: max,
                step: 0.1,
                value: 0
            })
           
            this.field.val(this.value)
        }
        //this.set()
        return this
    }

    dropdown(items){
        this.cloneable.push({func: this.dropdown, arg:arguments})
        this.onFieldSet = (field) => {
            let select = $("<select/>");
           
            //it's not real gizmetti until you have a ~certified~ race condition
            setTimeout(()=>{
                field.replaceWith(select);
                this.field = field;
                field = select
                for(let item of items){
                    field.append($(`<option/>`).val(item).text(item))
                }

                //field.
                field.mousedown((e)=>e.stopPropagation());
                field.change((e)=>{
                    let result = $(e.target).find("option:selected").attr('value')
                    this.set(result)
                })
                this.field = select
                //this.field.val("dotted")
            },0)
           
           

        }
        return this
    }

    color(){
        this.cloneable.push({func: this.color, arg:arguments})
        this.onFieldSet = () => {
            this.field = this.field.attr({
                type: "color",
                
            })
          //  setTimeout(()=>{
                //this.set(this.field.val())
               // this.field.val("#ff0000")
            //},1000)
            
        }
        return this
    }



    set(value){
        
        super.set(value)
        if(value instanceof ReturnNotifier) value = value.exec()
        for(let field of this.uiFields){
            //console.log("RWOWOWJKO",field,value)
            this.fieldSet(field, this.prefix() + value + this.suffix())
        }
 
        this.updateField(value)
    }
    
}

class StyleNotifier extends UINotifier{

    constructor(field, fieldName, defaultValue){
        
        let getField = (field) => field[0].style[fieldName];
        let setField = (field, value) => field[0].style[fieldName] = value;
        //this.ff = field
        super(field, getField, setField)
        
       //this.set(getField(field))
        this.set(defaultValue)
        setField(field, defaultValue)
    }

    clone(){
        
        return new this.constructor($(this.ff).clone(true), this.fieldName)
    }

   
}



//deffered value to deffered value should update
class StringNotifier extends Notifier{

    constructor(initValue, isDeferred = true){
        
        super(initValue)
        this.isDeferred = isDeferred;
    }

    updateField(value){
        super.updateField(value)
        if(this.field!==undefined)this.field.val(value)
    }

    set(value, update){

        this.value = value
       
        //console.log(this.field)
        //this.field.t
        if(update || this.isDeferred==false){
            super.set(value)
            
        }
        this.updateField(value)
        //
    }

    superSet(value){
        
        super.set(value)
    }
}

class OptionNotifier extends Notifier{

    constructor(options, value=""){
        
        super(value)
        this.options = options
    }

    updateField(value){
        super.updateField(value)
        if(this.field!==undefined)this.field.val(value)
    }

    set(value, update){
        this.value = value
       
        //console.log(this.field)
        //this.field.t
        if(update || value instanceof ReturnNotifier){
            super.set(value)
            
        }
        this.updateField(value)
        //
    }

    superSet(value){
        
        super.set(value)
    }
}



class ReturnNotifier extends StringNotifier{

    constructor( exec){
        super(null,exec)
        this.exec = exec;
        this.val = null
        //this.isDeferred = true;
    }

 
    get(){
       
        return this;
    }

    set(value, update){
        super.set(value, update);
        //super.superSet(value);
        //super.super.set(this.value)
        for(let uiHook of this.outputHook.outputs){

           // uiHook.hook.notifier.set(value);
            uiHook.hook.notifier.updateFieldUI(value)
            console.log(uiHook)
        }
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
        this.cloneable = []
        //this.modified = true;
    }

    set(value){
        let oldValue = this.get()
        super.set(value);
      
        for(let key in oldValue){
            let notifier = value[key];
            //console.log(notifier.value)
            oldValue[key].set(notifier.value)
        }
        this.value = oldValue
    }

    get(key = null){
        if(key==null)return super.get()
        return super.get()[key]
    }

    hasOutput(){
        return false;
    }

    clone(){
        let cloneifiers = {}

        for(let notifierKey in this.value){
          
            let notifier = this.value[notifierKey];
            let copy = notifier.clone();
            cloneifiers[notifierKey] = copy;
            for(let cloneAction of notifier.cloneable){
                copy[cloneAction.func.name](...cloneAction.arg)
            }
        }
        return new this.constructor(cloneifiers)
    }

}