import { printers } from "../certificate";
describe("printers", () => {
  it("should print it_IT info", () => {
    const result = printers.it_IT.info({ id: "hi!" });
    expect(result).toMatchSnapshot();
  });
});
