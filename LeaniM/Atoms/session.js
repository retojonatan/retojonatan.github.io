document.onreadystatechange = function (e) {
  if (document.readyState === 'complete') {
    switch (sessionStorage.getItem('Rol')) {
      case 'Administrador':
        console.log('Admin');

        break;
      case 'User':
        console.log('User');
        break;
      case 'Contador':
        console.log('Contador');
        break;
      default:
        window.location.href = "./Login";
        break;
    }
  }
};
window.onload = function (e) {
  document.body.className = document.body.className.replace("d-none", "");
};