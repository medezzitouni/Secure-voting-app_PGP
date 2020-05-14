<template> 
<div class="container text-center" id="txt">
  <h1 class="mt-4" id="bienvenue" >Bienvenue</h1>
  <p>chère votant vous etes prier de voter une seul fois  pour eviter les spams <br> si vous souhaitez votez cliquez sur le button si dessous</p>
  <router-link id="Vote" to="/Vote"  href="#">  
       <button class="btn btn-info" id="rmline">Vote</button>
  </router-link>
</div>
</template>
<style>
#Vote {
  color:azure;
}
#rmline :hover{ 
  text-decoration: none;
  }
#txt {
  margin-top: 150px;
}
#bienvenue {
    font-size: 100px;
    color: beige;
}

</style>