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

    getInput(hookData){
        let hook = $("<span/>").addClass("in")
        let svg = $($svg("svg")).attr({
            
            width: 10, 
            height: 10, 
            overflow: "visible",
            space: "preserve",

        });
        hook.inputs = []
        hook.outputs = [];
       
        hook.on("repaint.hook", ()=>{
           // console.log(input.hooked, input.hooks)
            if(hook.outputs.length>0){
                
                for(let output of hook.outputs){
                    //console.log(output)
                    let xoff = hook.offset().left;
                    let yoff = hook.offset().top;
    
                    let x = output.hook[0].getBoundingClientRect().left - xoff
                    let y = output.hook[0].getBoundingClientRect().top - yoff
                    
                    
                    output.path.attr("d",`m 5 5L ${x+5} ${y+5}`)
                }
               
            }
            
            
            if(hook.inputs.length > 0){
                
                
                for(let input of hook.inputs){
                    //console.log(input.length)
                    input.trigger("repaint.hook");
                    
                }
            }
        })
       
       

        $(hook).mouseover((e)=>{
            if(editor.hooking!=false && editor.hooking!=hook){
                hook.css("backgroundColor", "lightgrey")
                editor.hovered = hook;
            }
        });
        $(hook).mouseout(()=>{

            if(editor.hooking!=false && editor.hooking!=hook){
                hook.css("backgroundColor", "white");
                editor.hovered = null;
            }
        });

        

        hook.mousedown((e) => {

            hook.append(svg);
            e.stopPropagation();
            editor.hooking = hook;
            let path = $($svg("path")).attr("stroke", "black").appendTo(svg)
            hook.css("pointerEvents", "none")
            //console.log("okprw")
            $(document).on("mousemove.hook", (e) => {
                let xoff = hook.offset().left;
                let yoff = hook.offset().top;

                path.attr("d",`m 5 5L ${e.clientX-xoff} ${e.clientY-yoff}`)
            });
            $(document).on("mouseup.hook", (e)=>{
                $(document).off(".hook");
                hook.css("pointerEvents", "")
                editor.hooking=false;
                if(editor.hovered==null){
                    //svg.remove();
                    path.remove();
                    path = null;
                }else{
                    hook.outputs.push({hook: editor.hovered, path: path})
                    editor.hovered.inputs.push(hook);
                    path = null;
                    //console.log(editor.hovered.hooks)

                    hook.trigger("repaint.hook")
                    //editor.hovered.remove();
                    editor.hovered.css("backgroundColor", "white")
                }

                
                editor.hovered = null;
            })
        });
        
        return hook
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
