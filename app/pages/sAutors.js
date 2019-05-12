import { serverGet } from "../geter.js";
import optionBar from "../components/filters/optionBar.js";
import newAutor from "../components/newAutor.js";

export default Vue.component("component-sAutors", {
  data: function() {
    return {
      showDiv: false,
      token: {},
      sAutors: [{}],
      currentSort: "id",
      currentSortDir: "desc",
      onfilterLength: 1,
      currentPage: 1,
      selected: 5,
      filtruj: "",
      optionBarSettingsTop: {
        newButton: true,
        selectByPage: true,
        searchBy: true,
        pagitation: true
      },
      optionBarSettingsBottom: {
        pagitation: true
      }
    };
  },
  beforeCreate: function() {
    var data = JSON.parse(localStorage.getItem("koszyk")).token[0];

    if (data.role1 != "high" && data.role2 != "True") {
      window.location.href = "/#/shop";
    }
  },
  created: function() {
    try {
      var data = JSON.parse(localStorage.getItem("koszyk")).token[0];

      if (data.role1 == "high" && data.role2 == "True") {
        this.showDiv = true;
      }

      this.token = data;
      this.pobierzDane();
    } catch (error) {}
  },
  methods: {
    pobierzDane: function() {
      try {
        this.sAutors = serverGet(
          settings.apiUrl + "/autor?userapikey=" + this.token.token
        );
      } catch (error) {}
    },
    edytujAutora: function(_id) {
      var data = this.sAutors.filter(function(data) {
        return data.id == _id;
      })[0];

      $(".collapse").collapse("show");
      document.getElementById("id").value = data.id;
      document.getElementById("aFirstName").value = data.imie;
      document.getElementById("aLastName").value = data.nazwisko;
    },
    usunAutora: function(_id) {
      var dane = serverGet(
        settings.apiUrl +
          "/autor?userapikey=" +
          this.token.token +
          "&id=" +
          _id,
        "",
        "",
        "json",
        "Delete"
      );

      if (dane == "Usunięto") {
        Swal.fire("OK", dane, "seccess");
      } else Swal.fire("Błąd", dane, "error");

      // console.log(dane);
      this.wyczyscDaneAutora();
      this.reload();
    },
    wyczyscDaneAutora: function() {
      document.getElementById("id").value = "";
      document.getElementById("aFirstName").value = "";
      document.getElementById("aLastName").value = "";
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
          if (this.currentPage * this.selected < this.onfilterLength)
            this.currentPage++;
        }
        if (_typ == "start") {
          this.currentPage = 1;
        }
        return false;
      } catch (error) {}
    },
    itemListCount: function(_num) {
      this.selected = _num;
    },
    reload: function() {
      this.pobierzDane();
    },
    searchBy: function(_sth) {
      this.filtruj = _sth;
      this.onFilter();
    },
    onFilter: function() {
      var fil = this.filtruj;

      var data = this.sAutors.filter(function(data) {
        return (
          data.imie.toLowerCase().indexOf(fil.toLowerCase()) == 0 ||
          data.nazwisko.toLowerCase().indexOf(fil.toLowerCase()) == 0
        );
      });

      this.onfilterLength = data.length;

      return data;
    }
  },
  components: {
    optionBar: optionBar,
    newAutor: newAutor
  },
  computed: {
    sortedAuthors: function() {
      var filtered = this.onFilter();
      return filtered
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
  <div v-if="showDiv" class="d-block w-100 px-3 ">
    <newAutor 
      class="collapse"
      id="addNew"
      :reload=reload
    />

    <optionBar
      :dataSize=onfilterLength
      :itemListCount=itemListCount
      :pagi=pagi :currentPage=currentPage  :selectRows=selected 
      :optionBarSettings=optionBarSettingsTop
      :searchBy=searchBy 
      :clickedButton=wyczyscDaneAutora
    />

    <table class="table table-striped table-hover table-sm ">
      <thead class="table-primary">
        <th class="text-center">Lp.</th>
        <th class="text-center" v-on:click="sort('id')">ID</th>
        <th class="text-center" v-on:click="sort('imie')">Imię</th>
        <th class="text-center" v-on:click="sort('nazwisko')">Nazwisko</th>
        <th class="text-center">Opcje</th>
      </thead>
      <tbody class="table-light">
        <tr v-for="(autor, count) in sortedAuthors">
          <td class="text-center">{{ ((-1 + currentPage) * selected) +( count+1)}}</td>
          <td class="text-center">{{autor.id}}</td>
          <td class="text-center">{{autor.imie}}</td>
          <td class="text-center">{{autor.nazwisko}}</td>
          <td>
            <div style="justify-content: center;display: grid; max-width: 162">
              <button class="btn form-control btn-primary" v-on:click="edytujAutora(autor.id)">edytuj</button>
              <button class="btn form-control btn-danger" v-on:click="usunAutora(autor.id)">usuń</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <optionBar
      :dataSize=onfilterLength
      :itemListCount=itemListCount
      :pagi=pagi :currentPage=currentPage  :selectRows=selected 
      :optionBarSettings=optionBarSettingsTop
      :clickedButton=wyczyscDaneAutora
    />
  </div>
  `
});
