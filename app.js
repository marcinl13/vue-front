import accountMenu from "./app/navBar/accountMenu.js";
import bookPage from "./app/pages/bookPage.js";
import koszykPage from "./app/pages/koszykPage.js";
import signPage from "./app/pages/signPage.js";
import kontoPage from "./app/pages/kontoPage.js";
import zamowieniaPage1 from "./app/pages/zamowieniaPage1.js";

import sBooks from "./app/pages/sBooks.js";
import sOrders from "./app/pages/sOrders.js";
import sAutors from "./app/pages/sAutors.js";

const routes = [
  { path: "/", component: bookPage },
  { path: "/shop", component: bookPage },
  { path: "/koszyk", component: koszykPage },
  { path: "/sign", component: signPage },
  { path: "/konto", component: kontoPage },
  { path: "/zamowienia", component: zamowieniaPage1 },

  { path: "/sAutors", component: sAutors },
  { path: "/sBooks", component: sBooks },
  { path: "/sOrders", component: sOrders },
];

const router = new VueRouter({
  routes
});

const app = new Vue({
  router
}).$mount("#app");

const navBar = new Vue({
  components: {
    accountMenu: accountMenu
  },
  template: `<accountMenu />`
}).$mount("#navbar");


