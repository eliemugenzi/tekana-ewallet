// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.0
// source: transactions.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "transactions";

export interface NewTransactionRequest {
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  userId: number;
}

export interface NewTransactionResponse {
  status: number;
  message: string;
  id: number;
}

export interface GetTransactionsRequest {
  accountNumber: string;
}

export interface TransactionData {
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  status: string;
}

export interface GetTransactionsResponse {
  status: number;
  message: string;
  data: TransactionData[];
}

export interface ValidateTransactionRequest {
  transactionId: number;
}

export interface ValidateTransactionResponse {
  status: number;
  message: string;
  data: TransactionData | undefined;
}

export const TRANSACTIONS_PACKAGE_NAME = "transactions";

export interface TransactionServiceClient {
  createTransaction(request: NewTransactionRequest): Observable<NewTransactionResponse>;

  getTransactions(request: GetTransactionsRequest): Observable<GetTransactionsResponse>;

  validateTransaction(request: ValidateTransactionRequest): Observable<ValidateTransactionResponse>;
}

export interface TransactionServiceController {
  createTransaction(
    request: NewTransactionRequest,
  ): Promise<NewTransactionResponse> | Observable<NewTransactionResponse> | NewTransactionResponse;

  getTransactions(
    request: GetTransactionsRequest,
  ): Promise<GetTransactionsResponse> | Observable<GetTransactionsResponse> | GetTransactionsResponse;

  validateTransaction(
    request: ValidateTransactionRequest,
  ): Promise<ValidateTransactionResponse> | Observable<ValidateTransactionResponse> | ValidateTransactionResponse;
}

export function TransactionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createTransaction", "getTransactions", "validateTransaction"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("TransactionService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("TransactionService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TRANSACTION_SERVICE_NAME = "TransactionService";
