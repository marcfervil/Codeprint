
    function makeDefault(){
        let defaultView = new ViewGizmo();
        let defaultText = new TextGizmo();


        $("#bp").append(defaultView);
        defaultView.addGizmo(defaultText)
        defaultView.addGizmo(new TextBoxGizmo())
        defaultView.addGizmo(new ButtonGizmo())
        
        defaultView.pos(344, 160);
        //defaultText.createBlueprint();
        let viewbp = defaultView.createBlueprint();
        viewbp.pos(822, 116)
        defaultView.redrag()

        let renderer = new StartGizmo()
        $("#bp").append(renderer)

        let lst = new ListGizmo();
        $("#bp").append(lst)
        lst.pos(1026, 353)
        lst.redrag()

        renderer.redrag()
        renderer.pos(1000, 87)
 

       // setTimeout(()=>{
            viewbp.hooks[0].hook(renderer.hooks[0])
      //  },100)
    }
   