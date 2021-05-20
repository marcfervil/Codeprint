                   
    function unreact(obj, deep = false){
        if(!deep){
            return JSON.parse(JSON.stringify(obj));
        }else{
            let seen = [];
            return JSON.parse(JSON.stringify(obj, function(key, val) {
                if (val != null && typeof val == "object") {
                    if (seen.indexOf(val) >= 0) {
                        return;
                    }
                    seen.push(val);
                }
                return val;
            }));
        }
    }
          

drag = function(redragParent = null){
    let startPos = false
    let mouseMove = (e) => {
        if (startPos==false ){
            startPos = {};
            startPos.x = e.clientX;
            startPos.y = e.clientY;
        }
        let dist = Math.hypot(e.clientX-startPos.x, e.clientY-startPos.y);

        if(startPos!=false && startPos!=true && dist> 60){
            console.log(dist);
            
            startPos = true;
        }
        if(startPos == true){
            this.style.opacity = 0.5;
            this.style.left = e.clientX+"px";
            this.style.top = e.clientY+"px";
            
            this.style.pointerEvents = "none";
            this.$root.isDragging = true;
            this.style.position="fixed";
            
            if(redragParent!=null){
                
                if(this.$parent.$parent!=this.$root)this.$parent.$parent.style.zIndex=100;
                //this.$parent.$parent.style.zIndex=100
                //console.log();
                //this.$parent.style.zIndex=100;
                this.style.zIndex=100;
                this.$forceUpdate();
            
            }
        }
    };

    let up = true;
    let mouseUp = (e) => {
        
        document.removeEventListener("mouseup", mouseUp);
        document.removeEventListener("mousemove", mouseMove);
        

      
        this.style.opacity = 1;
        this.isDragging = false;
        this.$root.isDragging = false;
        this.style.pointerEvents = "auto";
        this.style.zIndex = 1;

        if( this.$root.hovered == this.$parent.$parent || ((startPos!=false && startPos!=true) || startPos==false) || this.$root.hovered==null){
            this.$root.hovered = null;
            if(this.$root.hovered == this.$parent.$parent){
                this.style.position = "static";
            }
            return;
        }


        if(redragParent!=null){
            if(this.$parent.$parent!=this.$root)this.$parent.$parent.style.zIndex=1;
            
            let oldPrint = redragParent.find((blueprint=>blueprint.id==this.viewId));
            redragParent.splice(redragParent.indexOf(oldPrint), 1);
            this.$root.hovered.blueprints.push(unreact(oldPrint));
            this.$root.hovered.mouseExit(true);
            this.$root.hovered = null;
            //console.log(redragParent.length)
        }else

        if(this.$root.hovered!=null){
            this.$root.blueprints = this.$root.blueprints.filter(blueprint=>blueprint.id!=this.viewId)
           
            this.$root.hovered.blueprints.push(unreact({name: this.name, isChild: true, id: Math.random()}));
            this.$root.hovered.mouseExit(true);
            this.$root.hovered = null;
        }
        
    };
   
    document.addEventListener("mousemove", mouseMove)
    document.addEventListener("mouseup", mouseUp);
}