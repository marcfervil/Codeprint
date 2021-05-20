
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
            //console.log(obj.reactive);
            var proxy = new Proxy(obj, {
                apply: function(target, thisArg, argumentsList) {
                    return thisArg[target].apply(this, argumentList);
                },
                deleteProperty: function(target, property) {
                    
                    return true;
                },
                set: function(target, property, value, receiver) {      
                    target[property] = value;
                    
                    update(property, value)
                    return true;
                }
            });
            
            if(obj.reactive!==undefined){
                obj.reactive.obj[obj.reactive.key] = proxy
            }
            return proxy;
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
        if(Array.isArray(gizmos)){
            this.attachGizmos(gizmos);
        }else{
            let state = {}

            for(let itemName in gizmos.state){
                
                state[itemName] = gizmos.state[itemName]
                //console.log(state[itemName] , gizmos[itemName])
                state[itemName].reactive = {
                    obj: state,
                    key: itemName
                }

            }
            this.attachGizmos(gizmos.render(state))
        }
        
    }
  
}



class ListView extends Gizmo{
    constructor(items, generator) {
        super();
        this.generator = generator
        
        this.items = this.makeReactive("items", items, (property, value)=>{
            //this.innerHTML = '';
            //this.attachGizmos(items, generator)
            if(property == this.items.length-1){
                this.attachGizmos([value], generator)
            }
        });
        
        this.attachGizmos(items, generator)
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
