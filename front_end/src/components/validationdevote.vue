<template>
<div>
   <div v-if="!this.$store.state.index" class="alert alert-info text-center" role="alert">
                Vous avez voté {{this.$store.state.condidat}}
   </div>
   <div v-if="this.$store.state.index" class="alert alert-info text-center" role="alert">
                    desolé, votre vote rencontre un probleme, veuillez réessayez
   </div>
   <div v-if="this.$store.state.index" class="alert alert-info text-center" role="alert">
                Votre vote a bien été envoyer
   </div>
   <div class="container-fluid py-3">
    <div class="row">
        <div class="col-md-5 mx-auto">
                <div class="card card-body">
                    <h3 class="text-center mb-4">Sign-up</h3>
                    <form>
                       <div v-if="!nom" class="alert alert-danger">
                           <a class="close font-weight-light" data-dismiss="alert" href="#">×</a> ce champ  est vide.
                        </div>
                        <div class="form-group has-error">
                            <input v-model="nom" class="form-control input-md" placeholder="Nom" name="nom" type="text">
                        </div>
                        <div v-if="!prenom" class="alert alert-danger">
                           <a class="close font-weight-light" data-dismiss="alert" href="#">×</a> ce champ  est vide.
                        </div>
                        <div class="form-group has-success">
                            <input v-model="prenom" class="form-control input-md" placeholder="Prenom" name="prenom" value="" type="text">
                        </div>
                        
                        <div v-if="!id" class="alert alert-danger">
                            <a class="close font-weight-light" data-dismiss="alert" href="#">×</a> ce champ  est vide.
                        </div>
                        <div class="form-group has-success">
                            <input v-model="id" class="form-control input-md" placeholder="Numéro d'identification" name="id" value="" type="text">
                        </div>
                        <input class="btn btn-lg btn-info btn-block" value="envoyer le vote" type="submit">
                    </form>
                </div>
        </div>
    </div>
</div>
</div>
</template>