import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    index: false,
    condidat:"default",
    list:
    [
      { nom:"fdilat",prenom:"ismail",age:60},
      { nom:"lamrini",prenom:"amine",age:54},
      { nom:"yahyaoui",prenom:"yassine",age:45},
      { nom:"firass",prenom:"abderahmane",age:34},
      { nom:"lgrini",prenom:"mohamed",age:29},
      { nom:"laarbi",prenom:"aymane",age:26},
      { nom:"bayahya",prenom:"ibtissam",age:24},  
    ]
  },
  mutations: {
    attribuerC (state, payload) {
      state.condidat = payload
    },
    count (state) {
      state.index = false
    }
  },
  actions: {
    msgdisapeare (context) {
      setTimeout(() => {
        context.commit("count");
      }, 2000);
    }
  },
  modules: {
  }
})
