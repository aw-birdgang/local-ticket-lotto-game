import { HttpException, HttpExceptionOptions } from "@nestjs/common";

export class BusinessException extends HttpException {
  constructor(
    statusCode: number,
    objectOrError?: string | object | any,
    descriptionOrOptions: string | HttpExceptionOptions = "Internal Server Error",
  ) {
    const { description, httpExceptionOptions } = HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);

    super(HttpException.createBody(objectOrError, description, statusCode), statusCode, httpExceptionOptions);
  }
}
