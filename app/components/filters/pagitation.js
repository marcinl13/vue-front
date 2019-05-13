export default Vue.component("component-pagitation", {
  props: ["pagi", "currentPage", "dataSize", "selectRows"],
  methods: {
    nextPage: function() {
      this.pagi("+");
    },
    prevPage: function() {
      this.pagi("-");
    },
    totalPages: function() {
      var x = this.dataSize / this.selectRows;

      if (this.dataSize > 0)
        return x > parseInt(x) ? parseInt(x) + 1 : parseInt(x);
      else return 1;
    },
    scrollToTop: function() {
      setTimeout(function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  },
  template: `
    <div class="d-flex justify-content-center pagitation" style="max-width:150px;">      
      <button class="form-control btn btn-sm btn-outline-info" type="button" v-on:click="prevPage();scrollToTop()"><<</button>
      <p class="px-3 h-1 my-auto">{{currentPage}} / {{totalPages()}}</p>
      <button class="form-control btn btn-sm btn-outline-info" type="button" v-on:click="nextPage();scrollToTop()">>></button> 
    </div>`
});
