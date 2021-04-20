import health from "../../../src/pages/api/health";

describe("Health check endpoint", () => {
  let req;
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn(() => {
        return { json: jest.fn() };
      }),
    };
  });

  it("should send a status of 200", () => {
    health(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
