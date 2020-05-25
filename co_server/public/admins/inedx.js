window.Event = new Vue();

Vue.component('login', {
  props : [''],
  template: `
              <div>
              <div class="field" style="width:400px">
                <label class="label">Username</label>
                <div class="control has-icons-left has-icons-right">
                <input class="input is-success" v-model="username" type="text" placeholder="Username" >
                <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
                </span>
                <span class="icon is-small is-right">
                <i class="fas fa-check"></i>
                </span>
                </div>
                <p class="help is-success">This username is available</p>
              </div>
              <div class="field">
              <label class="label">Password</label>
                <p class="control has-icons-left">
                  <input class="input" type="password" v-model="password" placeholder="Password">
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                </p>
              </div>
              <div class="field">
                <p class="control">
                  <button class="button is-success" @click="connect()">
                    Login
                  </button>
                </p>
              </div>

            </div>
  `,
  data() {
    return {
        username: '',
        password: ''
    };
  },
  methods: {
    connect(){
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



Vue.component('vote',
   {
    props : {
      votes: Array,
    },
    data() {
      return {
        isActive: false
      }
    },
    template: `
      <div>
          <div style="text-align: center;font-weight: bold; font-size:18px">VOTES LIST</div>
          <div class="table-responsive">
             <table class="table table-hover ">
                <thead class="thead-dark">
                  <tr>
                  <th scope="col">Database ID</th>
                  <th scope="col">Vote Number</th>
                  <th scope="col">Bulletin</th>
                  <th scope="col">IsCounted by the CO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr  v-for="vote in votes">
                  <th scope="row">{{ vote._id }}</th>
                  <td>{{ vote.voteNumber }}</td>
                  <td ><button class="button is-danger" @click="isActive = true">Show Bulletin</button></td>
                  <td>
                  <button  class="button " 
                  :class="vote.isCounted ? 'is-success' : 'is-danger'"
                  disabled v-text="vote.isCounted ? 'YES' : 'Not Yet'" ></button>
                  </td> 
          
                  <div class="modal" :class="isActive ? 'is-active' : ''">
                    <div class="modal-background"></div>
                    <div class="modal-card">
                      <header class="modal-card-head">
                        <p class="modal-card-title">Vote Bulletin</p>
                        <button class="delete" aria-label="close" @click="isActive = false"></button>
                      </header>
                      <section class="modal-card-body">
                        <p>
                        <span class="has-text-danger">Cette bulletin est crypté car le centre CO ne peut pas accéder au Bulletin:</span>
                         <br>
                          {{ vote.bulletin}}
                        </p>
                      </section>
                      <footer class="modal-card-foot">
                        <button class="button" @click="isActive = false">Cancel</button>
                      </footer>
                    </div>
                  </div>
                          
                  </tr>
                  
                </tbody>
              </table>

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




Vue.component('voters',
   {
    props : {
      voters: Array,
    },
    template: `

      <div>
          <div style="text-align: center;font-weight: bold; font-size:18px">EMPLOYEES LIST</div>
          <div class="table-responsive">
             <table class="table table-hover ">
                <thead class="thead-dark">
                  <tr>
                  <th scope="col">Database ID</th>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Birthday</th>
                  <th scope="col">Vote Number</th>
                  <th scope="col">has already voted ?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr  v-for="(voter , index) in voters">
                      <th scope="row">{{ voter._id }}</th>
                      <td>{{ voter.firstName }}</td>
                      <td>{{ voter.lastName }}</td>
                      <td> {{ voter.birthday }}</td>
                      <td>{{ voter.voteNumber }}</td>
                      <td>
                         <button v-if="voter.haveVoted"  class="button is-success" disabled >Voted</button>
                         <button v-if="!voter.haveVoted"  class="button is-danger" @click="setVoted(voter._id, index)" disabled>Not yet</button>
                      </td>      
                  </tr>
                  
                </tbody>
              </table>

          </div>
          

      </div>
 
    `,
    created()
    {
      console.log("helllo")
      console.table(this.votersList)
    },
    methods: {
      setVoted(_id, index){
        
        // ! axios to updateVoter using _id
        // ! axios updateVote
        let f = new FormData()
        f.append('voterId', _id)
        axios.put('/admin/updateVoter', f).then(res => {

          if(res.data.voted === true) this.voters[index].haveVoted = true
          else console.log("err -> ", res.data)
        })
        .catch(err => console.log(err))

      }
    },
   }
)

var root = new Vue({
    el: '#root',
    data : {
      authenticated: false,
      voters : [],
      votes : []
    },
    created() {
      Event.$on('authenticated', data => {
        
        this.authenticated = true
        this.getVoters()
        this.getVotes()
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
      },

      getVotes(){
        
        axios.get('/admin/votes')
        .then(res => {
          console.table(res.data)
          this.votes = res.data
          // console.table(this.voters)
          
        })
        .catch(err =>
          // ! display u're not authorised
          console.log("Voter err -> " + err ))
      }
    }
   
})