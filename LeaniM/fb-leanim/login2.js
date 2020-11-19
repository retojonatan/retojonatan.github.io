let login = document.getElementById('loginForm');
var fails = 0;

function logear() {
  let user = document.getElementById("inputName").value;
  let password = document.getElementById('inputPassword').value;
  console.log(user, password)
  auth
    .signInWithEmailAndPassword(user, password)
    .then(userCredential => {
      login.reset()
      console.log(userCredential)
      sessionStorage.setItem("User", userCredential.user.email);
      sessionStorage.setItem("UserId", userCredential.user.uid);
      sessionStorage.setItem("Rol", "Administrador");
      window.location.href = "./";
    })
    .catch(error => {
      console.log(error.message)
      $('#modalLogFailed').modal('show');
      fails++;
      document.getElementById('logs').innerHTML = `Logins fallidos: ${fails}`
      document.getElementById('inputPassword').value = "";
      if (fails > 10) {
        var btn = document.getElementById('loginForm').getElementsByTagName('button')[0];
        btn.parentNode.removeChild(btn);
      }
    })
}

$(window).on("load", function () {
  auth.onAuthStateChanged(userLogged => {
    if (!userLogged) {
      // window.location.href = "./Login"
      console.log('clear y redirect por login')
      sessionStorage.clear()
    }
  })
  login.addEventListener('submit', function (e) {
    logear();
    e.preventDefault();
  });
});