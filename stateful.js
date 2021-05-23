class Stateful {

    constructor(obj){
        if(obj instanceof Stateful)return obj;
        this.obj = obj;
        this.proxyObj = this.setProxy(this.obj);
        this.notifier = {};
    }

    primitiveProxy(obj){
        let value = obj
        let getset = {
            get(){
                return value;
            },
            set(newValue){
                value = newValue;    
                if(this.notifier.update!=undefined)this.notifier.update(newValue);
            },
        }
        return Object.defineProperty(this, "proxy", getset);
    }

    arrayProxy(obj){
        let stateList = []
        for(let [i, state] of obj.entries()){
            stateList.push(new Stateful(state));
        }
        let lastLen = stateList.length;
        let self = this;
        this.proxy = new Proxy(stateList, {
            /*
            apply: function(target, thisArg, argumentsList) {
                return thisArg[target].apply(this, argumentList);
            },*/
            deleteProperty: function(target, property) {
                
                return true;
            },
            get: function(target, property) {
                if(property=="target")return target;
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
                }else if(prop instanceof Stateful){
                    
                    if(self.notifier.update!=undefined)self.notifier.update(value, property);
                }

                return true;
            }
        });

        
       
    }

    setProxy(obj){
        if(isPrimitive(obj)){
            this.type = "primitive"
            this.primitiveProxy(obj);
        }else if(Array.isArray(obj)){
            this.type = "array"
            this.arrayProxy(obj)
        }
        
    }


    set value(value){
        this.proxy = value;
    }

    get value(){
        if(this.type=="array"){
            //this.proxy.target.length = 10;
            //this.proxy.target.push("dewjio")
           // return this.proxy.target;
            //return Object.values(this.proxy).map((item)=>item)
        }
        //if(this.type=="array")return this.proxy.target
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
                console.log(key)
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