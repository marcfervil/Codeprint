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

        let left = parseFloat(gizmo.style.left.replace(/[^-\d\.]/g, ''));


        this.pos(left+gizmo.clientWidth+50, gizmo.style.top)
    }

}

//console.log(TextGizmo instanceof Blueprint);