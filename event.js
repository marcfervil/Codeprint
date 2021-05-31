
class EventGizmo extends Blueprint{

    constructor(name){
        super(name);
        this.notifiers = this.getNotifiers()
        this.hookResults = {}
        
        this.hookNotifiers(this.notifiers, (key, notifier)=>{
            notifier.onUpdate((result)=>{
                if(result!==undefined && result!==null){
                    this.hookResults[key] = result
                    if(Object.keys(this.hookResults).length==Object.keys(this.notifiers).length){
                        this.updatePreview();
                    }
                }
                
            });
            notifier.onReset(()=>{
                //console.log("reset")
               
                this.onUnhooked();
                delete this.hookResults[key];
            });
        });
        
    }

    onUnhooked(){
        
    }

    getNotifiers(){
        
    }

    updatePreview(){
        this.notifiers.do.addTrigger(this.eventTrigger, this)
    }

}



class StartGizmo extends EventGizmo{

    constructor(){
        super("OnStart");
        this.notifiers.render.onUpdate(this.updatePreview);
        
    }



    onUnhooked(){
        
        
    }

    updatePreview(gizmo){
        
        
        editor.preview.empty()
        if(gizmo!=null && gizmo!=undefined){
            editor.preview[0].appendChild(gizmo.preview())
        }
    }

    getNotifiers(){
        return {
            "render": new SelfNotifier()
        }
    }


}

class RightNowGizmo extends EventGizmo{
    constructor(){
        super("RIGHTNOW");
    
    }

    eventTrigger(self){
        self.hookResults.do()
        
    }


    getNotifiers(){
        return {
            "do": new ActionNotifier()
        }
    }

}

class ClickGizmo extends EventGizmo{

    constructor(){
        super("When Clicked");
    
    }

    onUnhooked(){
        //this.notifiers.do.reset();
        if(this.hookResults.gizmo!==undefined){
            $(this.hookResults.gizmo.previewRef).off(".gizmo");
        }
        //console.log(this.hookResults.gizmo.previewRef)
    }

    eventTrigger(self){
        $(self.hookResults.gizmo.previewRef).on("click.gizmo",()=>{
            self.notifiers.do.exec()
        })
    
    }


    getNotifiers(){
        return {
            "gizmo": new SelfNotifier(),
            "do": new ActionNotifier()
        }
    }


}