


class Gizmo extends HTMLElement {
    constructor() {
        super();
        this.gizmos = []
        this.inited = false;
        this.id = editor.idNum++;
        this.hover();
        this.setParent(null);
        if(this.hasChildren()){
            $(this).mouseover(this.hover);
            $(this).mouseout(this.unhover);
        }
    }

    hasChildren(){
        return false;
    }

    created(){
       
    }

    pos(x, y){
       
        this.style.left = x;
        this.style.top = y;
    }

    hover(event){
        
        if(!this.hasChildren() || editor.dragging instanceof UIBlueprint)return;
        if((editor.dragging!=false && editor.dragging!=this )|| event==true){
            this.style.backgroundColor = "lightgrey";
            //if(editor.hovered!=null)editor.hovered.unhover();
            editor.hovered = this;
            if(event!=true)event.stopPropagation();
        }
    }

    unhover(event){
       
       
        if(editor.dragging!=false && editor.dragging!=this){
            this.style.backgroundColor = null;
            editor.hovered = null;

        }
    }

    setParent(gizmo){
        this.parent = gizmo;
        if(gizmo!=null){
            
            this.style.position = "static"
            
            
        }else{
            $("#app").append(this)
            this.style.position = "absolute"
        }
    }

    addGizmo(gizmo){
        //console.log(gizmo==this)
        this.appendChild(gizmo)
        this.gizmos.push(gizmo)
        gizmo.setParent(this)
    }

    redrag(){
        if(this.hasRedrag==true)return;
        this.hasRedrag = true;
        
        $(this).mousedown((event)=>{
           // console.log("foepkw")
            let x = event.clientX;
            let y = event.clientY;
            //editor.dragging = this;
            $(document).mousemove((event) => {
                let cx = event.clientX;
                let cy = event.clientY;
                let dist = Math.hypot(cx-x, cy-y);
                if(dist>15 || this.parent==null){
                    $(document).off("mousemove mouseup");
                    if(this.parent!=null)this.parent.hover(true)
                    this.drag("fixed");
                }
            });
            $(document).mouseup(()=>{
                $(document).off("mousemove mouseup")
                editor.dragging = null;
            });
            event.stopPropagation();
        });
    }

    drag(position = "absolute"){
        document.body.style.cursor = "pointer"
        editor.dragging = this;
        this.style.position = position;
        
        this.style.pointerEvents = "none"
        this.setParent(null)
        $(document).mousemove((event)=>{
            this.style.top = event.clientY;
            this.style.left = event.clientX;
            this.style.display = "block"; 
            
        });
        $(document).mouseup((event)=>{
            $(document).off("mousemove mouseup");
            this.style.pointerEvents = null;
            if(editor.hovered != null ){
                editor.hovered.addGizmo(editor.dragging)
                editor.hovered.unhover()
               
            }
            document.body.style.cursor = null;
            editor.dragging = false;
            this.redrag();
            if(!this.inited){
                this.inited = true;
                this.created();
            }
        });
    }
}

class UIGizmo extends Gizmo{
    constructor() {
        super();
        this.blueprint = null;
        $(this).dblclick(()=>{
            if(this instanceof UIGizmo){
                this.blueprint = this.createBlueprint();
                $(this).off("dblclick")
            }
        });
    }

    createBlueprint(){
        return createGizmo(UIBlueprint, this);
    }
}

function initGizmos(){
    customElements.define('text-gizmo', TextGizmo);
    customElements.define('button-gizmo', ButtonGizmo);
    customElements.define('view-gizmo', ViewGizmo);
    customElements.define('ui-blueprint-gizmo', UIBlueprint);
}



class TextGizmo extends UIGizmo{
    constructor() {
        super();
        this.text = $(this).text("placeholder");
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
        this.parent = gizmo;
        if(gizmo!=null){
            this.style.width = null;
            this.style.minHeight = "100px";
            //this.style.height = "100%";
            
        }else{
            this.style.width = "20%";
            this.style.minHeight = "50%";
        }
    }
}

class ButtonGizmo extends UIGizmo{
    constructor() {
        super();
        this.button = $(this).append($("<button/>").text("Click me!"))
    }
}



