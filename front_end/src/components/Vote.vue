<template>
    <div><div class="container py-5">
  <header class="text-center text-white">
    <h1 class="display-4">Table des condidats</h1>
    <p class="lead mb-0">veulliez choisir le condidat que vous voulez </p>
  </header>
  <div class="row py-5">
    <div class="col-lg-10 mx-auto">
      <div class="card rounded shadow border-0">
        <div class="card-body p-5 bg-white rounded">
          <div class="table-responsive">
            <table id="example" style="width:100%" class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prenom</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody v-for="(item ,key) in $store.state.list" :key="item.id"> 
                
                  <tr>
                     <td>{{item.nom}}</td>
                     <td>{{item.prenom}}</td>
                     <td>{{item.age}}</td>
                     <td>
                         <router-link  to="/validationdevote"  href="#">  
                            <button class="btn btn-info" @click="voter(key)">Vote</button>
                         </router-link>
                    </td>
                  </tr>
              
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</template>
<script>
export default {
    methods: {
        voter:function(id){
           console.log(this.$store.state.list[id].nom);
            this.$store.commit("attribuerC", this.$store.state.list[id].nom + " "+this.$store.state.list[id].prenom); 
           console.log(" condidatname :"+ this.$store.state.condidat);
      }
    }
    }
</script>