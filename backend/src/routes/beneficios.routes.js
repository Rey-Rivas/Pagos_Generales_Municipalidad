


// hay que adaptar el codigo para que solo el administrador pueda administrar los beneficios que se le asignan a los usuarios

router.get("/beneficios-usuario/:idUsuario", (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario, 10);
  const deudasUsuario = listaDeudas.filter((item) => item.idUsuario === idUsuario);

  if (deudasUsuario.length > 0) {
    res.json(deudasUsuario);
  } else {
    res.status(404).json({ mensaje: "Deudas no encontradas para el usuario especificado" });
  }
});