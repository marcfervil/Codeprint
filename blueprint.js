editor = {
    dragging: false,
    hovered: null,
    idNum: 0
}

class Gizmo extends HTMLElement {
    constructor() {
        super();
        this.gizmos = []
        
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

    hover(event){
        
        if(!this.hasChildren())return;
        if((editor.dragging!=false && editor.dragging!=this )|| event==true){
            this.style.backgroundColor = "lightgrey";
            //if(editor.hovered!=null)editor.hovered.unhover();
            editor.hovered = this;
            if(event!=true)event.stopPropagation();
        }
    }

    unhover(event){
       
        console.log("unhoverrr")
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
            $(document).mouseup(()=>$(document).off("mousemove mouseup"));
            event.stopPropagation();
        });
    }

    drag(position = "absolute"){
        document.body.style.cursor = "pointer"
        editor.dragging = this;
        this.style.position = position;
        this.style.display = "none"; 
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
            if(editor.hovered != null){
                editor.hovered.addGizmo(editor.dragging)
                editor.hovered.unhover()
               
            }
            document.body.style.cursor = null;
            editor.dragging = false;
            this.redrag()
        });
    }
}

class TextGizmo extends Gizmo{
    constructor() {
        super();
        this.text = $(this).text("placeholder");
    }
    
}

class ViewGizmo extends Gizmo{
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

class ButtonGizmo extends Gizmo{
    constructor() {
        super();
        this.button = $(this).append($("<button/>").text("Click me!"))
    }
}


function createGizmo(gizmoClass){
    let gizmo = new gizmoClass();
    gizmo.drag();
    $("#app").append(gizmo);
}

function initMenu(){

    let menuItems = [
        {name: "View", gizmo: ViewGizmo},
        {name: "Text", gizmo: TextGizmo},
        {name: "Button", gizmo: ButtonGizmo}
    ]

    for(let item of menuItems){
        $("#menu-items").append($("<div/>").text(item.name).mousedown(()=>{
            createGizmo(item.gizmo);
        }));
    }
}

function initGizmos(){
    customElements.define('text-gizmo', TextGizmo);
    customElements.define('button-gizmo', ButtonGizmo);
    customElements.define('view-gizmo', ViewGizmo);
}

initGizmos()
initMenu()