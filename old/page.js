

Vue.component('Page', {
    template:/*html */`
        <div v-bind:style="this.getStyle" class="page" @mouseover="mouseOver($event)" @mouseleave="mouseExit($event)">
        
            <!--
            <component  v-for="blueprint in blueprints" 
                        v-bind:is-child="blueprint.isChild" 
                        v-bind:key="this.id"
                        :is="blueprint.name">
            </component>-->
            
            <blueprint-view :blueprints="this.blueprints"> </blueprint-view>
    
        </div>
    `,

    created: function(){

        if(!this.isChild){
            drag.bind(this)();
        }else{
            this.style.opacity = 1;
            
            if(this.$parent.$parent!=this.$root){
                delete this.style.top;
                delete this.style.left;
            }
            delete this.style.position;
            delete this.style.width;
            

            console.log(this.$parent.$parent==this.$root);
            this.style.position = (this.$parent.$parent!=this.$root) ? "static" : "fixed";
           
            this.style.minHeight = "10vh";
            
           // this.
        }
        

    },

    props: ["is-child", "view-id",],

    methods: {
        mouseOver: function(e, enter = false){
            
            e.stopPropagation();
     
            if((this.$root.isDragging && !this.isDragging) || enter){
                this.$root.hovered = this; 
            }
        },
        mouseExit: function(e, exit = false){
            if((this.$root.isDragging && !this.isDragging)||exit){
                this.$root.hovered = this.$root;
            }
        }
       
        
    },

    computed: {
        getStyle: function () {
            let style = this.style
            if(this.$root.hovered == this){
                style.backgroundColor = "lightgray";
                //style.zIndex = 10;

            }else{
                style.backgroundColor = "white";
               // style.zIndex = 1;
            }

            if(this.$root.selected == this){
                style.border = "1px blue dotted";
            }else{
                style.border = "1px black solid";
            }
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
                top:  "90px",
                left: "430px",
                position: "fixed",
                opacity: 0,
                zIndex: 1,
                backgroundColor: "white"
            }
        }
      },

});