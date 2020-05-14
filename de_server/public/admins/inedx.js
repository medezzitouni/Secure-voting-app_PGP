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
        // console.log(res.data)
        // console.log('header axios -> ' + res.data.id)
        
        axios.defaults.headers.common["Authorization"] = "jwt " + res.data.token;
        axios.defaults.headers.common["AdminId"] = res.data.id;

        if(res.data.token && res.data.id)
            Event.$emit('authenticated', res.data)

      }).catch(err => console.log(err.msg))
    }
},
})

Vue.component('voters',
   {
    props : {
      voters: Array,
    },
    template: `
      <div>
          <div>Voters List</div>
          <div v-for="voter in voters">
              <span style="width:50px" > {{ voter._id }} </span>
              <span style="width:50px" > {{ voter.firstName }} </span>
              <span style="width:50px" > {{ voter.lastName }} </span>
              <span style="width:50px" > {{ voter.birthday }} </span>
              <span style="width:50px" > {{ voter.voteNumber }} </span>
              <span style="width:50px"> {{ voter.haveVoted }} </span>
          </div>
      </div>
    `,
    created()
    {
      console.log("helllo")
      console.table(this.votersList)
    }
   }
)

var root = new Vue({
    el: '#root',
    data : {
      authenticated: false,
      voters : []
    },
    created() {
      Event.$on('authenticated', data => {
        
        this.authenticated = true
        this.getVoters()

        // this.tokenData = data
      })
      
    },
    methods:{
      getVoters(){
        // headers = { "Authorization" : "jwt " + this.token}
        // let f = new FormData()
        // f.append('adminId', this.tokenData.id)
        
        axios.get('/admin/voters')
        .then(res => {
          console.table(res.data)
          this.voters = res.data
          // console.table(this.voters)
          
        })
        .catch(err =>
          // ! display u're not authorised
          console.log("Voter err -> " + err ))
      }
    }
   
})