import app from './server.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor local rodando em http://localhost:${port}`);
});
