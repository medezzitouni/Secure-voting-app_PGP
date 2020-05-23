window.Event = new Vue();

Vue.component('vote', {
  props : [''],
  template: `
    <div>
      <div style="display: grid;
            justify-content: center;
            align-items: center;
            ">
      <div style=" text-align: center; font-weight: 400;">Vote For Your Preferred Condidate </div>
      <br>
      <div class="field">
        <div class="control">
          <input class="input is-primary" type="text" v-model="firstName" placeholder="First Name">
        </div>
      </div>

      <div class="field">
        <div class="control">
          <input class="input is-primary" type="text" v-model="lastName" placeholder="Last Name">
        </div>
      </div>

      <div class="field">
        <div class="control">
          <input class="input is-primary" type="text" v-model="birthday" placeholder="14/5/1997" >
        </div>
      </div>

         <div class="field">
            <div class="control">
              <div class="select is-primary">
                <select v-model="CandidatSelected">
                <option disabled value="">Vote</option>
                  <option>candidate1</option>
                  <option>candidate2</option>
                </select>
              </div>
            </div>
         </div>
         <br>
         <div style="font-size:21px; margin-left:35px ">Selected : <span class="has-text-success" >{{ CandidatSelected }}</span></div>
         
         <br>
         <br>
         <button class="button is-success is-rounded" @click="submit()" :disabled="disabled">Vote</button>
          <br>
        
      </div>

      

      <article  class="message is-warning" v-show="CandidatSelected.length > 0 && !message_available">
      <div class="message-header">
      <p style="font-size:15x; color:white">Are you sure about choosing {{ CandidatSelected }}?</p>
      </div>
    </article>
      
      <article v-show="message_available"  class="message"  :class="success_message.length > 0 ? 'is-success' : 'is-danger'">
      <div class="message-header">
        
        <p v-if="fail_message.length > 0" >{{fail_message}}</p>
        <p v-if="success_message.length > 0" >{{success_message}}</p>
        <button style="margin-left:10px" class="delete" aria-label="delete" @click="clear()"></button>
      </div>
    </article>
    </div> 
  `,
  data() {
    return {
        firstName: '',
        lastName: '',
        birthday: '',
        CandidatSelected :'',
        disabled: false,
        fail_message : '',
        success_message: '',
        message_available : false,
    };
  },
  methods: {
    async submit(){
          await this.encryptDataAndSend(await this.getId())
          
    },
    async getId(){
      let f = new FormData()
      f.append('firstName', this.firstName)
      f.append('lastName', this.lastName)
      f.append('birthday', this.birthday)
   
      try {
        
        let res = await axios.post("/vote/addVote", f)
        if(!res.data.success){
           this.fail_message = res.data.message
            this.message_available = true
            return null
          }
        else return res.data.voteNumber
      } catch (err) {
        console.log(err.msg)
      }
    },
    async getKeyManager(){
      try {
          let res = await axios.get('http://127.0.0.1:3000/api/keymanager')
          return res.data.k_public
        } catch (error) {
            console.log("get KeyManager err -> ", error)
        }
    },
    async encryptDataAndSend(voteNumber){
        let scope = this
        

        var co_pgp_key = await scope.getKeyManager();

        kbpgp.KeyManager.import_from_armored_pgp({
          armored: co_pgp_key
        }, function(err,server_km) {
          if (err) {
            console.log("co key is not loaded", err);
            return
          }
          let params = {
            msg: voteNumber,
            encrypt_for: server_km
        }

          kbpgp.box(params, function(err, result_string, result_buffer) {
            let encrypt_voteNumber = result_string

            kbpgp.KeyManager.import_from_armored_pgp({
              armored: co_pgp_key
            }, function(err,server_km) {
              if (err) {
                console.log("co key is not loaded2", err);
                return
              }
              let params = {
                msg:       scope.CandidatSelected,
                encrypt_for: server_km
            }
    
              kbpgp.box(params, function(err, encrypt_bulletin, result_buffer) {
                // console.log('encrypted data', encrypt_voteNumber, encrypt_bulletin)
                scope.sendVote(encrypt_voteNumber, encrypt_bulletin)

    
              });
    
            });

          });

        });
        
    },

    async sendVote(voteNumber, bulletin){
      this.clear()

      if(voteNumber && bulletin){
       let f = new FormData()
       f.append('voteNumber', voteNumber)
       f.append('bulletin', bulletin)
 
       try {
         let res = await axios.post('http://127.0.0.1:3000/admin/addVote', f)
         
         if(res.data.success) this.success_message = res.data.message
         else this.fail_message = res.data.error
         this.message_available = true
         
       } catch (err) {
         console.log("voter to CO -> " + err)
       }
      }else{
          this.fail_message = 'an error has generated, plz can u repeat again'
          console.log('the error is here, fail send')
          this.message_available = true
      }
     },
     clear(){
         this.message_available = false
         this.fail_message = ''
         this.success_message = ''
         
     }
},
})

var root = new Vue({
    el: '#root',
    data : {
      // authenticated: false,
      // voters : []
    },
    created() {
      Event.$on('authenticated', data => {
        
        this.authenticated = true
        this.getVoters()

        // this.tokenData = data
      })
      
    },
    methods:{
    //   getVoters(){
    //     // headers = { "Authorization" : "jwt " + this.token}
    //     // let f = new FormData()
    //     // f.append('adminId', this.tokenData.id)
        
    //     axios.get('/admin/voters')
    //     .then(res => {
    //       console.table(res.data)
    //       this.voters = res.data
    //       // console.table(this.voters)
          
    //     })
    //     .catch(err =>
    //       // ! display u're not authorised
    //       console.log("Voter err -> " + err ))
    //   }
    }
   
})