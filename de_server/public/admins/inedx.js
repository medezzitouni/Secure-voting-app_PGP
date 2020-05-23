window.Event = new Vue();

Vue.component('login', {
  props : [''],
  template: `
      <div>
         <div class="field" style="width:400px">
            <label class="label">Username</label>
            <div class="control has-icons-left has-icons-right">
            <input class="input is-success" v-model="username" type="text" placeholder="Text input" value="bulma">
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
              <button class="button is-success" @click="sendTitle()">
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
                  <td>{{ vote.isCounted }}</td>
          
                  <div class="modal" :class="isActive ? 'is-active' : ''">
                    <div class="modal-background"></div>
                    <div class="modal-card">
                      <header class="modal-card-head">
                        <p class="modal-card-title">Vote Bulletin</p>
                        <button class="delete" aria-label="close" @click="isActive = false"></button>
                      </header>
                      <section class="modal-card-body">
                        <p>{{ vote.bulletin }} </p>
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
      // console.log("helllo")
      // console.table(this.votersList)
    }
   }
)

Vue.component('countedVote',
   {
    props : {
      countedvotes: Array,
    },
    data() {
      return {
        isActive: false
      }
    },
    template: `
      <div>
          <div style="text-align: center;font-weight: bold; font-size:18px">Counted VOTES LIST</div>
          <div class="table-responsive">
             <table class="table table-hover ">
                <thead class="thead-dark">
                  <tr>
                  <th scope="col">Database ID</th>
                  <th scope="col">Vote Number</th>
                  <th scope="col">Bulletin</th>
                  <th scope="col">IsValid by the CO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr  v-for="(vote, index) in countedvotes">
                  <th scope="row">{{ vote._id }}</th>
                  <td>{{ vote.voteNumber }}</td>
                  <td ><button class="button is-danger" @click="isActive = true">Show Bulletin</button></td>
                  <td>
                     <button v-if="vote.isValid"  class="button is-success" disabled >Valid</button>
                     <button v-if="!vote.isValid"  class="button is-danger" @click="setValid(vote._id, index)">Not yet</button>
                  </td> 
          
                  <div class="modal" :class="isActive ? 'is-active' : ''">
                    <div class="modal-background"></div>
                    <div class="modal-card">
                      <header class="modal-card-head">
                        <p class="modal-card-title">Vote Bulletin</p>
                        <button class="delete" aria-label="close" @click="isActive = false"></button>
                      </header>
                      <section class="modal-card-body">
                        <p>{{ vote.bulletin }}</p>
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
    },
    methods: {
      setValid(_id, index){
        
          // ! send axios to updateCountedVote
          let f = new FormData()
          f.append('voteId', _id)
          axios.put('/admin/updateCountedVote', f).then(res => {
            if(res.data.valid === true)  this.countedvotes[index].isValid = true
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
      votes : [],
      countedVotes : []
    },
    created() {
      Event.$on('authenticated', data => {
        
        this.authenticated = true
        // window.location.hash.split('/')
        this.getVotes()
        this.getCountedVotes()

        // this.tokenData = data
      })
      
    },
    methods:{
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
      },
      getCountedVotes(){
        
        axios.get('/admin/countedVotes')
        .then(res => {
          console.table(res.data)
          this.countedVotes = res.data
          
        })
        .catch(err =>
          // ! display u're not authorised
          console.log("Voter err -> " + err ))
      },
    }
   
})


