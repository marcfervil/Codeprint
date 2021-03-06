class Blueprint extends Gizmo {

    constructor(headingText){
        super();
        this.className = "blueprint"

        this.heading = $("<span/>");
        this.hooks = []
        
        $(this).append(this.heading.text(headingText).addClass("hookBand"))
        
        let input = this.getHookInput()
        let output = this.getHookOutput()
        //input.isHeading = true;
        //soutput.isHeading = true;
        this.heading.prepend(input)
        this.heading.append(output)
       

        this.heading.on("repaint", ()=>{
            $(this.heading).children().trigger("repaint.hook")
        })

        $(this).on("repaint", ()=>{
            
            $(this).children().trigger("repaint.div")
            
        });
        
        setTimeout(()=>{
            
            $(this).children().trigger("repaint.div");
            $(this.heading).children().trigger("repaint.hook");
        },0)

     
    }

    getHookInput(){
        return $("<span/>");
    }

    getHookOutput(){
        return $("<span/>");
    }

    //TODO: for the love of God, just make a hook class
    getHook(notifier, type){
        let hook = $("<span/>").addClass("hook")
        if(type == "input") hook.addClass("in")
        else if(type=="output") hook.addClass("out")
        let svg = $($svg("svg")).attr({
            
            width: 10, 
            height: 10, 
            overflow: "visible",
            space: "preserve",
            
        });
        hook.inputs = []
        hook.outputs = [];
        hook.parent = this;
        hook.notifier = notifier
        hook.index = this.hooks.length;
        
        hook.attr("type", notifier.constructor.name)
        

        let repaint = ()=>{
            //console.log(hook)
            let hookX = (hook[0].getBoundingClientRect().left)+5;
            let hookY = (hook[0].getBoundingClientRect().top )+5;
           
            if(hook.outputs.length>0){
                
                for(let output of hook.outputs){
                    //console.log(output)
                    let xoff = hook.offset().left;
                    let yoff = hook.offset().top;
    
                    let x = (output.hook[0].getBoundingClientRect().left - xoff)+5
                    let y = (output.hook[0].getBoundingClientRect().top - yoff)+5
                    


                    output.path.attr("fill", "none")
                    output.path.attr("stroke-width", "2")
                    output.path.attr("stroke", "#42a7e5")

                    let slope = Math.abs((hookY - (y+yoff)))
                  //  console.log(slope)

                   // console.log(hookY)
                    if(slope > 10){
                        output.path.attr("d",`m 10 5 C 75 0 ${x-75} ${y} ${x-5} ${y}`)
                    }else{
                        output.path.attr("d",`m 10 5 L ${x-5} ${y}`)
                    }
                    

                   //output.path.attr("d",`m 5 5 L ${x} ${y}`)

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
                let hookStyle= {
                    backgroundColor: "white",
                    borderColor: "black"
                }
    
                hook.css(hookStyle)
                remove.hook.css(hookStyle)
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
            
            let hookStyle= {
                backgroundColor: "#42a7e5",
                //borderColor: (hook.isHeading == true) ? "white" : "#42a7e5"
            }

            hook.css(hookStyle)
            input.css(hookStyle)
            hook.trigger("repaint.hook")
            if(!(hook.notifier.isDeferred)){
              //  console.log(hook.notifier);
                //console.log(hook.notifier)
                let hookResult = hook.notifier.get()
                //if() hookResult = hookResult.exec()
                //console.log(hookResult)
                let returnNoteResult = null;
                if(hookResult instanceof ReturnNotifier) {
                    
                    returnNoteResult = hookResult.exec()
                    //console.log("INSTANCEs", retu)
                    if(returnNoteResult==null)return;
                }
                //console.log("HOOK RESULT",(hookResult instanceof ReturnNotifier)? returnNoteResult: hookResult)
               // cc = 
                input.notifier.set(hookResult)

                input.notifier.updateFieldUI((hookResult instanceof ReturnNotifier)? returnNoteResult: hookResult )
                if(hook.notifier.fieldUpdater != null){
                    //console.log("powk")
                    //hook.notifier.fieldUpdater(input.notifier.get())
                    hook.notifier.updateFieldUI(input.notifier.get())
                }
      
                hook.notifier.set(input.notifier.get())
            }
            
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

    get(key){
        return this.notifiers[key].get()
    }

    getNotiferInputField(key, notifier){
        let notifierField = null;
        let div = $("<div/>").addClass("hookBand");
        let input = this.getHook(notifier, "input");
        let output = this.getHook(notifier, "output")
        let showKey = true;
       
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
                        //console.log(savedVal,me.val(),me)
                    }
                },
                attr:{"autocomplete": "off", "spellcheck":"false"},
            }).attr("autocomplete","off").css({
               // float: "right"
            });
        }else if(notifier instanceof OptionNotifier){
            notifierField = $("<select/>", {
                on: {
                    
                    mousedown:(e) =>{
                        this.unhover()
                        e.stopPropagation()
                       // e.select()
                    },
                    change: (e) => {
                        
                        let me = $(e.target);
                        let savedVal = me.find("option:selected").attr('value');
                        
                        me.val("");
                
                        notifier.set(savedVal)
                        //console.log(savedVal,me.val(),me)
                    }
                },
            })
            for(let item of notifier.options){
                notifierField.append($(`<option/>`).val(item).text(item))
            }
           // setTimeout(0, ()=>notifierField.val(notifier.options[0]))
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
        if(notifier.hasInput())div.prepend(input)
        else div.append("<span/>")

        let content = $("<span/>");
        if(showKey)content.append("  "+key+": ")
        content.append(notifierField)

       
        //console.log(output)
        notifier.setHooks(input, output);
        notifier.setField(notifierField)
        div.append(content);

        if(notifier.hasOutput())div.append(output)
        else div.append("<span/>")
        

        div.addClass("blueprintItem").on("repaint.div", ()=>{
            div.children().trigger("repaint.hook")

        })

        div.click((e)=>{
            //e.preventDefault()
            e.stopPropagation();
        })
       // div.append($("<input/>").attr("type","color"))
        div.gizmo = {field: notifierField}
        return div
    }

    hookNotifiers(notifiers, lambda=null){
       
        if(notifiers != undefined && Object.keys(notifiers).length > 0){
            //$(this).append($("<hr>").css({padding:0, margin: 0}))
            this.heading.css({
                "border-bottom": "1px solid #6C757D"
            })
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
        this.uiGizmo = gizmo

         this.heading.addClass("uiHeading");

        this.selfNotifier.set(gizmo)

        this.pos(gizmo.pos().x+gizmo.width()-$("#bp").offset().left, gizmo.pos().y-$("#bp").offset().top)
        
        this.hookNotifiers(this.gizmo.notifiers, (key, notifier)=>{
            notifier.key = key;
            notifier.gizmo = gizmo
        });

       
        $(this).mouseover(this.hover);
        $(this).mouseout(this.unhover);
        $(this).mouseleave(()=>this.hintLocked = false);
        $(this).mousedown(()=>{
            this.unhover();
            this.hintLocked = true;
        });
        $(this).mouseup(()=>{
            //this.hover()
        });
        this.hintLocked = false
        
        this.hoverTime = null
    }

    getHookOutput(){
        this.selfNotifier = new SelfNotifier(this.gizmo);
        this.selfHook = this.getHook(this.selfNotifier, "output");
        return this.selfHook;
    }

    hover(event){
        if(this.gizmo==undefined)return;
        if(this.hintLocked)return;
        this.hoverTime = setTimeout(()=>{
            this.hintLocked = true;
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
        }
    }

}
