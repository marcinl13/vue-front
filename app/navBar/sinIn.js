// import { login } from "./login.js";

export default Vue.component("component-sinIn", {
  data: function() {
    return {};
  },
  methods: {
    onLogin: function() {
      // login();
    }
  },
  template: `
  <a class="nav-item dropdown userSection center" href="/#/sign">
    <button type="button" class="nav-link btn btn-outline-success p-1" v-on:click="onLogin()">
      <i class="fa fa-sign-in text-primary pr-1"></i>
      Sign in
    </button>
  </a>
  `
});
