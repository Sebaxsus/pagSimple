import './Styles/login.css'

document.getElementById('form-login-btnSecure').addEventListener('click', async function (event) {
  event.preventDefault();
  const usuario = document.getElementById('Usuario').value;
  const contraseña = document.getElementById('Contraseña').value;

  //console.log(username, password, JSON.stringify({username, password}))

  const respuesta = await fetch('http://localhost:3000/secure-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ usuario, contraseña })
  });
  
  //console.log(respuesta.body);

  const resultado = await respuesta.json();
  document.getElementById('resultado').innerText = resultado.message;

})

document.getElementById('form-login-btnInSecure').addEventListener('click', async function (event) {
  event.preventDefault();

  const usuario = document.getElementById('Usuario').value;
  const contraseña = document.getElementById('Contraseña').value;

  //console.log(username, password, JSON.stringify({username, password}))

  const respuesta = await fetch('http://localhost:3000/vulnerable-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ usuario, contraseña })
  });
  
  //console.log(respuesta.body);

  const resultado = await respuesta.json();
  document.getElementById('resultado').innerText = resultado.message;
})