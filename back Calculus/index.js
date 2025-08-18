const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const path = require("path");
require('dotenv').config();
const OpenApiValidator = require("express-openapi-validator");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Cargar archivo YAML de la documentación
const swaggerDocument = yaml.load("./api/openapi.yml");

// 🔐 Middleware de autenticación básica para proteger /api-docs
app.use('/api-docs', (req, res, next) => {
  const auth = { login: 'admin', password: process.env.DOCS_PASSWORD }; // Usa .env

  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  if (login === auth.login && password === auth.password) return next();

  res.set('WWW-Authenticate', 'Basic realm="API Docs"');
  res.status(401).send('Authentication required.');
});

// Servir Swagger UI (después del middleware de autenticación)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware para depurar solicitudes antes del validador OpenAPI
app.use((req, res, next) => {
  console.log("Método:", req.method);
  console.log("Ruta:", req.path);
  console.log("Cuerpo de la solicitud:", req.body);
  console.log("Parámetros de la ruta:", req.params);
  console.log("Query Params:", req.query);
  next();
});

// Validación de rutas según OpenAPI y controladores automáticos
const openApiValidatorMiddleware = OpenApiValidator.middleware({
  apiSpec: "./api/openapi.yml",
  validateRequests: true,
  validateResponses: true,
  operationHandlers: path.join(__dirname, "controllers"),
});
app.use(openApiValidatorMiddleware);

// Middleware extra para debug
app.use((req, res, next) => {
  console.log("Solicitud recibida:");
  console.log("Método:", req.method);
  console.log("Ruta:", req.path);
  console.log("Operation ID:", req.openapi?.schema?.operationId);
  next();
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


