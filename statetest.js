let state = new State({
    nums: [1, 2, 3], 
    primitive: "some value",
    obj: {
        name: "yup"
    }
})


state.notify.primitive = {
   
    update: (value, index) => {
        console.log(`updated to ${value}`)
    },
}

state.primitive = "1) primitive works"
state.primitive = "1.5) primitive works"


state.notify.nums = {
    append: (value) => {
        console.log("appended", value)
    },
    update: (value, index) => {
        console.log(`updated ${index} to ${value}`)
    },
}

state.nums.push("2) array appending works")
state.nums[0] = "3) array mutation works"

state.notify.nums[0] = {
    
    update: (value ) => {
        console.log(`updated to ${value}`)
    },
}

state.nums[0] = "4) array mutation notification works"
state.nums[0] = "5) array remutation notification works"


state.obj.notify.name = {
    update: (value) => {
        console.log(`updated to ${value}`)
    },
}

state.obj.name = "6) object updates work"
state.obj.name = "7) object updates work"


attachState = {}

new Stateful(3).attach(attachState, "hi")
//console.log(attachState)
attachState.notify.hi = {
    update: (value) => {
        console.log(`updated to ${value}`)
    },
}

attachState.hi = "attachments work!"