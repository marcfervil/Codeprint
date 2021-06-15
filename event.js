
class EventGizmo extends Blueprint{

    constructor(name){
        super(name);
        this.notifiers = this.getNotifiers()
        this.hookResults = {}
        
        this.hookNotifiers(this.notifiers, (key, notifier)=>{
            notifier.onUpdate((result)=>{
                //console.log("foewk")
                if(result!==undefined && result!==null){
                    this.hookResults[key] = result
                    if(Object.keys(this.hookResults).length==Object.keys(this.notifiers).length){
                        this.updatePreview();
                        console.log("updating thing")
                    }
                }
                
            });
            notifier.onReset(()=>{
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
        
        
        editor.preview.children().detach()
        if(gizmo!=null && gizmo!=undefined){
            editor.preview[0].appendChild(gizmo.getPreview())
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
        this.remove  = (target)=> this.eventTrigger(this, target)
    }

    onUnhooked(){
        if(this.hookResults.gizmo!==undefined){
            $(this.hookResults.gizmo.previewRef).off(".gizmo");
        }
    }

    eventTrigger(self, target=self.hookResults.gizmo.previewRef){
        //console.log("EVENT TRIGGERED", target, target.id)
        if(target==null){
            if(self.hookResults.gizmo.onPreviewed.indexOf(self.remove)==-1){
                self.hookResults.gizmo.onPreviewed.push(self.remove);
            }
        }else{
            $(target).on("click.gizmo",()=>{
                self.notifiers.do.exec()
            })
            
        }
    }


    getNotifiers(){
        return {
            "gizmo": new SelfNotifier(),
            "do": new ActionNotifier()
        }
    }


}

class TypedGizmo extends EventGizmo{

    constructor(){
        super("When Typed");
        this.remove = (target)=> this.eventTrigger(this, target)
    }

    onUnhooked(){
        if(this.hookResults.gizmo!==undefined){
            $(this.hookResults.gizmo.previewRef).off(".gizmo");   
        }
    }

    eventTrigger(self, target=self.hookResults.gizmo.previewRef){

        if(target==null){
            if(self.hookResults.gizmo.onPreviewed.indexOf(self.remove)==-1){
                self.hookResults.gizmo.onPreviewed.push(self.remove);
            }
        }else{
            $(target).on("input.gizmo",()=>{
                self.notifiers.do.exec()
            });
            
        }
    }


    getNotifiers(){
        return {
            "gizmo": new SelfNotifier(),
            "do": new ActionNotifier()
        }
    }


}