export default Vue.component("component-newBook", {
  props: ["reload", "sAutors"],
  data: function() {
    return {
      title: "nowa ksiażka",
      token: "",
      autorzy: [{}],
      imgFast: " "
    };
  },
  created: function() {
    try {
      var data = JSON.parse(localStorage.getItem("koszyk")).token[0];
      this.token = data.token;

      this.autorzy = this.sAutors;
    } catch (error) {}
  },
  methods: {
    onAddBook: function() {
      var id = document.getElementById("id").value;
      var tytul = document.getElementById("tytul").value;
      var autor = document.getElementById("autor").value;
      var cena = document.getElementById("cena").value;
      var zdjecie = document.getElementById("zdjecie").value;

      if (tytul == "" || autor == "" || cena == "" || zdjecie == "") {
        Swal.fire("Błąd", "Uzupełnij wszystkie pola", "warning");
        return;
      }

      $.post(settings.apiUrl + "/books2?userapikey=" + this.token, {
        id: id,
        tytul: tytul,
        autor_id: autor,
        cena: cena.replace(",", "."),
        zdjecie: zdjecie
      })
        .then(result => {
          Swal.fire("Sukces", result, "success");
          document.getElementById("addNew").style.display = "none";
          this.reload();
        })
        .catch(error => {
          Swal.fire("Błąd", error.responseJSON.message, "error");
        });
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
    imagePreview: function() {
      var _image = document.getElementById("zdjecie").value;
      var src =
        "https://childrensmattressesonline.co.uk/i/others/empty-product-large.png?v=5c3fc1a0";

      if (_image.length > 5) {
        src = this.validURL(_image)
          ? _image
          : "https://childrensmattressesonline.co.uk/i/others/empty-product-large.png?v=5c3fc1a0";
      }
      // console.log(src);
      // this.imgFast = src
      AddimagePreview.srcset = src;
    }
  },
  template: `
  <div class=" justify-content-center">
    <div class="row border mb-3 d-inline-flex">
    
      <!--<div class="col">
        <img class="d-block rounded p-3 preview" id="imgPreview"  :src=imgFast alt="" />    
      </div>-->

      <div class="col py-2 mb-2">
        <h2 class="text-center">{{title}}</h2> 

        <input type="hidden" id="id">
        
        <div class="form-group row my-2">
          <label for="tytul" class="col-sm-3 col-form-label">Tytuł</label>
          <input type="text" class="col-sm-6 form-control" id="tytul">
        </div>

        <div class="form-group row">
          <label for="autor" class="col-sm-3 col-form-label">Autor</label>
          <select class="col-sm-6 form-control" id="autor">
            <option value="0" >Wybierz autora</option>
            <option v-for="autor in autorzy" :value="autor.id" >{{autor.imie}} {{autor.nazwisko}}</option>
          </select>
        </div>

        <div class="form-group row">
          <label for="cena" class="col-sm-3 col-form-label">Cena</label>
          <input type="text" class="col-sm-6 form-control" id="cena">
          <label for="cena" class="col-sm-2 col-form-label">zł</label>
        </div>

        <div class="form-group row">
          <label for="zdjecie" class="col-sm-3 col-form-label">Zdjecie</label>
          <input type="text" class="col-sm-6 form-control" id="zdjecie" v-model="imgFast" v-on:input="imagePreview()">
          
          <a class="thumbnail" href="#">
              <p>podgląd</p>
              <span>
                <img class="small-img" id="AddimagePreview" src="" />              
              </span>
            </a> 
        </div>

        <div class="d-flex justify-content-center">
          <button class="btn btn-outline-success mx-2" v-on:click="onAddBook()">
            <i class="fa fa-save mr-1 text-dark"></i>Zapisz
          </button>
          <button class="btn btn-outline-danger mx-2" v-on:click="document.getElementById('addNew').style.display = 'none';">
            <i class="fa fa-close mr-1 text-dark"></i>Close
          </button>
        </div>
      </div>
    </div>
  </div>
  `
});
