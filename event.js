
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



class ClickGizmo extends EventGizmo{

    constructor(){
        super("When Clicked");
    
    }

    eventTrigger(self){
        
        $(self.hookResults.gizmo.previewRef).click(()=>{
            self.hookResults.do()
        })
    }


    getNotifiers(){
        return {
            "gizmo": new SelfNotifier(),
            "do": new ActionNotifier()
        }
    }


}