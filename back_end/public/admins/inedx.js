window.Event = new Vue();

Vue.component('login', {
  props : [''],
  template: `
      <div>
         <input type="text" v-model="username" id="">
         <input type="password" v-model="password" id="">
         <button @click="sendTitle()">Send</button>
      </div>
  `,
  data() {
    return {
        username: '',
        password: ''
    };
  },
  methods: {
    sendTitle(){
      let f = new FormData()
      f.append('username', this.username)
      f.append('password', this.password)
      axios.post("/admin/login", f).then(res => {
        console.log(res.data)
        axios.defaults.headers.common["Authorization"] = "jwt " + res.data.token;
        if(res.data.token)
            Event.$emit("token", res.data)

      }).catch(err => console.log(err.msg))
    }
},
})

Vue.component('voters',
   {
    props : {
      voters: Array,
      default: []
    },
    template: `
      <div>
      
      
      </div>
    `
   }
)

var root = new Vue({
    el: '#root',
    data : {
      tokenData : {},
      authentified: false,
      voters : []
    },
    created() {
      Event.$on("token", data => {
        
        this.tokenData = data
        this.authentified = true
        // this.getVoters()
      })
      
    },
    methods:{
      getVoters(){
        // headers = { "Authorization" : "jwt " + this.token}
        let f = new FormData()
        f.append('adminId', this.tokenData.id)
        axios.post('/admin/voters',f)
        .then(res => {
          console.log(res.data)
          this.voters = res.data.voters
        })
        .catch(err => console.log("Voter err -> " + err ))
      }
    }
   
})