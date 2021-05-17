

Vue.component('Page', {
    template:/*html */`
        <div v-bind:style="this.getStyle" class="page" @mouseover="mouseOver($event)" @mouseleave="mouseExit($event)">
        
            <!--
            <component  v-for="blueprint in blueprints" 
                        v-bind:is-child="blueprint.isChild" 
                        v-bind:key="this.id"
                        :is="blueprint.name">
            </component>-->
            id: {{viewId}} 
            <blueprint-view :blueprints="this.blueprints"> </blueprint-view>
    
        </div>
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
           
            this.style.minHeight = "10vh";
            
           // this.
        }
        

    },

    props: ["is-child", "view-id"],

    methods: {
        mouseOver: function(e, enter = false){
            
            e.stopPropagation();
     
            if((this.$root.isDragging && !this.isDragging) || enter){
                this.$root.hovered = this; 
            }
        },
        mouseExit: function(e, exit = false){
            if((this.$root.isDragging && !this.isDragging)||exit){
                this.$root.hovered = null;
            }
        }
       
        
    },

    computed: {
        getStyle: function () {
            let style = {...this.style}
            if(this.$root.hovered == this)style.backgroundColor = "lightgray";
            if(this.$root.selected == this)style.border = "1px blue dotted";
            return style;
            
        }
    },

    data: function () {
        return {
            blueprints: [],
            isDragging: !this.isChild,
            name: "Page",
   
            style: {
                width: "30%",
                minHeight: "70%",
                top: "0px",
                left: "0px",
                position: "absolute",
                opacity: 0,
                zIndex: 1,
                backgroundColor: "white"
            }
        }
      },

});