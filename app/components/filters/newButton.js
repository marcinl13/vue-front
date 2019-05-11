export default Vue.component("component-newButton", {
  props: ["onclickedButton"],
  methods: {
    scrollToTop: function() {
      this.onclickedButton();

      setTimeout(function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1000);
    }
  },
  template: `
  <button 
    class="form-control btn btn-small btn-success" 
    data-toggle="collapse" 
    data-target="#addNew" 
    aria-expanded="false" 
    v-on:click="scrollToTop()">
    Dodaj nowy
  </button>
  `
});
