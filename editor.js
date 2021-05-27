editor = {
    dragging: false,
    hovered: null,
    idNum: 0,
    hooking: false,
    preview: $("#preview"),
    resetHover: () => {
        editor.hovered.unhover()
        editor.hovered = null;
        editor.dragging = false;
    }
}

function initGizmos(){
    customElements.define('text-gizmo', TextGizmo);
    customElements.define('button-gizmo', ButtonGizmo);
    customElements.define('view-gizmo', ViewGizmo);
    customElements.define('ui-blueprint-gizmo', UIBlueprint);
    customElements.define('click-event-gizmo', ClickGizmo);
    customElements.define('start-gizmo', StartGizmo);
   
    customElements.define('log-gizmo', LogGizmo);
    customElements.define('popup-gizmo', PopupGizmo);
    customElements.define('change-value-gizmo', ChangeValue);
    customElements.define('render-gizmo', RenderGizmo);
    customElements.define('right-now-gizmo', RightNowGizmo);
}

function initMenu(){

    let menuItems = [
        {name: "View", gizmo: ViewGizmo},
        {name: "Text", gizmo: TextGizmo},
        {name: "Button", gizmo: ButtonGizmo},
        {name: "When Clicked", gizmo: ClickGizmo},
        {name: "Log", gizmo: LogGizmo},
        {name: "Popup", gizmo: PopupGizmo},
        {name: "Change Value", gizmo: ChangeValue},
        {name: "Show Gizmo", gizmo: RenderGizmo}
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

