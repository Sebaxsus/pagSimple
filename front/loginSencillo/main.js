import './Styles/login.css'

document.getElementById('form-login').addEventListener('submit', async function (event) {
  event.preventDefault();
  const username = document.getElementById('Username').value;
  const password = document.getElementById('Password').value;

  //console.log(username, password, JSON.stringify({username, password}))

  const respuesta = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  //console.log(respuesta.body);

  const resultado = await respuesta.json();
  document.getElementById('resultado').innerText = resultado.message; 
  
})