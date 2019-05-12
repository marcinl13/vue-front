export default Vue.component("component-signPage", {
  data: function() {
    return {
      showDiv: false,
      message: "Logowanie/Rejestracja",
      logInMe: "",
      pass: ""
    };
  },
  beforeCreate: function() {
    var data = JSON.parse(localStorage.getItem("koszyk")).token[0];

    if (data.token != "") {
      window.location.href = "/#/shop";
    }
  },
  created: function() {
    try {
      var data = JSON.parse(localStorage.getItem("koszyk")).token[0];

      if (data.token == "") {
        this.showDiv = true;
      }
    } catch (error) {}
  },
  methods: {
    login: function() {
      if (this.pass == "" && this.logInMe == "") {
        Swal.fire("Błąd", "Uzupełnij pola", "warning");
        return;
      }

      $.post(`${settings.apiUrl}/account/login`, {
        login: this.logInMe,
        pswd: this.pass,
        apikey: ""
      })
        .then(result => {
          var splited = result.split("@");
          var koszykData = JSON.parse(localStorage.getItem("koszyk"));

          if (splited.length == 3 && splited[0].length > 10) {
            koszykData.token = [
              {
                token: splited[0],
                role1: splited[1],
                role2: splited[2]
              }
            ];

            koszykData.konto = this.logInMe;
            localStorage.setItem("koszyk", JSON.stringify(koszykData));

            Swal.fire("Zalogowano", splited[0], "success");

            //redirect
            window.location.href = "/#/shop";

            window.location.reload(true);
          } else {
            Swal.fire("Błąd", "Dane nie są poprawne", "error");
          }
        })
        .catch(error => {
          Swal.fire("Błąd", error.responseJSON.message, "error");
        });
    },
    register: function() {
      if (this.pass == "" && this.logInMe == "") {
        Swal.fire("Błąd", "Uzupełnij pola", "warning");
        return;
      }

      $.post(`${settings.apiUrl}/account/register`, {
        login: this.logInMe,
        pswd: this.pass
      })
        .then(result => {
          Swal.fire(result, result, "success");
          this.login();
        })
        .catch(error => {
          Swal.fire("Błąd", error.responseJSON.message, "error");
        });
    }
  },
  template: `  
  <div v-if="showDiv" class="modal-dialog modal-small" >
    <div class="modal-content">
      <!-- Modal body -->
      <div class="modal-body">
        <div class="text-center">
          <i class="fa fa-user prefix"></i>
          <input v-model="logInMe" type="text" name="user" class="form-control" placeholder="Login" required="" autofocus="" >
        </div>
        <div class="text-center">
          <i class="fa fa-lock prefix"></i>
          <input v-model="pass" type="password" name="pswd" class="form-control" placeholder="Hasło" required="">
        </div>
        <div class="text-center">
          <button v-on:click="login()" class="d-inline-block btn btn-outline-success" name="submit" type="submit" style="display:inherit; margin: 0em auto;"><i class="fa fa-sign-in"></i> Zaloguj</button>
          <button v-on:click="register()"  class="d-inline-block btn btn-outline-primary" name="submit" type="submit" style="display:inherit; margin: 0em auto;"><i class="fa fa-send "></i> Zarejestruj</button>
        </div>
      </div>
    </div>
  </div>
  `
});
