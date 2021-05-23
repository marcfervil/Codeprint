class Stateful {

    constructor(obj){
        if(obj instanceof Stateful)return obj;
        this.obj = obj;
        this.proxyObj = this.setProxy(this.obj);
        this.notifier = {};
    }

    primitiveProxy(obj, attach=this, key="proxy"){
        let value = obj;
        let self = this;
        let getset = {
            get(){
                return value;
            },
            set(newValue){
                value = newValue;    
                if(self.notifier.update!=undefined)self.notifier.update(newValue);
            },
        }
        return Object.defineProperty(attach, key, getset);
    }

    attach(obj, key){
        this.primitiveProxy(this.obj, obj, key);
        self = this;
        obj.notify = new Proxy({}, {
            set: function(target, key, value) {
                 self.notifier = value;
                 //console.log(proxyObj[key].notifier)
                 return true;
            },
            get: function(target, key) {
                //console.log(key,self.state[key].notifier)
                return self.notifier
            },
        });
    }

    arrayProxy(obj){
        let stateList = []
        for(let [i, state] of obj.entries()){
            stateList.push(new Stateful(state));
        }
        let lastLen = stateList.length;
        let self = this;
        this.proxy = new Proxy(stateList, {
           
            get: function(target, property) {
                if(property=="target")return target;
                else if(property=="pretty") return target.map((item)=>item.value);
                //console.log('get',target,property)
                let prop = stateList[property] ;
                return (prop instanceof Stateful) ? prop.value : prop;
                
            },
            set: function(target, property, value, receiver) {  
                let prop = stateList[property] ;
                //if(property=="toString")  stateList.toString = value;
                if(prop instanceof Stateful){
                    stateList[property].value = value;
                }else{
                    stateList[property] = value;
                }
                
                if(lastLen < target.length){
                    lastLen += 1;
                    if(self.notifier.append!=undefined)self.notifier.append(value);
                    stateList[property] = new Stateful(value);
                }else if(prop instanceof Stateful){
                    
                    if(self.notifier.update!=undefined)self.notifier.update(value, property);
                }

                return true;
            }
        });
        
        
       
    }

    objectProxy(obj){
       
        let proxyObj = {}
        for(let itemName in obj){
            let value = obj[itemName]
            
            proxyObj[itemName] = new Stateful(value);
        }
        
        function getNotify(){
            let notify = {};
    
            return new Proxy(notify, {
                set: function(target, key, value) {
                     proxyObj[key].notifier = value;
                     //console.log(proxyObj[key].notifier)
                     return true;
                },
                get: function(target, key) {
                    //console.log(key,self.state[key].notifier)
                    return proxyObj[key].notifier
                },
            });
        }

        this.proxy = new Proxy(proxyObj, {
           
            get: function(target, property) {
 
                if(property=="pretty") return "wait";
                else if(property=="notify") return getNotify();
                //console.log('get',target,property)
                let prop = proxyObj[property] ;
                return (prop instanceof Stateful) ? prop.value : prop;
                
            },
            set: function(target, property, value, receiver) {  
                let self = proxyObj[property];
                let notifiers = self.notifier;
                if(self.notifier.update!=undefined)self.notifier.update(value, property);
                proxyObj[property] = new Stateful(value);
                proxyObj[property].notifier = notifiers;
                return true;
            }
        });
       // this.proxy = proxyObj;
    }

    setProxy(obj){
        if(isPrimitive(obj)){
            this.type = "primitive"
            this.primitiveProxy(obj);
        }else if(Array.isArray(obj)){
            this.type = "array"
            this.arrayProxy(obj)
        }else{
            this.type = "object"
            this.objectProxy(obj)
        }
        
    }


    set value(value){
        this.proxy = value;
    }

    get value(){
        
        return this.proxy;
    }
}

class State {

    constructor(state){
        this.state = {};
        for(let key in state){
            this.state[key] = new Stateful(state[key]);
        }
        this.notify = this.getNotify();
        return this.getProxy();
    }

    getNotify(){
        let notify = {};
        self = this;
        return new Proxy(notify, {
            set: function(target, key, value) {
                return self.state[key].notifier = value;
            },
            get: function(target, key) {
                //console.log(key,self.state[key].notifier)
                return self.state[key].notifier
            },
        });
    }

    getProxy(){
        return new Proxy(this, {
            set: function (target, key, value) {
                //console.log(`${key} set to ${value}`);
                target.setState(key, value)
                return true;
            },

            get: function(target, key) {
                if(key=="notify")return target.notify;
                return target.getState(key)
            },
        });
    }

    

    setState(key, value){
        this.state[key].value = value
    }

    getState(key){

        //console.log(key)
        //if(this.state[key].type=="array")return this.state[key].proxy.target
        return this.state[key].value;
    }

}