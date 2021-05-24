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

        $(this).append($("<span/>").text(this.gizmo.constructor.name).addClass("blueprintHeading"))
        $(this).append($("<hr>").css({padding:0, margin: 0}))

        this.pos( parseFloat(gizmo.pos().x)+gizmo.clientWidth+350, gizmo.pos().y)
        this.hookNotifiers();
    }

    getInput(hook){
        let input = $("<span/>").text("").addClass("in")
        return input
    }

    hookNotifiers(){
        
        for(let key in this.gizmo.notifiers){
            let notifier = this.gizmo.notifiers[key]
            let div = $("<div/>");
            div.append(key+": ")
            div.append($("<input/>", {
                val: notifier.get(),
                prop: {
                    type: "text"
                },
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
                attr:{
                    "autocomplete": "off"
                }

            }).attr("autocomplete","off"));

            div.append(this.getInput(notifier))
            $(this).append(div.addClass("blueprintItem"))
        }
    }

}
