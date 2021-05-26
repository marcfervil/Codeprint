
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



class ClickGizmo extends EventGizmo{

    constructor(){
        super("When Clicked");
        this.notifiers.gizmo.onUpdate((gizmo)=>{
            this.gizmo = gizmo;
            //console.log("efwpl")
            this.updatePreview();
        });
        this.notifiers.do.onUpdate((action)=>{
            this.action = action;
            //console.log("efwpl")
            this.updatePreview();
        });
    }

    eventTrigger(self){
        $(self.gizmo.previewRef).click(()=>{
          
           self.notifiers.do.exec()
        })
    }

    updatePreview(){
        if(this.gizmo !== undefined && this.action !== undefined){
            //console.log("both ends!")
            let self = this
           //console.log("grwp[l")
           
            //console.log("target",this.gizmo.previewRef)

            this.notifiers.do.addTrigger(this.eventTrigger, self)
            
        }
    }

    getNotifiers(){
        return {
            "gizmo": new SelfNotifier(),
            "do": new ActionNotifier()
        }
    }


}