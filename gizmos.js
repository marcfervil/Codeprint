


class Gizmo extends HTMLElement {
    constructor() {
        super();
        this.gizmos = []
        this.inited = false;
        this.id = editor.idNum++;
        this.hover();
        this.setParent(null);
        this.previewRef = null;
        if(this.hasChildren()){
            $(this).mouseover(this.hover);
            $(this).mouseout(this.unhover);
        }
    }

    hasChildren(){
        return false;
    }

   

    preview(root=true){
        let gizmo = this.cloneNode();
        gizmo.isPreview = true;
        this.previewRef = gizmo;
        let empty = () => {}
      //  console.log($(gizmo))
       // $(gizmo).unbind()
       // $(gizmo).off()
       // $(gizmo).off("mousedown")
        //$(editor.preview).add('*').off();

        //gizmo.unhover(true)

        //couldn't figure out how to remove event listeners...I'm sorry
        gizmo.hover = empty;
        gizmo.unhover = empty
        gizmo.drag = empty;
        gizmo.redrag = empty;
       // gizmo.style.backgroundColor = "white";
        
        if(root && gizmo instanceof ViewGizmo){
            gizmo.style.width = "100%"
            gizmo.style.height = "100%"
            gizmo.style.position = "static"
            gizmo.style.border = null;
            gizmo.className = null;
        }
        for(let node of this.childNodes){
            if(node instanceof Gizmo){
                gizmo.addGizmo(node.preview(false))
            }
        }
        return gizmo;
    }

    created(){
       
    }

    pos(x, y){
        if(x===undefined && y===undefined){
            let rect = this.getBoundingClientRect();
            return {x: rect.left, y: rect.top}
        }
        this.style.left = x;
        this.style.top = y;

    }

    hover(event){
        
        if(!this.hasChildren() || editor.dragging instanceof Blueprint)return;
        if((editor.dragging!=false && editor.dragging!=this )|| event==true){
            this.style.backgroundColor = "lightgrey";
            //if(editor.hovered!=null)editor.hovered.unhover();
            editor.hovered = this;
            if(event!=true && event!=undefined)event.stopPropagation();
        }
    }

    unhover(event){
       
       
        if(editor.dragging!=false && editor.dragging!=this){
            this.style.backgroundColor = null;
            if(this.isPreview===undefined)editor.hovered = null;

        }
    }



    setParent(gizmo){
        let ogParent = this.parent
        this.parent = gizmo;
        if(gizmo!=null){
            
            this.style.position = "static"
            
            
        }else{
            if(this.previewRef!=null && ogParent!=null){
                this.previewRef.remove();
            }
            $("#app").append(this)
            this.style.position = "absolute"
        }
    }

    addGizmo(gizmo){
        
        this.appendChild(gizmo)
        this.gizmos.push(gizmo)
        gizmo.redrag();
        gizmo.setParent(this)

        if(this.previewRef!=null){
            editor.resetHover()
            this.previewRef.addGizmo(gizmo.preview(false))
            
        }
    }

    redrag(){
        if(this.hasRedrag==true)return;
        this.hasRedrag = true;
        
        $(this).on("mousedown",(event)=>{
           // console.log("foepkw")
            let x = event.clientX;
            let y = event.clientY;
           
            //editor.dragging = this;
            $(document).mousemove((event) => {
                //event.originalEvent.cancelBubble = true;
                //console.log(event)

                
                let cx = event.clientX;
                let cy = event.clientY;


                let dist = Math.hypot(cx-x, cy-y);
                if(dist>15 || this.parent==null){
                    $(document).off("mousemove mouseup");
                    if(this.parent!=null && this.isPreview===undefined){
                        this.parent.hover(true)
                    }
                    this.drag("fixed");
                    
                }
                event.preventDefault();
               // event.cancelBubble = true;
                event.stopPropagation();
            });
            $(document).mouseup(()=>{
                $(document).off("mousemove mouseup")
                editor.dragging = null;
                event.stopPropagation();
            });
            event.stopPropagation();
        });
    }

    drag(position = "absolute"){
        document.body.style.cursor = "pointer"
        editor.dragging = this;
        this.style.position = position;
        
        this.style.pointerEvents = "none"
        this.setParent(null);
        let offset = null;
        $(document).mousemove((event)=>{
            if(offset==null){
                //console.log(event.offsetY,event.offsetY)
                event.originalEvent.preventDefault();
                event.originalEvent.stopPropagation();
                
                //console.log(event.originalEvent)
                offset = {
                    x: event.originalEvent.layerX - parseFloat(this.style.left),
                    y: event.originalEvent.layerY - parseFloat(this.style.top)
                }
                //console.log(offset, parseFloat(this.style.left), parseFloat(this.style.top));
                if(isNaN(offset.x)|| isNaN(offset.y)){
                    offset = {x: 0, y: 0}
                }
            }
            
            //console.log(this)
            this.style.left = event.clientX - offset.x;
            this.style.top = event.clientY - offset.y;
            
            this.style.display = "block"; 
            $(this).children().trigger("repaint")
            if(this.selfHook!==undefined){
                this.selfHook.trigger("repaint")
            }
            
        });
        $(document).mouseup((event)=>{
            $(document).off("mousemove mouseup");
            this.style.pointerEvents = null;
            if(editor.hovered != null ){
                editor.hovered.addGizmo(editor.dragging)
                //console.log(this.isPreview);
                if(editor.hovered!=null)editor.hovered.unhover()
                
            }
            document.body.style.cursor = null;
            editor.dragging = false;
            if(this.parent!=null){
                this.style.top = null;
                this.style.left = null;
            }
            this.redrag();
            if(!this.inited){
                this.inited = true;
                this.created();
            }
            event.stopPropagation();
        });
    }
}

class UIGizmo extends Gizmo{
    constructor() {
        super();
        this.blueprint = null;
        $(this).dblclick((e)=>{
            if(this instanceof UIGizmo){
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

    getNotifiers(){
        
        return {
            /*
            "text": {
                get: ()=> this.text.text(),
                set: (value) => this.text.text(value),
                type: "text"
            },*/
            "text": new TextInputNotifier(this.text)
                
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



