export default Vue.component("component-selectByPage", {
  props: ["itemListCount", "pagi"],
  data: function() {
    return {
      rows: [5, 10, 15]
    };
  },
  methods: {
    selectByPage: function(_value) {
      this.itemListCount(_value);
      this.pagi("start");
    }
  },
  template: `
  <div class=" ">
    <select id="sPages" class="form-control" v-on:change="selectByPage($event.target.value);">
      <option v-for="row in rows" :value=row>{{row}}</option>
    </select>  
  </div> 
  `
});
