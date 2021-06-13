
class ListGizmo extends Blueprint {
    constructor(){
        super("List")
        
        this.items = []
        //this.notifiers = {"": new Notifier(this)}

        this.outputNotifier = new Notifier(this);
        this.completedHook = this.getHook(this.outputNotifier, "output");
        this.heading.append(this.completedHook.css({
            "float": "right",
            "margin": "5px",
            "marginBottom": "0px"
        }))
        
        this.appendBox = $("<input/>").addClass("listInput").attr({
            "type": "text",
            "placeholder": "Add list item"
        })

        this.appendDiv = $("<div/>").addClass("listDiv")
        
        this.appendButton = $("<span/>").append($("<i/>").addClass("fas fa-plus"))


        this.itemDiv = $("<div/>")
        //$(this).append($("<hr>").css({padding:0, margin: 0}))

        $(this).append($("<br/>"))
       

        this.appendDiv.append(this.appendButton);
        this.appendDiv.append(this.appendBox);

        $(this).append(this.itemDiv)
        $(this).append(this.appendDiv)


        this.appendBox.change((e)=>{
            this.addItem($(e.target).val())
            $(e.target).val("")
            
        });
    }

    addItem(item){
        this.itemDiv.css("display", "block")
        this.itemDiv.append($("<div/>").html(`<b>${this.items.length}</b>: ${item}`).addClass("listItemDiv"))
        this.items.push(item)
        //this.getNotiferInputField(notiferKey, notifierCopy)
    }


}