export default Vue.component("component-search", {
  props:["searchBy"],
  data: function() {
    return {};
  },
  methods: {
    filterBy: function(_value) {
      this.searchBy(_value);
    }
  },
  template: `
    <input 
      class="form-control w-25" 
      type="text" 
      placeholder="Szukaj tytułu"
      v-on:input="filterBy($event.target.value)" 
    />
  `
});
