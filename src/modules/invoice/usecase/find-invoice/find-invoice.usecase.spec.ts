import Id from "../../../@shared/domain/value-object/id.value-object";
import { Address } from "../../domain/address.value-object";
import { Invoice } from "../../domain/invoice";
import { InvoiceItens } from "../../domain/invoiceItens";
import { FindInvoiceUseCase } from "./find-invoice.usecase";

const address = new Address({
  street: "Street 1",
  number: "1",
  complement: "complement",
  city: "Belo Horizonte",
  state: "MG",
  zipCode: "30000",
});

const item1 = new InvoiceItens({
  id: new Id("1"),
  name: "Product 1",
  price: 1.99,
});

const item2 = new InvoiceItens({
  id: new Id("2"),
  name: "Product 2",
  price: 2.99,
});

const invoice = new Invoice({
  id: new Id("1"),
  name: "Invoice 1",
  document: "Document 1",
  items: [item1, item2],
  address: address,
});

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    add: jest.fn(),
  };
};

describe("Find Invoice UseCase unit test", () => {
  it("should find an invoice", async () => {
    const repository = MockRepository();
    const findInvoiceUseCase = new FindInvoiceUseCase(repository);

    const result = await findInvoiceUseCase.execute({ id: "1" });

    expect(result.id).toEqual(invoice.id.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address).toEqual(invoice.address);
    expect(result.items).toEqual([
      { id: "1", name: item1.name, price: item1.price },
      { id: "2", name: item2.name, price: item2.price },
    ]);

    expect(result.total).toEqual(4.98);
    expect(result.createdAt).toBeTruthy();
  });
});
