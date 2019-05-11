import { serverGet } from "../geter.js";

export default Vue.component("component-konto", {
  data: function() {
    return {
      showDiv: false,
      tel: "",
      email: "",
      ul: "",
      poczta: "",
      mzam: "",
      nrm: "",
      kpod: "",
      token: ""
    };
  },
  beforeCreate: function() {
    try {
      var data = JSON.parse(localStorage.getItem("koszyk")).token[0];

      if (
        data.role1 == "high" ||
        data.token.length < 5 ||
        data.role1.length < 1 ||
        data.role2.length < 1
      ) {
        window.location.href = "/#/shop";
      }
    } catch (error) {}
  },
  created: function() {
    try {
      var data = JSON.parse(localStorage.getItem("koszyk")).token[0];

      if (data.role1 == "low" && data.role2 == "False") {
        this.showDiv = true;
      }

      this.token = data.token;
      this.pobierzDane();
    } catch (error) {}
  },
  methods: {
    pobierzDane: function() {
      var data = serverGet(settings.apiUrl + "/adress", {
        userAPIKEY: JSON.parse(localStorage.getItem("koszyk")).token[0].token
      });

      if (Object.keys(data[0]).length > 0) {
        this.tel = data[0].telefon;
        this.email = data[0].email;
        this.ul = data[0].ulica;
        this.poczta = data[0].poczta;
        this.kpod = data[0].kod_pocztowy;
        this.mzam = data[0].miejsce_zamieszkania;
        this.nrm = data[0].nr_zamieszkania;
      }
    },
    save: function() {
      $.post(settings.apiUrl + "/adress?userapikey=" + this.token, {
        miejsce_zamieszkania: this.mzam,
        nr_zamieszkania: this.nrm,
        ulica: this.ul,
        kod_pocztowy: this.kpod,
        poczta: this.poczta,
        telefon: this.tel,
        email: this.email
      })
        .then(result => {
          Swal.fire("Sukces", result, "success");
        })
        .catch(error => {
          Swal.fire("Błąd", error, "errro");
        });
    }
  },
  template: `
  <div v-if="this.showDiv" >
  
    <div class="form-group row my-2">
      <label class="col-sm-2 col-form-label" for="tel">telefon</label>
      <input class="col-sm-6 form-control" type="text" v-model="tel" id="tel"/>
    </div>
  
    <div class="form-group row my-2">
      <label class="col-sm-2 col-form-label" for="email">email</label>
      <input class="col-sm-6 form-control" type="email" v-model="email" id="email" />
    </div>
  
    <div class="form-group row my-2">
      <label class="col-sm-2 col-form-label" for="mzam">miejsce zamieszkania</label>
      <input class="col-sm-6 form-control" type="text" v-model="mzam" id="mzam" />
    </div>
  
    <div class="form-group row my-2">
      <label class="col-sm-2 col-form-label" for="ulica">ulica</label>
      <input class="col-sm-6 form-control" type="text" v-model="ul" id="ulica" />
    </div>
  
    <div class="form-group row my-2">
      <label class="col-sm-2 col-form-label" for="nrm">nr mieszkania</label>
      <input class="col-sm-6 form-control" type="text" v-model="nrm" id="nrm" />
    </div>
  
    <div class="form-group row my-2">
      <label class="col-sm-2 col-form-label" for="kpod">kod pocztowy</label>
      <input class="col-sm-6 form-control" type="text" v-model="kpod" id="kpod" />
    </div>
  
    <div class="form-group row my-2">
      <label class="col-sm-2 col-form-label" for="poczta">poczta</label>
      <input class="col-sm-6 form-control" type="text" v-model="poczta" id="poczta" />
    </div>
  
    <button class="btn btn-success mx-auto d-block" v-on:click="save()"><i class="fa fa-send"></i>Zapisz</button>
  </div>
  `
});
