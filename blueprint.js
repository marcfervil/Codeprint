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
        $(this).mouseover(this.hover);
        $(this).mouseout(this.unhover);
    }

   

    hover(event){

        if(editor.dragging!=false && editor.dragging!=this){
            console.log("hover", this.id)
            this.style.backgroundColor = "lightgrey";
            if(editor.hovered!=null)editor.hovered.unhover();
            editor.hovered = this;
            event.stopPropagation();
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
            this.style.width = null;
            this.style.minHeight = "100px";
            this.style.height = "100%";
            
        }else{
            this.style.width = "20%";
            this.style.minHeight = "50%";
        }
    }

    addGizmo(gizmo){
        //console.log(gizmo==this)
        this.appendChild(gizmo)
        this.gizmos.push(gizmo)
        gizmo.setParent(this)
    }

    drag(){
        editor.dragging = this;
        this.style.position = "absolute";
        this.style.display = "none"; 
        this.style.pointerEvents = "none"
        $(document).mousemove((event)=>{
            this.style.top = event.clientY;
            this.style.left = event.clientX;
            this.style.display = "block"; 
            
        });
        $(document).mouseup((event)=>{
            $(document).off("mousemove");
            this.style.pointerEvents = null;
            if(editor.hovered != null){
                //console.log(editor.hovered.id, editor.dragging.id)
                editor.hovered.addGizmo(editor.dragging)
                editor.hovered.unhover()
            }
            editor.dragging = false;
        });
    }
}

class TextGizmo extends Gizmo{
    constructor() {
        super();
    }
}

class ViewGizmo extends Gizmo{
    constructor() {
        super();
        this.className = "page"
    }
}

class ButtonGizmo extends Gizmo{
    constructor() {
        super();

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