editor = {
    dragging: false,
    hovered: null,
    idNum: 0,
    hooking: false,
    preview: $("#preview")
}

function initGizmos(){
    customElements.define('text-gizmo', TextGizmo);
    customElements.define('button-gizmo', ButtonGizmo);
    customElements.define('view-gizmo', ViewGizmo);
    customElements.define('ui-blueprint-gizmo', UIBlueprint);
    //customElements.define('click-event-gizmo', ClickEventGizmo);
    customElements.define('render-gizmo', RenderGizmo);
}

function initMenu(){

    let menuItems = [
        {name: "View", gizmo: ViewGizmo},
        {name: "Text", gizmo: TextGizmo},
        {name: "Button", gizmo: ButtonGizmo},
       // {name: "ClickEvent", gizmo: ClickEventGizmo}
    ]

    for(let item of menuItems){
        $("#menu-items").append($("<div/>").text(item.name).mousedown(()=>{
            let gizmo = createGizmo(item.gizmo);
            gizmo.style.display = "none"; 
            gizmo.drag();
        }));
    }
}

function createGizmo(gizmoClass, ...args){
    let gizmo = new gizmoClass(...args);
    
    if(gizmo instanceof UIGizmo){
        
        //gizmo.drag();
    }
    

    
    
    $("#app").append(gizmo);
    return gizmo
}

