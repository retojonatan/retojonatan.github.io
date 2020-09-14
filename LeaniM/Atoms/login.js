var user;
var password;
var fails = 0;

function logear() {
  user = document.getElementById("inputName").value;
  password = document.getElementById('inputPassword').value;

  var req = $.ajax({
    url: "http://leanim.switchit.com.ar/OperacionUsuarios/Login",
    type: "GET",
    data: {
      user: user,
      password: password
    },
    contentType: "application/json"
  });
  req.done(function (res) {
    sessionStorage.setItem("User", res.Username);
    sessionStorage.setItem("UserId", res.UsuarioId);
    sessionStorage.setItem("Rol", res.Rol);
    window.location.href = "./";
  });
  req.fail(function (err) {
    $('#modalLogFailed').modal('show');
    fails++;
    document.getElementById('logs').innerHTML = `Logins fallidos: ${fails}`
    document.getElementById('inputPassword').value = "";
    if (fails > 10) {
      var btn = document.getElementById('loginForm').getElementsByTagName('button')[0];
      btn.parentNode.removeChild(btn);
    }
  });
}

$(window).on("load", function () {
  document.getElementById('loginForm').addEventListener('submit', function (e) {
    logear();
    e.preventDefault();
  });
});