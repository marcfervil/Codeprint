class Blueprint extends Gizmo {

    constructor(headingText){
        super();
        this.className = "blueprint"

        //console.log('oekwp')

        $(this).append($("<span/>").text(headingText+this.id).addClass("blueprintHeading"))
        $(this).append($("<hr>").css({padding:0, margin: 0}))
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

                   // output.path.attr("d",`m 5 5 q -15 15 30 -15 T ${x+5} ${y+5}`)
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

}


class UIBlueprint extends Blueprint {

    constructor(gizmo){
        super(gizmo.constructor.name);
        this.gizmo = gizmo;
       

        this.pos( parseFloat(gizmo.pos().x)+gizmo.clientWidth+350, gizmo.pos().y)
        this.hookNotifiers();

        $(this).on("repaint", ()=>{
            
            $(this).children().trigger("repaint.div")
            
        })
    }


    hookNotifiers(){
        
        for(let key in this.gizmo.notifiers){
            let notifier = this.gizmo.notifiers[key]
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
            }
            notifier.setHooks(input, output);
            notifier.setField(notifierField)
            div.append(notifierField);

            div.append(output)
            $(this).append(div.addClass("blueprintItem").on("repaint.div", ()=>{
                div.children().trigger("repaint.hook")
            }))
        }
    }

}

class ClickEventGizmo extends Blueprint{

    constructor(){
        super("ClickEvent");
    }


}

