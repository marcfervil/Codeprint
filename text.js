

Vue.component('Paragraph', {
    template:/*html */`
        <div v-bind:style="this.getStyle" class="text">{{text}}</div>
    `,

    created: function(){
        
        if(!this.isChild){
            drag.bind(this)();
        }else{
            this.style.opacity = 1;
            
            delete this.style.top;
            delete this.style.left;
            delete this.style.position;
            delete this.style.width;
            this.style.position = "static"
           
        
        }
        

    },

    props: ["is-child", "view-id"],
   
    computed: {
        getStyle: function () {
            let style = this.style
            
            return style;
            
        }
    },

    data: function () {
        return {
            blueprints: [],
            isDragging: !this.isChild,
            name: "Paragraph",

            text: "placeholder",
            style: {     
                top: "0px",
                left: "0px",
                position: "absolute",
                opacity: 0,
                zIndex: 1,
            }
        }
      },

});