class Blueprint extends Gizmo {

    constructor(headingText){
        super();
        this.className = "blueprint"

        this.heading = $("<span/>");
        
        
        $(this).append(this.heading.text(headingText).addClass("blueprintHeading"))
        $(this).append($("<hr>").css({padding:0, margin: 0}))

        

        $(this).on("repaint", ()=>{
            
            $(this).children().trigger("repaint.div")
            
        });

        
    }

    //TODO: just make hook class
    getHook(notifier, type){
        let hook = $("<span/>").addClass("in")
        let svg = $($svg("svg")).attr({
            
            width: 10, 
            height: 10, 
            overflow: "visible",
            space: "preserve",

        });
        hook.inputs = []
        hook.outputs = [];
        hook.notifier = notifier
        
        

        let repaint = ()=>{
           // console.log(input.hooked, input.hooks)
            if(hook.outputs.length>0){
                
                for(let output of hook.outputs){
                    //console.log(output)
                    let xoff = hook.offset().left;
                    let yoff = hook.offset().top;
    
                    let x = output.hook[0].getBoundingClientRect().left - xoff
                    let y = output.hook[0].getBoundingClientRect().top - yoff
                    
                    
                   output.path.attr("d",`m 5 5L ${x+5} ${y+5}`)

                   // output.path.attr("d",`m 5 5 q -15 15 30 -15 T ${x+5} ${y+5}`)
                }
               
            }
            
            
            if(hook.inputs.length > 0){
                
                
                for(let input of hook.inputs){
                    //console.log(input.length)
                    input.trigger("repaint.hook");
                    input.trigger("repaint.div");
                }
            }
        }


        hook.on("repaint.hook", repaint);

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
            $(svg).click((e)=>{
                console.log("fewok")
                $(e).target.remove();
            })
            hook.css("pointerEvents", "none")
            //console.log("okprw")
            $(document).on("mousemove.hook", (e) => {
                let xoff = hook.offset().left;
                let yoff = hook.offset().top;
                path.attr("fill","transparent")
                path.attr("d",`m 5 5L ${e.clientX-xoff} ${e.clientY-yoff}`)
            });
            $(document).on("mouseup.hook", (e) => {
                $(document).off(".hook");
                hook.css("pointerEvents", "")
                editor.hooking=false;
                if(editor.hovered==null){
                    path.remove();
                    path = null;
                }else{
                    hook.outputs.push({hook: editor.hovered, path: path})
                    editor.hovered.inputs.push(hook);
                    editor.hovered.notifier.set(hook.notifier.get())
                    editor.hovered.notifier.updateField(hook.notifier.get())
                    path = null;
                    hook.trigger("repaint.hook")
                    editor.hovered.css("backgroundColor", "white")
                }

                
                editor.hovered = null;
            })
        });
        
        return hook
    }

    hookNotifiers(notifiers){
        
        for(let key in notifiers){
            let notifier = notifiers[key]
            let div = $("<div/>");
            let input = this.getHook(notifier, "input");
            let output = this.getHook(notifier, "output")
            div.append(input)
            div.append("  "+key+": ")

            let notifierField = null;

            if(notifier instanceof TextInputNotifier){
                notifierField = $("<input/>", {
                    val: notifier.get(),
                    prop: {type: "text"},
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
                    attr:{"autocomplete": "off", "spellcheck":"false"},
                }).attr("autocomplete","off");
            }else if(notifier instanceof SelfNotifier){
                notifierField = $("<span/>").text("nothing").addClass("italic");
            }
            notifier.setHooks(input, output);
            notifier.setField(notifierField)
            div.append(notifierField);

            if(notifier.hasOutput())div.append(output)
            $(this).append(div.addClass("blueprintItem").on("repaint.div", ()=>{
                div.children().trigger("repaint.hook")
                if(this.selfHook!==undefined){
                    this.selfHook.trigger("repaint.hook")
                }
            }))
        }
    }


}


class UIBlueprint extends Blueprint {

    constructor(gizmo){
        super(" "+gizmo.constructor.name+editor.idNum);
        this.gizmo = gizmo;
       

        this.pos( parseFloat(gizmo.pos().x)+gizmo.clientWidth+350, gizmo.pos().y)
        
        this.hookNotifiers(this.gizmo.notifiers);

        this.selfNotifier = new SelfNotifier(gizmo);
        this.selfHook = this.getHook(this.selfNotifier, "output");
        this.heading.append(this.selfHook.css({
            "float": "right",
            "margin": "5px",
            "marginBottom": "0px"
        }))
    }

}

class EventGizmo extends Blueprint{

    constructor(name){
        super(name);
        this.notifiers = this.getNotifiers()
        this.hookNotifiers(this.notifiers);
    }

    getNotifiers(){
        
    }

}

class RenderGizmo extends EventGizmo{

    constructor(){
        super("OnStart");
        this.notifiers.render.onUpdate(this.updatePreview);
        
    }

    updatePreview(gizmo){
        
        editor.preview[0].appendChild(gizmo.preview())
    }

    getNotifiers(){
        return {
            "render": new SelfNotifier()
        }
    }


}