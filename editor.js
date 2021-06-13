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

    customElements.define('change-value-gizmo2', ChangeValue2);

    customElements.define('render-gizmo', RenderGizmo);
    customElements.define('right-now-gizmo', RightNowGizmo);
    customElements.define('text-box-gizmo', TextBoxGizmo);
    customElements.define('if-gizmo', IfGizmo);
    
    customElements.define('typed-gizmo', TypedGizmo);

    customElements.define('list-gizmo', ListGizmo);
    customElements.define('get-list-item-gizmo', GetListItem);

    
    customElements.define('ui-shelf', UIShelf);
    
    customElements.define('zen-shelf', ZenShelf);
    
}

function initMenu(){

    let menuItems = [
        {name: "View", gizmo: ViewGizmo, catagory: "gizmo"},
        {name: "Text", gizmo: TextGizmo , catagory: "gizmo"},
        {name: "Button", gizmo: ButtonGizmo, catagory: "gizmo"},
        {name: "Text Box", gizmo: TextBoxGizmo, catagory: "gizmo"},

        {name: "When Clicked", gizmo: ClickGizmo, catagory: "event"},
        {name: "When Typed", gizmo: TypedGizmo, catagory: "event"},

        

        {name: "If", gizmo: IfGizmo, catagory: "action"},
        {name: "Change Value2", gizmo: ChangeValue2, catagory: "action"},
        {name: "Log", gizmo: LogGizmo, catagory: "action"},
        {name: "Popup", gizmo: PopupGizmo, catagory: "action"},
        {name: "Change Value", gizmo: ChangeValue, catagory: "action"},
        {name: "Show Gizmo", gizmo: RenderGizmo, catagory: "action"},
       
        {name: "List", gizmo: ListGizmo, catagory: "data"},
        {name: "Get List Item", gizmo: GetListItem, catagory: "data"},
    ]

    for(let item of menuItems){
        //gizmo-menu-drawer
        //$("#menu-items").append(
        let menuItem = ($("<span/>").text(item.name).mousedown((e)=>{
            let gizmo = createGizmo(item.gizmo);
            gizmo.style.display = "none"; 
            gizmo.style.zIndex = 5;
            gizmo.drag();
            gizmo.pos(e.clientX-$("#bp").offset().left, e.clientY-$("#bp").offset().top)
           // setTimeout(()=>{
                
           // },1000)   
           //if()
            
        }));
        if(item.catagory!=undefined){
            $(`#${item.catagory}-menu-drawer`).append(menuItem)
        }else{
            $("#menu-items").append(menuItem)
        }
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


 class UIShelf extends HTMLElement {
    constructor(text){
        super();
        if(text==undefined){
            text = $(this).attr("text")
        }
        this.expanded = false;
        
        //console.log( $(this).contents())

        this.contents = $("<div/>").appendTo($(this));
        //console.log(this.contents)
        //$(this).css("display", "block")
        this.contents.css("padding-left", "30px")

        this.symbol = $("<span/>").css({"paddingRight": "5px", "fontSize":".8em"}).html("&#x25B6;")
        
       
        $(this).prepend($("<span>").css({"fontStyle": "italic"}).text(text))
        $(this).prepend(this.symbol)
        $(this).click(this.onClick);
        this.contents.hide()
    }

    appendChild(child){
        if(isEmpty($(this))) return super.appendChild(child)
        
        this.contents.append(child)
        if(this.newLine != false)
        this.contents.append($("<br/>"))
    }

    onClick(event){
        this.expanded = !this.expanded
        if(this.expanded){
            this.symbol.html("&#x25BC;")
            this.contents.show();
        }else{
            this.symbol.html("&#x25B6;")
            this.contents.hide()
        }
        //ths
    }

 }


 class ZenShelf extends HTMLElement {
    constructor(text){
        super();
        if(text==undefined){
            text = $(this).attr("text")
        }
        this.expanded = false;
        
        //console.log( $(this).contents())

        this.contents = $("<div/>").appendTo($(this));
        //console.log(this.contents)
        //$(this).css("display", "block")
        
        this.contents.css("padding-left", "30px").addClass("content")

        this.symbol = $("<i/>").addClass("fas fa-chevron-right").css({"paddingRight": "5px", "fontSize":".8em"})
        this.symbol.css("paddingRight","5px")
        

        this.heading = $("<span>").addClass("heading").html(`${text}`);
        $(this).prepend(this.heading)
        
        $(this.heading).prepend(this.symbol)
        $(this).click(this.onClick);
        this.contents.hide()
    }

    appendChild(child){
        if(isEmpty($(this))) return super.appendChild(child)
        
        this.contents.append(child)
        if(this.newLine != false)
        this.contents.append($("<br/>"))
    }

    onClick(event){
        this.expanded = !this.expanded
        if(this.expanded){
            this.symbol.removeClass("fa-chevron-right")
            this.symbol.addClass("fa-chevron-down")
            //this.symbol.addClass("fa-rotate-90")
            this.contents.show();
        }else{
            this.symbol.removeClass("fa-chevron-down")
            this.symbol.addClass("fa-chevron-right")
            
            this.contents.hide()
        }
        //ths
    }

 }

function createGizmo(gizmoClass, ...args){
    let gizmo = new gizmoClass(...args);
    
    if(gizmo instanceof UIGizmo){
        
        //gizmo.drag();
    }
    

    
    
    $("#bp").append(gizmo);
    return gizmo
}

