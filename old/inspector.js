

Vue.component('inspector', {

    template:/*html */`
        <div class="inspector">
            <h2>{{$root.selected?.name}}</h2>
                <div v-if="$root.selected!=null" v-for="(value, key) in $root.selected?.live">
                    {{key}}:
                    <input v-model="$root.selected?.live[key]"></input>
                </div>
            </div>
        </div>
    `,

    

});