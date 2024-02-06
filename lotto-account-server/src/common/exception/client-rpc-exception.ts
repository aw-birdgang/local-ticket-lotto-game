import { RpcException } from "@nestjs/microservices";
import { convertErrorMessage } from "./error.enum";
import { isNotEmpty } from "class-validator";

export class ClientRpcException extends RpcException {
  constructor(objectOrError: string | object) {
    if (typeof objectOrError === "string") {
      const errorMessage = convertErrorMessage(objectOrError);
      if (isNotEmpty(errorMessage)) {
        objectOrError = errorMessage;
      }
    }
    console.log("ClientRpcException -> ", objectOrError);
    super(objectOrError);
  }
}
