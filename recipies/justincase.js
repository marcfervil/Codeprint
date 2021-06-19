
    function makeDefault(){
        let defaultView = createGizmo(ViewGizmo);
        let defaultText =createGizmo(TextGizmo);


        $("#bp").append(defaultView);
        defaultView.addGizmo(defaultText)
        defaultView.addGizmo(createGizmo(TextBoxGizmo))
        defaultView.addGizmo(createGizmo(ButtonGizmo))
        
        defaultView.pos(344, 160);
        //defaultText.createBlueprint();
        let viewbp = defaultView.createBlueprint();
        viewbp.pos(822, 116)
        defaultView.redrag()

        let renderer = createGizmo(StartGizmo)
        $("#bp").append(renderer)

       
        renderer.redrag()
        renderer.pos(1000, 87)
 

       // setTimeout(()=>{
            viewbp.hooks[0].hook(renderer.hooks[0])
      //  },100)
    }
   