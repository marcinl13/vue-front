import { serverGet } from "../geter.js";
import optionBar from "../components/filters/optionBar.js";
import newBook from "../components/newBook.js";

export default Vue.component("component-sBooks", {
  data: function() {
    return {
      showDiv: false,
      token: "",
      sBooks: [{}],
      sAutors: [{}],
      currentSort: "tytul",
      currentSortDir: "asc",
      currentPage: 1,
      selected: 5,
      filtruj: "",
      optionBarSettingsTop: {
        newButton: true,
        searchBy: true,
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
      this.getData();
    } catch (error) {}
  },
  methods: {
    getData: function() {
      if (this.filtruj != "")
        this.sBooks = serverGet(settings.apiUrl + "/books2", {
          r: this.filtruj
        });
      else this.sBooks = serverGet(settings.apiUrl + "/books2");

      this.sAutors = serverGet(
        settings.apiUrl + "/autor?userapikey=" + this.token
      );
    },
    editBook: function(_id) {
      var data = this.sBooks.filter(function(data) {
        return data.id == _id;
      })[0];

      $(".collapse").collapse("show");
      document.getElementById("id").value = _id;
      document.getElementById("tytul").value = data.tytul;
      document.getElementById("autor").value = data.autorID;
      document.getElementById("cena").value = data.cena;
      document.getElementById("zdjecie").value = data.zdjecie;
      document.getElementById("imgPreview").src = data.zdjecie;
    },
    deleteBook: function(_id) {
      var dane = serverGet(
        `${settings.apiUrl}/books2?userapikey=${this.token}&id=${_id}`,
        "",
        "",
        "json",
        "Delete"
      );

      console.log(dane);

      if (dane == "Usunięto") {
        Swal.fire("OK", dane, "seccess");
      } else Swal.fire("Błąd", dane, "error");

      this.clearData();
      this.getData();
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
          if (this.currentPage * this.selected < this.sBooks.length)
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
      this.getData();
    },
    itemListCount: function(_num) {
      this.selected = _num;
    },
    clearData: function() {
      document.getElementById("id").value = "";
      document.getElementById("tytul").value = "";
      document.getElementById("autor").value = 0;
      document.getElementById("cena").value = "";
      document.getElementById("zdjecie").value = "";
    }
  },
  components: { optionBar: optionBar, newBook: newBook },
  computed: {
    sortedBooks: function() {
      return this.sBooks
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
  <div v-if="showDiv==true">
    <newBook 
      class="collapse"
      id="addNew"
      :reload=getData
      :sAutors=sAutors
    />

    <optionBar
      :dataSize=sBooks.length
      :itemListCount=itemListCount
      :pagi=pagi :currentPage=currentPage  :selectRows=selected 
      :searchBy=searchBy 
      :optionBarSettings=optionBarSettingsTop
      :clickedButton=clearData
    />

    <table class="table table-striped table-hover table-sm ">
      <thead class="table-primary">
        <th class="text-center">Lp.</th>
        <th class="text-center" v-on:click="sort('tytul')">Tytuł</th>
        <th class="text-center" v-on:click="sort('autor')">Autor</th>
        <th class="text-center" v-on:click="sort('cena')">Cena</th>
        <th class="text-center" v-on:click="sort('zdjecie')">Zdjęcie</th>
        <th class="text-center" >Opcje</th>
      </thead>
      <tbody class="table-light">
        <tr v-for="(book, count) in sortedBooks">
          <td class="text-center">{{ ((-1 + currentPage) * selected) +( count+1)}}</td>
          <td class="text-center">{{book.tytul}}</td>
          <td class="text-center">{{book.autor}}</td>
          <td class="text-center">{{book.cena}} zł</td>
          <td class="text-center col-sm-3">{{book.zdjecie}}</td>
          <td>
            <div style="justify-content: center;display: grid; max-width: 162">
              <button class="btn form-control btn-primary mb-1" v-on:click="editBook(book.id)">edytuj</button>
              <button class="btn form-control btn-danger" v-on:click="deleteBook(book.id)">usuń</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <optionBar
      :dataSize=sBooks.length
      :itemListCount=itemListCount
      :pagi=pagi :currentPage=currentPage  :selectRows=selected 
      :searchBy=searchBy 
      :optionBarSettings=optionBarSettingsBottom
    />
  </div>
  `
});
