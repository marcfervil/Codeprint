editor = {
    dragging: false,
    hovered: null,
    idNum: 0,
    hooking: false,
    preview: $("#preview"),
    panning: false,
    pan: {
        x: 0,
        y: 0
    },
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
    customElements.define('text-box-gizmo', TextBoxGizmo);

    customElements.define('if-gizmo', IfGizmo);
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
        {name: "Show Gizmo", gizmo: RenderGizmo},
        {name: "Text Box", gizmo: TextBoxGizmo},
        {name: "If", gizmo: IfGizmo}
    ]

    for(let item of menuItems){
        $("#menu-items").append($("<div/>").text(item.name).mousedown((e)=>{
            let gizmo = createGizmo(item.gizmo);
            gizmo.style.display = "none"; 
            gizmo.style.zIndex = 5;
            gizmo.drag();
            gizmo.pos(e.clientX-$("#bp").offset().left, e.clientY-$("#bp").offset().top)
           // setTimeout(()=>{
                
           // },1000)   
            
        }));
    }
}

$("#bparea").mousedown((e)=>{
   
    if(e.button==2){
        editor.pan.x = e.clientX
        editor.pan.y = e.clientY
        editor.panning = true;

        px = $("#bp").offset().left
        py = $("#bp").offset().top
    }
});

$("#bparea").mouseup((e)=>{

    if(e.button==2){
        editor.panning = false;
    }
});

$("#bparea").mousemove((e)=>{
    if(editor.panning){
        //console.log({left:editor.pan.x-e.clientX, top:editor.pan.y-e.clientY})
       

        $("#bp").offset({left:px + (e.clientX - editor.pan.x) , top: py+(e.clientY-editor.pan.y)})
    }
})

document.addEventListener("wheel",(e)=> {
            
    e.preventDefault();

     

     if(e.ctrlKey){
        //zoom
     }else{
       
        $("#bp").offset({left: $("#bp").offset().left-e.deltaX, top: $("#bp").offset().top-e.deltaY})
     }

    
 }, {passive: false});


function createGizmo(gizmoClass, ...args){
    let gizmo = new gizmoClass(...args);
    
    if(gizmo instanceof UIGizmo){
        
        //gizmo.drag();
    }
    

    
    
    $("#bp").append(gizmo);
    return gizmo
}

