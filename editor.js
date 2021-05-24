editor = {
    dragging: false,
    hovered: null,
    idNum: 0
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

function createGizmo(gizmoClass, ...args){
    let gizmo = new gizmoClass(...args);
    
    if(gizmo instanceof UIGizmo){
        gizmo.style.display = "none"; 
        gizmo.drag();
    }else{
        gizmo.redrag();
    }
    

    
    
    $("#app").append(gizmo);
}

