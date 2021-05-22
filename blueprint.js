
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
        let index = 0
        for(let gizmo of gizmos){
            
            let newGizmo = (generator!=null)?generator(gizmo, index) : gizmo;
            if(Array.isArray(newGizmo)){
                
                this.attachGizmos(newGizmo);
            }else{
                
                this.appendChild(newGizmo);
            }
            index+=1;
            
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
            let newList = []
            
  
       
            let proxy = new Proxy(newList, {
                apply: function(target, thisArg, argumentsList) {
                    return thisArg[target].apply(this, argumentList);
                },
                deleteProperty: function(target, property) {
                    
                    return true;
                },
                get: function(target, property) {
                    return target[property];
                },
                set: function(target, property, value, receiver) {  
                 
                    target[property] = value;
                    //console.log("fwpk")
                    update(property, value)
                    return true;
                }
            });

            for(let [i, el] of obj.entries()){
                
                if(typeof el == "string"){
                    el = new String(el)
                }

                el.reactive = {
                    obj: proxy,
                    key: i
                }

                newList.push(el)
            }
            
            //console.log(JSON.parse(JSON.stringify(g.reactive)));
            if(obj.reactive!==undefined){
                obj.reactive.obj[obj.reactive.key] = proxy
            }

            //proxy.hi="whooahhh"
           // console.log(proxy.hi)

            return proxy;
        }else{
            
            let self = this;
            self.state[name] = obj;

            let getset = {
                get(){
                    return self.state[name];
                },
                set(value){
                    self.state[name] = value;    
                    update(value)
                }
            }

            Object.defineProperty(this, name, getset);

           
            if(obj.reactive!==undefined){
                //console.log(obj.reactive.obj, obj.reactive.key)
                Object.defineProperty(obj.reactive.obj, obj.reactive.key, getset);
                
            }

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



    parseState(ogState){
        let state = {}

        for(let itemName in ogState){
            
            let val = ogState[itemName]

            if(typeof val == "string"){
                val = new String(val)
            }else if(isObj(val)){

                val = this.parseState(val)
                
            }

            state[itemName] = val
            
            state[itemName].reactive = {
                obj: state,
                key: itemName
            }

        }
        return state
    }

    constructor(gizmos) {
        super();
        if(Array.isArray(gizmos)){
            this.attachGizmos(gizmos);
        }else{
            let state = this.parseState(gizmos.state)
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
            if(this.lastlen < this.items.length){
                this.attachGizmos([value], generator);
                this.lastlen += 1;
            }

        });
        this.lastlen = this.items.length;
        
        this.attachGizmos(this.items, generator)
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
