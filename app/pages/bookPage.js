import optionBar from "../components/filters/optionBar.js";
import { serverGet } from "../geter.js";

export default Vue.component("component-bookPage", {
  data: function() {
    return {
      books: [{}],
      currentSort: "tytul",
      currentSortDir: "asc",
      currentPage: 1,
      selected: 5,
      filtruj: "",
      optionBarSettingsTop: {
        searchBy: true,
        selectByPage: true,
        pagitation: true
      },
      optionBarSettingsBottom: {
        pagitation: true
      }
    };
  },
  created: function() {
    this.pobierzDane();
  },
  methods: {
    pobierzDane: function() {
      if (this.filtruj != "")
        this.books = serverGet(settings.apiUrl + "/books2", {
          r: this.filtruj
        });
      else this.books = serverGet(settings.apiUrl + "/books2");
    },
    addBookToOrder: function(_num) {
      console.log(_num);
      var koszykData = JSON.parse(localStorage.getItem("koszyk"));

      koszykData.products[koszykData.products.length] = _num;

      localStorage.setItem("koszyk", JSON.stringify(koszykData));

      document.getElementById("ordersCount").innerText =
        koszykData.products.length;
    },
    pagi: function(_typ) {
      try {
        if (_typ == "-") {
          if (this.currentPage > 1) this.currentPage--;
        }
        if (_typ == "+") {
          if (this.currentPage * this.selected < this.books.length)
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
    }
  },
  components: {
    optionBar: optionBar
  },
  computed: {
    sortedBooks: function() {
      return this.books
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
  <div >
    <optionBar
      :dataSize=books.length
      :itemListCount=itemListCount
      :pagi=pagi :currentPage=currentPage  :selectRows=selected 
      :searchBy=searchBy 
      :optionBarSettings=optionBarSettingsTop
    />

    <div class="books d-flex justify-content-center justify-items-center">
      <div class="kafelka" v-for="book in sortedBooks">
        <img :src="book.zdjecie" class="card-img-top">
        <q>{{book.tytul}}</q>
        <h6>{{book.autor}}</h6>
        <p class="card-text float-left">{{book.cena}} zł</p>
        <button href="#" class="btn btn-sm btn-success my-1" @click="addBookToOrder(book.id)">Dodaj</button>
      </div>
    </div>

    <optionBar
      :dataSize=books.length
      :itemListCount=itemListCount
      :pagi=pagi :currentPage=currentPage  :selectRows=selected 
      :searchBy=searchBy 
      :optionBarSettings=optionBarSettingsBottom
    />
  </div>
  `
});
