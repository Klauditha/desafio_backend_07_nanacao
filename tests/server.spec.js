const request = require('supertest');
const server = require('../index');
const jwt = require('jsonwebtoken');

describe('Operaciones CRUD de cafes', () => {
  it('Obteniendo un 200 y respuesta es un array', async () => {
    const response = await request(server).get('/cafes');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('Obteniendo un 404 al eliminar un cafe que no existe', async () => {
    const jwt = 'token';
    const idCafe = 5;
    const response = await request(server)
      .delete(`/cafes/${idCafe}`)
      .set('Authorization', jwt);
    expect(response.status).toBe(404);
  });

  it('Agregar nuevo cafe y obtener un 201', async () => {
    const nuevoCafe = {
      id: 5,
      nombre: 'Cafe descafeinado',
    };
    const response = await request(server)
      .post('/cafes')
      .send(nuevoCafe);
    expect(response.status).toBe(201);
  });

  it('Actualizar un cafe, obtener un 400 por parametro diferente al id del payload', async () => {
    const payloadFine = { id: 1 };
    const jwtToken = jwt.sign(payloadFine, 'secret');
    const idCafe = 5;
    const payload = jwt.verify(jwtToken, 'secret');

    if (payload.id !== idCafe) {
      const response = await request(server)
        .put(`/cafes/${idCafe}`)
        .set('Authorization', jwtToken);
      expect(response.status).toBe(400);
    }
  });
});
