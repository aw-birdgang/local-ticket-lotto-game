export class FromHttpHeader {
  request: Request;

  constructor(req: Request) {
    this.request = req;
  }

  getSessionUserId() {
    const { sub: userId } = this.request["user"];
    return Number(userId);
  }

  static from(req: Request) {
    return new FromHttpHeader(req);
  }
}
