let listado_tramites=[{
id:1,
nombre:'basura',
monto:5000
},
{
id:1,
nombre:'Licencia',
valor:13000
}
];


const express = require('express');
const router = express.Router();

router.get('/TramitesPendientes', (req, res) => {
  res.send(listado_tramites);
});

module.exports = router;