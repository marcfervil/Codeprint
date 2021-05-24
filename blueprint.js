class Blueprint extends Gizmo {

    constructor(){
        super();
    }

}


class UIBlueprint extends Blueprint {

    constructor(gizmo){
        super();
        this.gizmo = gizmo;
        this.className = "blueprint"

        $(this).append($("<span/>").text(this.gizmo.constructor.name).addClass("blueprintHeading"))
        $(this).append($("<hr>").css({padding:0, margin: 0}))

        this.pos( parseFloat(gizmo.pos().x)+gizmo.clientWidth+350, gizmo.pos().y)
        this.hookNotifiers();

        $(this).on("repaint", ()=>{
            
            $(this).children().trigger("repaint.div")
            
        })
    }

    getInput(hook){
        let input = $("<span/>").addClass("in")
        let svg = $($svg("svg")).attr({
            
            width: 10, 
            height: 10, 
            overflow: "visible",
            space: "preserve",

        });
        input.hooked = null;
        let path = null;
        input.on("repaint.hook", ()=>{
            
            console.log("im hooked!")
        })
       
       

        $(input).mouseover((e)=>{
            if(editor.hooking!=false && editor.hooking!=input){
                input.css("backgroundColor", "lightgrey")
                editor.hovered = input;
            }
        });
        $(input).mouseout(()=>{

            if(editor.hooking!=false && editor.hooking!=input){
                input.css("backgroundColor", "white");
                editor.hovered = null;
            }
        });

        

        input.mousedown((e) => {

            input.append(svg);
            e.stopPropagation();
            editor.hooking = input;
            path = $($svg("path")).attr("stroke", "black").appendTo(svg)
            
            $(document).on("mousemove.hook", (e) => {
                let xoff = input.offset().left;
                let yoff = input.offset().top;
                path.attr("d",`m 5 5L ${e.clientX-xoff} ${e.clientY-yoff}`)
            });
            $(document).on("mouseup.hook", (e)=>{
                $(document).off(".hook");
                editor.hooking=false;
                if(editor.hovered==null){
                    svg.remove();
                    path.remove();
                }else{
                    input.hooked = editor.hovered
                    input.trigger("repaint.hook")
                }
                editor.hovered = null;
            })
        });
        
        return input
    }

    hookNotifiers(){
        
        for(let key in this.gizmo.notifiers){
            let notifier = this.gizmo.notifiers[key]
            let div = $("<div/>");
            div.append(key+": ")
            div.append($("<input/>", {
                val: notifier.get(),
                prop: {
                    type: "text"
                },
                on: {
                    keypress: function(e) {
                        notifier.set($(e.target).val()+e.key)
                    },
                    keyup: function(e){
                        if(e.keyCode == 8){
                            notifier.set($(e.target).val())
                        } 
                    }
                },
                attr:{
                    "autocomplete": "off"
                }

            }).attr("autocomplete","off"));

            div.append(this.getInput(notifier))
            $(this).append(div.addClass("blueprintItem").on("repaint.div", ()=>{
                div.children().trigger("repaint.hook")
                //console.log("efkpw")

            }))
        }
    }

}
