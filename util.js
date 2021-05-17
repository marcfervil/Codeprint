drag = function(){
        
    let mouseMove = (e) => {
        this.style.opacity = 0.5;
        this.style.left = e.clientX+"px";
        this.style.top = e.clientY+"px";
        this.style.pointerEvents = "none";
        this.$root.isDragging = true;
    
    };

    let mouseUp = (e) => {
        document.removeEventListener("mouseup", mouseUp);
        document.removeEventListener("mousemove", mouseMove);
        this.style.opacity = 1;
        this.isDragging = false;
        this.$root.isDragging = false;
        this.style.pointerEvents = "auto";

        if(this.$root.hovered!=null){
            
            this.$root.blueprints.splice(this.$root.blueprints.indexOf(this.name), 1);
           
            this.$root.hovered.blueprints.push(unreact({name: this.name, isChild: true, id: Math.random()}));
            this.$root.hovered.mouseExit(true);
            this.$root.hovered = null;
        }
        
    };

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
}