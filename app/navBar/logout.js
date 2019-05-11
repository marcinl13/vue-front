export function wyloguj() {
  Swal.fire({
    title: "Czy chcesz się wylogować",
    text: " ",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes"
  }).then(result => {
    if (result.value) {
      var koszykData = JSON.parse(localStorage.getItem("koszyk"));
      koszykData.token = [{ token: "", role1: "", role2: "" }];
      localStorage.setItem("koszyk", JSON.stringify(koszykData));

      Swal.fire("Wylogowano!", "", "success").then(result => {
        if (result.value) {
           window.location.reload(false);

           //redirect
           window.location.href = "/#/shop";
        }
      });
    }
  });
}
