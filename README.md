# Pagos_Generales_Municipalidad
Este repositorio va a estar enfocado a la realización
de un sistema de pagos para las municipalidades de Chile
La cual consta de 4 temas centrales
1.- La gestión de los pagos
2.- La notificación de los plazos
3.- La exportación de Informes de los Pagos
4.- La subida de documentos para apelar ante un caso de atraso con los pagos
5.- prueba conexion branch







Documentación ProZero:

Para añadir nuevas deudas se debe esta logeado como administrador
y llegar a la ruta http://localhost/api/deudas
con la peticion POST y entregar en el body los parametros de la nueva deuda
EJ:
{
    "deudaID": 450,
    "descripcion": "deudazo",
    "monto": 5000,
    "fechaEmision": "2023-10-20",
    "fechaVencimiento": "2023-11-25",
    "fechaPago": null,
    "estado": "pendiente",
    "tramiteID": 6,
    "RUTAdmin": "11111111-1",
    "RUTUsuario": "20487563-4"
}

Ingresar a la ruta http://localhost/api/deudas con peticion GET devolverá
el listado de todas las deudas almacenadas en la base de datos

Ingresar a la ruta http://localhost/api/deudas/:id con peticion GET devolverá
el listado de todas las deudas almacenadas en la base de datos donde la deudaID
coincida con el paramtro entregado

Ingresar a la ruta http://localhost/api/deudas/usuario/:RUTUsuario
devolvera el listado de todas las deudas almacenada en la base de datos
donde el RUTUsuario de la dauda coincida con el parametro entregado
(la sería que el parametro de :RUTUsuario se autocomplete con el RUT
del usuario que inicio sesión)

Para utilizar la ruta de pagos se debe primero realizar una peticion
del tipo GET a la ID de la deuda que se deasea pagar
por EJ: http://localhost:4000/api/deudas/103
esto establecera temporalmente la deuda de ID 103 como el valor de
la variable temporal 'deudaTemporal'.
para realizar el pago de la deuda seleccionada, se debe acceder a la ruta
/pagarDeuda con la petición de tipo POST y entregar en el BODY el monto a pagar
como "PagarCantidad": valor.
Siguiendo el ejemplo anterior sería:
http://localhost:4000/api/deudas/103/pagarDeuda

{
    "PagarCantidad": 500
}

esto reducira el monto a pagar de la deuda de ID 103 y actualizara
su valor dentro de la base de datos, si el monto pendiente siguie siendo
mayor a 0, entonces el estado de la deuda seguira siendo "pendiente",
si el monto pendiente llega a 0, el estado de la deuda pasara a ser "pagado",
en caso de que el cliente pague una cantidad mayor a la requerida, este saldo quedara
guardado como un descuento para la proxima vez que intente saldar una deuda.

El Thread esta programado para ejecurtarse una vez al día extactamente a las
12:00 PM, momento en el cual se aplicara el % de impuesto establecido a todas
las deudas que tengan estado "Fuera de plazo"




validar rut dentro de la base de datos