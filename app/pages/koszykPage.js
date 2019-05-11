import { serverGet } from "../geter.js";

export default Vue.component("component-koszykPage", {
  data: function() {
    return {
      productsList: [{}],
      token: ""
    };
  },
  created: function() {
    try {
      var data = JSON.parse(localStorage.getItem("koszyk"));

      this.productsList = serverGet(settings.apiUrl + "/Books", {
        typ: "ids:" + data.products.join(",")
      });

      this.token = data.token[0].token == null ? "" : data.token[0].token;
    } catch (error) {}
  },
  methods: {
    sumPrice: function() {
      try {
        var priceSum = 0.0;

        this.productsList.forEach(element => {
          priceSum += parseFloat(element.cena);
        });

        return priceSum.toFixed(2) + " zł";
      } catch (error) {}
    },
    removeMe: function(_target) {
      var rowIndex = _target.offsetParent.parentNode.rowIndex;
      this.productsList.splice(rowIndex, 1);
      this.sumPrice();
    },
    sort: function(s) {
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    },
    makeOrder: function() {
      if (this.productsList < 1) {
        Swal.fire("Błąd", "Brak produktów", "error");
        window.location.href = "#/shop";
        return false;
      }

      if (this.token.length < 5) {
        Swal.fire("Błąd", "Zaloguj się", "error");

        //redirect
        window.location.href = "#/sign";
        return false;
      }

      var koszyk = [];

      this.productsList.forEach(element => {
        koszyk.push(element.id);
      });

      console.log(koszyk.join(","), this.token);

      $.post(
        "https://restmp.azurewebsites.net/api/orders?zamowienia=" +
          koszyk.join(",") +
          "&userAPIKEY=" +
          this.token
      )
        .then(result => {
          Swal.fire("", result, "success");

          var koszykData = JSON.parse(localStorage.getItem("koszyk"));
          koszykData.products = null;
          localStorage.setItem("koszyk", JSON.stringify(koszykData));

          window.location.href = "#/shop";
        })
        .catch(error => {
          Swal.fire("Błąd", error, "error");
        });
    }
  },
  componets: {},
  template: `
  <div class="d-block w-100 px-3 ">

    <table class="table table-striped table-hover table-sm">
      <thead class="table-primary">
        <th class="text-center" style="width: 8%;">Lp.</th>
        <th class="text-center" v-on:click="sort('tytul')">Tytuł</th>
        <th class="text-center" v-on:click="sort('autor')">Autor</th>
        <th class="text-left" v-on:click="sort('cena')">Cena</th>
        <th></th>
      </thead>
      <tbody v-if="productsList.length>0">
        <tr v-for="(book,count) in productsList">
          <input type="hidden" class="bid" name="id" :value="book.id">
          <td class="text-center numeracja">{{ ((-1 + currentPage) * selected) +( count+1)}}</td>
          <td class="text-center">{{book.tytul}}</td>
          <td class="text-center">{{book.autor}}</td>
          <td class="text-center cena">{{book.cena}} zł</td>
          <td>
            <div class="order" v-on:click="removeMe($event.target)">
              <img alt="" src="img/delete.png" />
              Usuń</div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="5" class="text-center">Brak zamówień</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
        
          <td colspan="3" class="text-right align-middle">Suma</td>
          <td class="text-left result align-middle">{{sumPrice()}} zł</td>
          <td><input class="btn btn-success" type="submit" value="Zamów" v-on:click="makeOrder()"></td>
        </tr>
      </tfoot>
    </table>
  </div>
  `
});
