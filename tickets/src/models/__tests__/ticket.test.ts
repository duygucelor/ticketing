import { Ticket } from "../ticket";

it("implements opotimistic concurency control by using mongoose-update-if-current", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 15,
    userId: "123456789",
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 20 });
  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error("Should not react this point");
});

it("increments the version number on multi ssaves", async()=>{
  const ticket = Ticket.build({
    title: "concert",
    price: 15,
    userId: "123456789",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
})