import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for client", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const response = await request(app).post("/clients").send({
      id: "1",
      name: "Name 1",
      email: "teste@teste.com ",
      document: "00001",
      address: "Marques de Herval",
    });

    expect(response.status).toEqual(201);
  });

  it("should not create a client when name is not provided", async () => {
    const response = await request(app).post("/clients").send({
      id: "1",
      email: "teste@teste.com",
      document: "00001",
      address: "Marques de Herval",
    });

    expect(response.status).toEqual(400);
  });
});