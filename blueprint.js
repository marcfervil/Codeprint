class Blueprint extends Gizmo {

    constructor(headingText){
        super();
        this.className = "blueprint"

        this.heading = $("<span/>");
        this.hooks = []
        
        $(this).append(this.heading.text(headingText).addClass("blueprintHeading"))
        

        this.heading.on("repaint", ()=>{
            $(this.heading).children().trigger("repaint.hook")
        })

        $(this).on("repaint", ()=>{
            
            $(this).children().trigger("repaint.div")
            
        });

        
    }

    //TODO: for the love of God, just make a hook class
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
        
        hook.attr("type", notifier.constructor.name)
        

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

        hook.unhook = (output) => {
            let remove = hook.outputs.find(out => out.hook == output);
            
            if(remove!=undefined){
               // console.log("rr", remove)
             //   console.log("unhooking ",remove.hook.notifier.constructor.name)
                remove.path.remove();
                remove.hook.notifier.reset();
                //remove.hook.notifier.onUnhooked();
                hook.outputs.splice(hook.outputs.indexOf(remove), 1)
            }else{
                //console.log("couldnt find ",output)
            }
        }   

        hook.hook = (input, path) => {
            if(path==undefined) path= $($svg("path")).attr("stroke", "black").appendTo(svg)
            
            hook.outputs.push({hook: input, path: path})
            input.inputs.push(hook);
            
            if(!(hook.notifier.isDeferred)){
                //console.log(hook.notifier)
                input.notifier.set(hook.notifier.get())
                input.notifier.updateField(hook.notifier.get())
                if(hook.notifier.fieldUpdater != null){
                    //console.log("powk")
                    hook.notifier.fieldUpdater(input.notifier.get())
                }
      
                hook.notifier.set(input.notifier.get())
            }

            hook.trigger("repaint.hook")
            
            input.css("backgroundColor", "white")
        }

        hook.append(svg);
        hook.mousedown((e) => {

            
            e.stopPropagation();
            if(e.which==1){
           
                editor.hooking = hook;
                let path= $($svg("path")).attr("stroke", "black").appendTo(svg)
                $(svg).click((e)=>{
                    //console.log("fewok")
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
                        
                        hook.hook(editor.hovered, path)
                        path = null;
                    }

                    
                    editor.hovered = null;
                })
            }else if(e.which==3){
                
               //console.log("","inputs:", hook.inputs.length, "outputs:",hook.outputs.length)
                
                //hook.notifier.reset();
                //console.log("clicked",hook.notifier.constructor.name)

                hook.notifier.onUnhooked();
                for(let input of hook.inputs){
                    //input.notifier.onUnhooked();
                    input.unhook(hook)
                    input.notifier.reset()
                    //hook.unhook(input)
                    //hook.unhook(input)
                }   

                while(hook.outputs.length>0){
                    //output.hook.notifier.onUnhooked();
                    let output = hook.outputs[0];
                    hook.unhook(output.hook)
                    
                    //output.hook.unhook(hook)
                }
      
                hook.inputs = []
                //hook.outputs = []
                //console.log("finished","inputs:", hook.inputs.length, "outputs:",hook.outputs.length)
            }
        });
        this.hooks.push(hook)
        return hook
    }

    getNotiferInputField(key, notifier){
        let notifierField = null;
        let div = $("<div/>");
        let input = this.getHook(notifier, "input");
        let output = this.getHook(notifier, "output")
        let showKey = true;
        if(notifier.hasOutput())div.append(output.css("float","right"))
        if(notifier instanceof TextInputNotifier || notifier instanceof StringNotifier || notifier instanceof UINotifier ){
            notifierField = $("<input/>", {
                
                
                val: notifier.get(),
                prop: {type: "text"},
                on: {
                    
                    mousedown:(e) =>{
                        this.unhover()
                        e.stopPropagation()
                       // e.select()
                    },
                    input: (e) => {
                        
                        let me = $(e.target);
                        let savedVal = me.val();
                        
                        me.val("");
                
                        notifier.set(savedVal)
                    }
                },
                attr:{"autocomplete": "off", "spellcheck":"false"},
            }).attr("autocomplete","off").css({
                float: "right"
            });
        }else if(notifier instanceof SelfNotifier){
            
            notifierField = $("<span/>").text("nothing").addClass("italic");

        }else if(notifier instanceof AggregateNotifier){
            notifierField = $(new UIShelf(key))
            notifierField[0].newLine = false;
            showKey = false
            let subNotifiers = notifier.get()
            for(let notifierKey in subNotifiers){
                let subNotifier = subNotifiers[notifierKey];
                notifierField.append(this.getNotiferInputField(notifierKey, subNotifier))
            }
            //notifierField.attr("wow", "eee")
            div.css("paddingRight", "0px")
           
        }
        //output.css("float","right")
        if(notifier.hasInput())div.append(input)
        if(showKey)div.append("  "+key+": ")

        notifier.setHooks(input, output);
        notifier.setField(notifierField)
        div.append(notifierField);
        

        div.addClass("blueprintItem").on("repaint.div", ()=>{
            div.children().trigger("repaint.hook")

        })

        div.click((e)=>{
            //e.preventDefault()
            e.stopPropagation();
        })
       // div.append($("<input/>").attr("type","color"))
        return div
    }

    hookNotifiers(notifiers, lambda=null){
       
        if(notifiers != undefined && Object.keys(notifiers).length > 0){
            $(this).append($("<hr>").css({padding:0, margin: 0}))
        }
        for(let key in notifiers){
            let notifier = notifiers[key]
            if(lambda!=null)lambda(key, notifier)
            
            let notifierField = this.getNotiferInputField(key, notifier);

            
            $(this).append(notifierField)
        }
        //$(this).append($("<input/>").attr("type","color"))
    }


}


class UIBlueprint extends Blueprint {

    constructor(gizmo){
        super(" "+gizmo.constructor.name+editor.idNum);
        this.gizmo = gizmo;
       

        this.pos(gizmo.pos().x+gizmo.width()-$("#bp").offset().left, gizmo.pos().y-$("#bp").offset().top)
        
        this.hookNotifiers(this.gizmo.notifiers, (key, notifier)=>{
            notifier.key = key;
            notifier.gizmo = gizmo
        });

        this.selfNotifier = new SelfNotifier(gizmo);
        this.selfHook = this.getHook(this.selfNotifier, "output");
        this.heading.append(this.selfHook.css({
            "float": "right",
            "margin": "5px",
            "marginBottom": "0px"
        }))
        $(this).mouseover(this.hover);
        $(this).mouseout(this.unhover);
        $(this).mouseup(()=>{
            this.hover()
        });
        
        
        this.hoverTime = null
    }

    hover(event){
        if(this.gizmo==undefined)return
        this.hoverTime = setTimeout(()=>{
            this.ogOutline = this.gizmo.style.outline;
            this.gizmo.style.outline = "2px dashed blue"
            //this.gizmo.style.outlineOffset = "3px"
            
            if(this.gizmo.hasPreview){
                this.gizmo.previewRef.style.outline = "2px dashed blue"
                //this.gizmo.previewRef.style.outlineOffset = "3px"
            }
        },500)
    }

    unhover(event){
        if(this.hoverTime!=null){
            clearTimeout(this.hoverTime);
            this.hoverTime = null;
            this.gizmo.style.outline = this.ogOutline
            if(this.gizmo.hasPreview)this.gizmo.previewRef.style.outline = this.ogOutline
        }else{
            
        }
       

    }

}
