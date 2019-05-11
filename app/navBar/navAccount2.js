import { wyloguj } from "./logout.js";

export default Vue.component("component-navKoszyk", {
  data: function() {
    return {};
  },
  methods: {
    redirect: function(_target) {
      window.location.href = "/#/" + _target;
    },
    onLogout: function() {
      wyloguj();
    }
  },
  template: `
  <li class="nav-item dropdown userSection text-center p-1" id="roleUser">
    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <img src="img/avatar.png" class="icon-sm">admin
    </a>
    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
      <a class="dropdown-item" v-on:click="redirect('sBooks')">Książki</a>
      <a class="dropdown-item" v-on:click="redirect('sAutors')">Autorzy</a>
      <a class="dropdown-item" v-on:click="redirect('sOrders')">Zamowienia</a>
      <hr class="dropdown-divider" />
      <a class="dropdown-item text-center text-primary"  v-on:click="onLogout()" >
        <i class="fa fa-sign-out  text-primary pr-1"></i>
        Log out
      </a>
    </div>
  </li>
  `
});
