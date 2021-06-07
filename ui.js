
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

    attachPreviewField(notifiers, field){
        for(let noteKey in notifiers){
            let notifier = notifiers[noteKey];
            if(!(notifier instanceof AggregateNotifier)){
                notifier.uiFields.push(field);
            }else{
                this.attachPreviewField(notifier.get(), field);
            }
        }
    }

    onPreview(){
        this.attachPreviewField(this.notifiers, this.getUiField())
        
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

    getUiField(){
        return this.text
    }


    getNotifiers(){
        
        return {
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

    getUiField(){
        return this
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
       
    }

    initHookedUI(){
        this.button = $("<button/>").text("Click me!").appendTo(this)
    }

    getUiField(){
        return this.button
    }


    getNotifiers(){

        return {
            "text": new UINotifier(this.button, (field)=>field.text(), (field, value)=>field.text(value)),
            "style": new AggregateNotifier({
                color: new StyleNotifier(this.button, "color"),
                border: new StyleNotifier(this.button, "border"),
                background: new StyleNotifier(this.button, "backgroundColor"),
                round: new StyleNotifier(this.button, "borderRadius").slider(0, 100)
            })
            
        }
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
               
            }

        }).val("").addClass("zeninput")
        $(this).append(this.text)
    }
    
    getUiField(){
        return this.text
    }


    getNotifiers(){
        
        return {
            "text": new UINotifier(this.text, (field)=>field.val(), (field, value)=>field.val(value))
                
        }
    }
}