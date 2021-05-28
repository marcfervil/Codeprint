
class EventGizmo extends Blueprint{

    constructor(name){
        super(name);
        this.notifiers = this.getNotifiers()
        this.hookResults = {}
        
        this.hookNotifiers(this.notifiers, (key, notifier)=>{
            notifier.onUpdate((result)=>{
                
                this.hookResults[key] = result
                if(Object.keys(this.hookResults).length==Object.keys(this.notifiers).length){
                    this.updatePreview();
                }
                
            });
        });
        
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

    eventTrigger(self){
        
        $(self.hookResults.gizmo.previewRef).click(()=>{
            //console.log(self.notifiers.do)
            //self.hookResults.do()
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