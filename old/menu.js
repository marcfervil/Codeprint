Vue.component('component-menu', {
    
    template:/*html */`
        <div>
          <h2>Components</h2>
          <div v-for="component in components">
            <div class="menu-item" @mousedown="create(component)"">
              {{component.name}}
              {{lala[0]}}
            </div>
            <br>
          </div>
        </div>
    `,


    methods: {
      create:function (component) {
        this.lala[0] = "fokok"
        console.log(this.lala[0])
        component.isChild = false;
        component.id = Math.random();
        this.$parent.addBlueprint(component);
        //alert("dragging "+component.name)
      }

    },
    
    data: function () {
      return {
        lala: ["w", 10, 2],
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
