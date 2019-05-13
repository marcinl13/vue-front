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
      currentSort: "id",
      currentSortDir: "desc",
      currentPage: 1,
      onfilterLength: 1,
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
      document.getElementById("addNew").style.display = "none";
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
      // console.log(sAutors)
      this.onfilterLength = this.sBooks.length;
    },
    editBook: function(_id) {
      var data = this.sBooks.filter(function(data) {
        return data.id == _id;
      })[0];

      // $(".collapse").collapse("show");
      document.getElementById("addNew").style.display = "flex";
      document.getElementById("id").value = _id;
      document.getElementById("tytul").value = data.tytul;
      document.getElementById("autor").value = data.autorID;
      document.getElementById("cena").value = data.cena;
      document.getElementById("zdjecie").value = data.zdjecie;
      document.getElementById("zdjecie").dispatchEvent(new Event("input"));
      // document.getElementById("imgPreview").src = data.zdjecie;
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
    clearData: function() {
      document.getElementById("addNew").style.display = "flex";
      document.getElementById("id").value = "";
      document.getElementById("tytul").value = "";
      document.getElementById("autor").value = 0;
      document.getElementById("cena").value = "";
      document.getElementById("zdjecie").value = "";
      document.getElementById("zdjecie").dispatchEvent(new Event("input"));
    },
    searchBy: function(_sth) {
      this.filtruj = _sth;
      // this.getData();
      this.onFilter();
    },
    onFilter: function() {
      var fil = this.filtruj;

      var data = this.sBooks.filter(function(data) {
        return data.tytul.toLowerCase().indexOf(fil.toLowerCase()) == 0;
      });

      this.onfilterLength = data.length;

      return data;
    },
    validURL: function(str) {
      var pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
          "(\\#[-a-z\\d_]*)?$",
        "i"
      ); // fragment locator
      return !!pattern.test(str);
    },
    imagePreview: function(_image) {
      return this.validURL(_image)
        ? _image
        : "https://childrensmattressesonline.co.uk/i/others/empty-product-large.png?v=5c3fc1a0";
    }
  },
  components: { optionBar: optionBar, newBook: newBook },
  computed: {
    sortedBooks: function() {
      var filtered = this.sBooks;
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
  <div v-if="showDiv==true">
    <newBook 
      
      id="addNew"
      :reload=getData
      :sAutors=sAutors
      style="display:none;"
    />

    <optionBar
      :dataSize=onfilterLength
      :itemListCount=itemListCount
      :pagi=pagi :currentPage=currentPage  :selectRows=selected 
      :searchBy=searchBy 
      :optionBarSettings=optionBarSettingsTop
      :clickedButton=clearData
    />

    <div class="d-flex">
      <table class="table table-striped table-hover w-auto my-1 mx-auto">
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
            <td class="text-center col-sm-3">
              <a class="thumbnail" href="#">
                <p>podgląd</p>
                <span>
                  <img class="small-img" :src=imagePreview(book.zdjecie) />              
                </span>
              </a> 
            </td>
            <td>
              <div style="justify-content: center;display: grid; max-width: 162">
                <button class="btn form-control btn-primary mb-1" v-on:click="editBook(book.id)">edytuj</button>
                <button class="btn form-control btn-danger" v-on:click="deleteBook(book.id)">usuń</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <optionBar
      :dataSize=onfilterLength
      :itemListCount=itemListCount
      :pagi=pagi :currentPage=currentPage  :selectRows=selected 
      :searchBy=searchBy 
      :optionBarSettings=optionBarSettingsBottom
    />
  </div>
  `
});
