<template>
    <!-- Navigation -->
<nav class="navbar navbar-expand-lg navbar-light bg-light static-top">
  <div class="container">
    <div class="navbar-brand" > Application De Vote</div>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
    <div class="collapse navbar-collapse" id="nv-item">
      <ul class="navbar-nav ml-auto nav-pills">
        <li class="nav-item active">
          <router-link to="/" class="nav-link" active-class="active" exact href="#">Home
                <span class="sr-only">(current)</span>
              </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/Vote" class="nav-link" active-class="active" href="#">Vote</router-link>
        </li>
      </ul>
    </div>
  </div>
</nav>

</template>