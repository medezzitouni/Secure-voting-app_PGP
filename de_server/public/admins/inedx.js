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
        isActive: false,
        error : null
      }
    },
    template: `
      <div>
              <article class="message" :class="error ? 'is-danger' : 'is-info'" style="  margin:30px ">
                  <div class="message-header" style="display: grid; justify-content:center; align-items: center; height:40px ">
                    <p v-if="!error" style="font-size: 18px">Information</p>
                    <p v-if="error" >{{ error }}</p>
                  </div>
                  <div v-show="!error" class="message-body">
                      If the vote exist in the Counted List (counted by CO center ), click on the validation button of the vote<br>
                      to validate it, don't worry we do check if the vote is really counted or not after you click on the button<br>
                      then if it's really counted we make it valid, or if it's not we generate an error
                  </div>
            </article>

          <div style="text-align: center;font-weight: bold; font-size:18px">VOTES LIST from Voter</div>
          <div class="table-responsive">
             <table class="table table-hover ">
                <thead class="thead-dark">
                  <tr>
                  <th scope="col">Database ID</th>
                  <th scope="col">Vote Number</th>
                  <th scope="col">Bulletin</th>
                   <th scope="col"> Validation </th>
                  </tr>
                </thead>
                <tbody>
                  <tr  v-for="(vote, index) in votes">
                  <th scope="row">{{ vote._id }}</th>
                  <td>{{ vote.voteNumber }}</td>
                  <td ><button class="button is-danger" @click="isActive = true">Show Bulletin</button></td>
                  <td>
                    <button 
                    class="button " :class="vote.isValid ? 'is-success' : 'is-danger'"  
                    v-text="vote.isValid ? 'YES': 'NO'" @click="setValid(vote._id, index)" ></button></td>
                  </td>
          
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
    },
    methods: {
      async setValid(_id, index){
        
        // ! send axios to updateCountedVote
        let f = new FormData()
        f.append('voteId', _id)
        
        try {
              let res = await axios.put('/admin/updateVote', f)

              if(res.data.success == true)  this.votes[index].isValid = true
              else {
                this.error = res.data.error
                console.log(res.data.error)
              }
            
        } catch (error) {
          console.log('validation error ->', error)
        }
    }
    },
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
          <div style="text-align: center;font-weight: bold; font-size:18px">Counted VOTES LIST from CO Center</div>
          <div class="table-responsive">
             <table class="table table-hover ">
                <thead class="thead-dark">
                  <tr>
                  <th scope="col">Database ID</th>
                  <th scope="col">Vote Number</th>
                  <th scope="col">Bulletin</th>
                  <th scope="col">Counted By CO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr  v-for="(vote, index) in countedvotes">
                  <th scope="row">{{ vote._id }}</th>
                  <td>{{ vote.voteNumber }}</td>
                  <td ><button class="button is-danger" @click="isActive = true">Show Bulletin</button></td>
                  <td>
                    <!-- <button v-if="vote.isValid"  class="button is-success" disabled >Valid</button> -->
                     <button  class="button " 
                     :class="vote.isCounted ? 'is-success' : 'is-danger'" 
                     @click="setValid(vote._id, index)" v-text=" vote.isCounted ? 'YES' : 'Not Yet' " disabled></button>
                  </td> 
          
                  <div class="modal" :class="isActive ? 'is-active' : ''">
                    <div class="modal-background"></div>
                    <div class="modal-card">
                      <header class="modal-card-head">
                        <p class="modal-card-title">Vote Bulletin counted by the Co Center</p>
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


