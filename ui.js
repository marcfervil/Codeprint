
class UIGizmo extends Gizmo{
    constructor() {
        super();
        this.blueprint = null;
        $(this).dblclick((e)=>{
            if(this instanceof UIGizmo && !this.isPreview){
                this.blueprint = this.createBlueprint();
                $(this).off("dblclick")
                e.stopPropagation();
                e.preventDefault();
                
                if(editor.hovered!=null){
                    editor.hovered.unhover()
                   
                    //editor.hovered = null;
                }
                editor.dragging = false;
            }
        });
        this.initHookedUI()
        this.notifiers = this.getNotifiers();
    }

    cloneNode(){
        let node = super.cloneNode();
        
        for(let notifier in this.notifiers){
            node.notifiers[notifier].set(this.notifiers[notifier].get());
        }
        return node;
    }

    initHookedUI(){
    }

    prop(name, value){
        if(value != undefined){
            this.notifiers[name].set(value)
        }else{
            return this.notifiers[name].get()
        }
    }
   
    getNotifiers(){

    }

    createBlueprint(){
        let blueprint = createGizmo(UIBlueprint, this);
        blueprint.redrag()
        return blueprint
    }

   

    onPreview(){
        
        
    }
}





class TextGizmo extends UIGizmo{
    constructor() {
        super();
        //this.text = 
        //console.log("edkpw")
        //console.log(this.text)
    }

    initHookedUI(){
        this.text = $(this).text("placeholder");
    }

    onPreview(){
        this.notifiers.text.uiFields.push(this.text)
    }

    getNotifiers(){
        
        return {
            //"text": new TextInputNotifier(this.text)
            "text": new UINotifier(this.text, (field)=>field.text(), (field, value)=>field.text(value))
        }
    }
}

class ViewGizmo extends UIGizmo{
    constructor() {
        super();
        this.className = "page"
        
    }

    hasChildren(){
        return true;
    }

    setParent(gizmo){
        super.setParent(gizmo)
       
        //if(!this.hasAttribute("isPreview")){
        if(gizmo!=null){
            this.style.width = null;
            this.style.minHeight = "100px";
            //this.style.height = "100%";
            
        }else{
            this.style.width = "20%";
            this.style.minHeight = "60%";
        }
    }
}

class ButtonGizmo extends UIGizmo{
    constructor() {
        super();
        this.button = $(this).append($("<button/>").text("Click me!"))
    }
}


class TextBoxGizmo extends UIGizmo{
    constructor() {
        super();
    }

    initHookedUI(){
        this.text = $("<input/>", {
            attr:{
                "type": "text",
                "placeholder": "Put some text in me!"
            },
            on: {

                input: (e)=>{
                    let me = $(e.target);
                    
                    
                    let savedVal = me.val();
                    
                    me.val("");
                    this.notifiers.text.set(savedVal)
                
                    
                
                },

                keydown: (e) => {
                    if(!this.isPreview)e.preventDefault();
                }
                /*
                keypress: (e) => {
                    let text = $(e.target).val()+e.key;
                    if(this.isPreview && !e.metaKey){
                        //this.previewRef.notifiers.text.set(text)
                        //console.log("iji", th)
                        this.notifiers.text.set(text)
                    }
                    
                    //this.notifiers.text.updateField(text)
                    //this.notifiers.text.set(text)
                    if(!this.isPreview || (this.isPreview && !e.metaKey))e.preventDefault();
                },
                keyup: (e) => {
                    if(e.keyCode == 8){
                        
                        this.notifiers.text.set($(e.target).val())
                    } 
                }*/
            }

        }).val("").addClass("zeninput")
        $(this).append(this.text)
    }

   onPreview(){
       this.notifiers.text.uiFields.push(this.text)
   }

    getNotifiers(){
        
        return {
            "text": new UINotifier(this.text, (field)=>field.val(), (field, value)=>field.val(value))
                
        }
    }
}