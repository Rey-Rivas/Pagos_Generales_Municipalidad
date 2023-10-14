const express = require('express');
const app = express();
const port = 3000;
const rutaTramites = require('./routes/tramites.routes');
app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use('/api/tramites', rutaTramites);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


