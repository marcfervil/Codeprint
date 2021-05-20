
class Gizmo extends HTMLElement {
    constructor() {
        super();
        this.state = {}
    }
    connectedCallback() {
    
        
    }

    br(){

        this.appendChild(document.createElement("br"));
        return this;
    }

    attachGizmos(gizmos, generator=null){
        for(let gizmo of gizmos){
 
            let newGizmo = (generator!=null)?generator(gizmo) : gizmo;
            if(Array.isArray(newGizmo)){
                
                this.attachGizmos(newGizmo);
            }else{
                this.appendChild(newGizmo);
            }
            
        }
    }

    event(eventName, callback){
        
        this.addEventListener(eventName, (event)=>{
            callback(this, event)
        });
        return this;
    }

    makeReactive(name, obj, update){
        
        if(Array.isArray(obj)){
            var proxy = new Proxy(obj, {
                apply: function(target, thisArg, argumentsList) {
                  return thisArg[target].apply(this, argumentList);
                },
                deleteProperty: function(target, property) {
                    
                    return true;
                },
                set: function(target, property, value, receiver) {      
                    target[property] = value;
                    update(value)
                    return true;
                }
              });
              this[name] = proxy;
              obj = 4
        }else{
            this.state[name] = obj;
            Object.defineProperty(this, name, {
                get(){
                    return this.state[name];
                },
                set(value){
                    this.state[name] = value;
                   
                    update(value)
                }
            });
        }
      
    }

    init(){
        
    }

    prop(key, value){
        this[key] = value;
        return this;
    }
}

class GizmoView extends Gizmo {
    constructor(gizmos) {
        super();
        this.attachGizmos(gizmos);
    }
  
}



class ListView extends Gizmo{
    constructor(gizmos, generator) {
        super();
        this.generator = generator
        this.makeReactive("gizmos", gizmos, (value)=>{
            this.innerHTML = '';
            this.attachGizmos(gizmos, generator)
        });
        
        this.attachGizmos(gizmos, generator)
    }

   

}


class TextView extends Gizmo{
    constructor(text) {
        super();

        this.makeReactive("text", text, (value) => this.textNode.nodeValue = value);

        this.textNode = document.createTextNode(this.text);
        this.appendChild(this.textNode)
    }

}

customElements.define('gizmo-view', GizmoView);
customElements.define('text-view', TextView);
customElements.define('list-view', ListView);

function gizmo(gizmoName){
    if(gizmoName=="view") gizmoName="gizmo";
    let gizmo = document.createElement(gizmoName+"-view");
    args = Array.prototype.slice.call(arguments);
    gizmo.init(...args.slice(1));
    return gizmo
}
