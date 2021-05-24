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

        $(this).append($("<span/>").text(this.gizmo.constructor.name))
        $(this).append($("<hr>").css({padding:0, margin: 0}))

        this.pos( parseFloat(gizmo.pos().x)+gizmo.clientWidth+350, gizmo.pos().y)
        this.hookNotifiers();
    }

    hookNotifiers(){
        
        for(let key in this.gizmo.notifiers){
            let notifier = this.gizmo.notifiers[key]
            $(document.createTextNode(key+": ")).appendTo($(this));
            $(this).append($("<input/>", {
                val: notifier.get(),
                prop: {
                    type: "text"
                },
                on:{
                    keypress: (e) => notifier.set($(e.target).val())
                }

            }));
             
        }
    }

}

//console.log(TextGizmo instanceof Blueprint);