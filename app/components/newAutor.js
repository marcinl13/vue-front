export default Vue.component("component-newAutor", {
  props: ["reload"],
  data: function() {
    return {
      token: {}
    };
  },
  created: function() {
    try {
      var data = JSON.parse(localStorage.getItem("koszyk")).token[0];
      this.token = data;
    } catch (error) {}
  },
  methods: {
    onAddAutor: function() {
      var aId = document.getElementById("id").value;
      var aFirstName = document.getElementById("aFirstName").value;
      var aLastName = document.getElementById("aLastName").value;

      if (aFirstName == "" || aLastName == "") {
        Swal.fire("Błąd", "Uzupełnij wszystkie pola", "warning");
        return;
      }

      $.post(settings.apiUrl + "/autor?userapikey=" + this.token.token, {
        imie: aFirstName,
        nazwisko: aLastName,
        id: aId
      })
        .then(result => {
          Swal.fire("Sukces", result, "success");
          this.reload();
        })
        .catch(error => {
          Swal.fire("Błąd", error.responseJSON.message, "error");
        });
    }
  },
  template: `
  <div>
    <div class="row">
    <div class="border form d-inline-block px-5 py-2 center-block mx-auto mb-2">
      <h2 class="text-center">nowy autor</h2> 
       <hidden id="id" />
      <div class="form-group row mb-0  justify-content-around">
        <label for="aFirstName" class="col-sm-2 col-form-label col-form-label-sm mr-2">imie</label>
        <input class="form-control" id="aFirstName" type='text'   placeholder="podaj imie"></input>
      </div>  

      <div class="form-group row mb-0  justify-content-around">
        <label for="aLastName" class="col-sm-2 col-form-label col-form-label-sm mr-2">nazwisko</label>
        <input class="form-control" id="aLastName" type='text'   placeholder="podaj nazwisko"></input>
      </div>       

      <div class="d-flex justify-content-center">
        <button class="btn btn-outline-success mx-2" v-on:click="onAddAutor()">
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
