import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

function createAccount() {
  const nombre = faker.person.fullName();
  const email = faker.internet.email();
  const direccion = faker.location.streetAddress();
  const edad = Number(faker.number.bigInt({ min: 10n, max: 100n }));
  return { nombre, email, direccion, edad };
}

function createAccounts(n) {
  const accounts = [];
  for (let i = 0; i < n; i++) {
    accounts.push(createAccount());
  }
  return accounts;
}

const crearCuentas = createAccounts(40);

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/accounts", function (req, res) {
  // Aqui creamos las cuantas random y entramos en la la url donde nos genero la api estas cuentas: http://localhost:3001/accounts
  res.json(crearCuentas);
});

app.listen(3001, function () {
  console.log("Funciona consumir datos de la API fake server, Puerto 3001.");
});
