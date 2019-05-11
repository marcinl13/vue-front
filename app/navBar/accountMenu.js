import sinIn from "./sinIn.js";
import navAccount1 from "./navAccount1.js";
import navAccount2 from "./navAccount2.js";
import navKoszyk from "./navKoszyk.js";

export default Vue.component("component-navKoszyk", {
  data: function() {
    return {
      token: "",
      role1: false,
      role2: false
    };
  },
  created: function() {
    try {
      var data = JSON.parse(localStorage.getItem("koszyk")).token[0];

      this.token = data.token == null ? "" : data.token;
      this.role1 = data.role1 == "low" ? false : true;
      this.role2 = data.role2 == "False" ? false : true;
    } catch (error) {}
  },
  methods: {
    loginFirst: function() {
      return this.token.length < 5 ? true : false;
    },
    isRoleHigh: function() {
      return this.role1 == true &&
        this.role2 == true &&
        this.loginFirst() == false
        ? true
        : false;
    },
    isRoleLow: function() {
      return this.role1 == false &&
        this.role2 == false &&
        this.loginFirst() == false
        ? true
        : false;
    }
  },
  components: {
    navKoszyk: navKoszyk,
    sinIn: sinIn,
    navAcccount1: navAccount1,
    navAcccount2: navAccount2
  },
  template: `
  <div class="mb-3">  
    <nav class="navbar navbar-light bg-light navbar-expand-md">
      <a class="navbar-brand" href="/#/shop">Sklep</a>

      <div class="navbar-collapse w-100 order-3 dual-collapse2">
        <ul class="navbar-nav ml-auto">
          
          <navKoszyk/>
          <sinIn v-if="loginFirst()"/>
          <navAcccount1 v-if="isRoleLow()==true"/>
          <navAcccount2 v-if="isRoleHigh()==true"/>

        </ul>
      </div>
    </nav>
  </div>`
});
