import optionBar from "../components/filters/optionBar.js";
import { serverGet } from "../geter.js";

export default Vue.component("component-sOrders", {
  data: function() {
    return {
      showDiv: false,
      zamowienia: [{}],
      szczegoly: [{}],
      statusy: {
        1: "Anulowano",
        2: "Zrealizowano",
        3: "W realizacji"
      },
      token: "",
      currentSort: "dataZamowienia",
      currentSortDir: "asc",
      currentPage: 1,
      selected: 5,
      filtruj: "",
      optionBarSettingsTop: {
        selectByPage: true,
        pagitation: true
      },
      optionBarSettingsBottom: {
        pagitation: true
      }
    };
  },
  beforeCreate: function() {
    try {
      var data = JSON.parse(localStorage.getItem("koszyk")).token[0];

      if (data.role1 != "high" && data.role2 != "True") {
        window.location.href = "/#/shop";
      }
    } catch (error) {}
  },
  created: function() {
    try {
      var data = JSON.parse(localStorage.getItem("koszyk")).token[0];

      if (data.role1 == "high" && data.role2 == "True") {
        this.showDiv = true;
      }

      this.token = data.token;
      this.pobierzDane();
      this.details();
    } catch (error) {}
  },
  methods: {
    pobierzDane: function() {
      var dane = serverGet(settings.apiUrl + "/orders", {
        userAPIKEY: this.token
      });

      this.zamowienia = dane;
    },
    details: function() {
      var args = [];

      this.zamowienia.forEach(element => {
        element.ksiazki.split(",").forEach(ksiazka => {
          args.push(ksiazka);
        });
      });

      var unique = [...new Set(args)];

      this.szczegoly = serverGet(settings.apiUrl + "/books2", {
        r: unique.join(",")
      });
    },
    sort: function(s) {
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    },
    pagi: function(_typ) {
      try {
        if (_typ == "-") {
          if (this.currentPage > 1) this.currentPage--;
        }
        if (_typ == "+") {
          if (this.currentPage * this.selected < this.zamowienia.length)
            this.currentPage++;
        }
        if (_typ == "start") {
          this.currentPage = 1;
        }
        return false;
      } catch (error) {}
    },
    searchBy: function(_sth) {
      this.filtruj = _sth;
      this.pobierzDane();
    },
    itemListCount: function(_num) {
      this.selected = _num;
    },
    generateDetailsTable: function(_ids) {
      var tmp = "";
      var count = 0;
      _ids.split(",").forEach(element => {
        var data = this.szczegoly.filter(function(data) {
          return data.id == element;
        });
        count += 1;
        tmp += `<tr><td>${count}</td><td>${data[0].tytul.trim()}</td><td>${data[0].autor.trim()}</td><td>${data[0].cena.trim()}</td></tr>`;
      });

      Swal.fire({
        title: "",
        type: "info",
        html:
          "<table class='table table-striped table-response table-hover table-sm'><thead class='table-primary'><th class='text-center' style='width: 8%;'>Lp.</th>" +
          "<th class='text-center'>Tytuł</th><th class='text-center'>Autor</th><th class='text-left'>Cena</th>" +
          "</thead><tbody>" +
          tmp +
          "</tbody></table>",
        showCloseButton: true,
        focusConfirm: false
      });

      return ` 
      <table class="table table-striped table-hover table-sm">
        <thead class="table-primary">
          <th class="text-center" style="width: 8%;">Lp.</th>
          <th class="text-center">Tytuł</th>
          <th class="text-center">Autor</th>
          <th class="text-left">Cena</th>
          <th></th>
        </thead>
        <td>{{zamowienie.dataZamowienia}}</td>
      </table>

        `;
    },
    onChangeStatus: function(_target, _id) {
      var value = _target.value;

      if (value == 0) return;

      Swal.fire({
        title: "",
        text: "Czy chcesz zmienić status na " + this.statusy[value],
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
      }).then(result => {
        if (result.value) {
          serverGet(
            `https://restmp.azurewebsites.net/api/orders?id=${_id}&status=${value}`,
            "",
            "",
            "json",
            "PUT"
          );
          Swal.fire("Zapisano zmiany!", "", "success").then(result => {
            if (result.value) {
              this.pobierzDane();
            }
          });
        }
      });
    }
  },
  components: { optionBar: optionBar },
  computed: {
    sortedOrders: function() {
      return this.zamowienia
        .sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === "desc") modifier = -1;
          if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        })
        .filter((row, index) => {
          let start = (this.currentPage - 1) * this.selected;
          let end = this.currentPage * this.selected;
          if (index >= start && index < end) return true;
        });
    }
  },
  template: `  
  <div class="px-3" v-if="showDiv==true">
  
    <optionBar
      :dataSize=zamowienia.length
      :itemListCount=itemListCount
      :pagi=pagi :currentPage=currentPage  :selectRows=selected
      :optionBarSettings=optionBarSettingsTop
    />

    <table class="zamowienia table table-striped table-hover table-sm ">
    <thead class="table-primary" >
      <th class="text-center col-sm-1" style="width: 8%;">Lp.</th>
      <th class="text-center" v-on:click="sort('dataZamowienia')">Data Zamowienia</th>
      <th class="text-center" v-on:click="sort('dataRealizacji')">Data Realizacji</th>
      <th class="text-center" v-on:click="sort('status')">Status</th>
      <th class="text-left" v-on:click="sort('cena')">Cena</th>
      <th class="text-center col-sm-2">Opcje</th>
    </thead>
    <tbody>
      <tr v-for="(zamowienie,count) in sortedOrders" :class="{ 
        'table-warning': zamowienie.status == 1 , 
        'table-success': zamowienie.status == 2,
        'table-light': zamowienie.status == 3}">
        <td>{{ ((-1 + currentPage) * selected) +( count+1)}}</td>
        <td>{{zamowienie.dataZamowienia}}</td>
        <td>{{zamowienie.dataRealizacji}}</td>
        <td>{{statusy[zamowienie.status]}}</td>
        <td>{{zamowienie.cena}} zł</td>
        <td>
          <div style="justify-content: center;display: grid; max-width: 162">
            <button class="btn btn-success form-control mb-1 w-100" v-on:click="generateDetailsTable(zamowienie.ksiazki)">Pokaż szczegóły</button>
            <select class="form-control" v-if="zamowienie.status!=2" id="selectStatus" v-on:change="onChangeStatus($event.target, zamowienie.id)">
              <option value="0">Zmień status na</option>
              <option value="1" v-if="zamowienie.status!=1" >{{statusy[1]}}</option>
              <option value="2" v-if="zamowienie.status!=2">{{statusy[2]}}</option>
              <option value="3" v-if="zamowienie.status!=3">{{statusy[3]}}</option>
            </select>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <optionBar
      :dataSize=zamowienia.length
      :itemListCount=itemListCount
      :pagi=pagi :currentPage=currentPage  :selectRows=selected
      :optionBarSettings=optionBarSettingsBottom
    />
  </div>  
  `
});
