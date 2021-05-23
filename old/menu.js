Vue.component('component-menu', {
    
    template:/*html */`
        <div>
          <h2>Components</h2>
          <div v-for="component in components">
            <div class="menu-item" @mousedown="create(component)"">
              {{component.name}}
            </div>
            <br>
          </div>
        </div>
    `,


    methods: {
      create:function (component) {
          console.log(this.components)
        component.isChild = false;
        component.id = Math.random();
        this.$parent.addBlueprint(component);
        //alert("dragging "+component.name)
      }

    },
    
    data: function () {
      return {
       
        components: [
          {
            name: "Page",
          },

          {
            name: "Button"
          },

          {
            name: "Paragraph"
          }
        ]
      }
    },

  });
