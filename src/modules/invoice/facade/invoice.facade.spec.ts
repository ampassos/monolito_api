import { Sequelize } from "sequelize-typescript";
import { Address } from "../domain/address.value-object";
import { InvoiceFacadeFactory } from "../factory/facade.factory";
import { InvoiceModel } from "../repository/invoice.model";

describe("Invoice Facade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "1",
      complement: "Complement",
      city: "Belo Horizonte",
      state: "MG",
      zipCode: "30000",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 1.99,
        },
        {
          id: "2",
          name: "Item 2",
          price: 2.99,
        },
      ],
    };

    const invoiceGenerated = await invoiceFacade.generateInvoice(input);
    const invoiceOnDB = await InvoiceModel.findOne({
      where: { id: invoiceGenerated.id },
    });

    expect(invoiceGenerated.id).toBeDefined();
    expect(invoiceOnDB.id).toBeDefined();
    expect(invoiceGenerated.name).toBe(input.name);
    expect(invoiceGenerated.document).toEqual(input.document);
    expect(invoiceGenerated.items).toEqual(input.items);
    expect(invoiceGenerated.total).toEqual(4.98);

    expect(invoiceGenerated.street).toEqual(input.street);
    expect(invoiceGenerated.number).toEqual(input.number);
    expect(invoiceGenerated.complement).toEqual(input.complement);
    expect(invoiceGenerated.city).toEqual(input.city);
    expect(invoiceGenerated.state).toEqual(input.state);
    expect(invoiceGenerated.zipCode).toEqual(input.zipCode);
  });

  it("should find an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const invoiceCreated = await InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      document: "Document 1",
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 1.99,
        },
        {
          id: "2",
          name: "Item 2",
          price: 2.99,
        },
      ],
      addressStreet: "street",
      addressNumber: "number",
      addressComplement: "complement",
      addressCity: "city",
      addressState: "state",
      addressZipCode: "zipCode",
    });

    const result = await invoiceFacade.findInvoice({ id: "1" });

    expect(result.id).toEqual(invoiceCreated.id);
    expect(result.name).toEqual(invoiceCreated.name);
    expect(result.document).toEqual(invoiceCreated.document);

    expect(result.createdAt.toString()).toEqual(
      invoiceCreated.createdAt.toString()
    );

    expect(result.total).toEqual(4.98);
    expect(result.items.length).toEqual(2);

    expect(result.address).toEqual(
      new Address({
        street: "street",
        number: "number",
        complement: "complement",
        city: "city",
        state: "state",
        zipCode: "zipCode",
      })
    );
  });
});
