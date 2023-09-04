import { app, sequelize } from "../express";
import request from "supertest";
import { Address } from "../../modules/invoice/domain/address.value-object";
import { Invoice } from "../../modules/invoice/domain/invoice";
import { InvoiceRepository } from "../../modules/invoice/repository/invoice.repository";
import Id from "../../modules/@shared/domain/value-object/id.value-object";
import { InvoiceItens } from "../../modules/invoice/domain/invoiceItens";

describe("E2E test for invoice", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should do the invoice", async () => {
    const address = new Address({
      street: "Street",
      number: "1",
      complement: "Complement",
      city: "Belo Horizonte",
      state: "MG",
      zipCode: "30000",
    });

    const item1 = new InvoiceItens({
      id: new Id("1"),
      name: "Item 1",
      price: 1.99,
    });

    const item2 = new InvoiceItens({
      id: new Id("2"),
      name: "Item 2",
      price: 2.99,
    });

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      items: [item1, item2],
      address: address,
    });

    const invoiceRepository = new InvoiceRepository();

    await invoiceRepository.add(invoice);
    const response = await request(app).get(`/invoice/${1}`);

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual("Invoice 1");
  });
});
