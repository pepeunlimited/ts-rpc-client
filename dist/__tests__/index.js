"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_service_1 = require("ts-jemma-genproto/dist/protobuf/services/order_service");
const err_1 = require("../err");
const ctx_1 = require("../ctx");
const rpc_1 = require("../rpc");
const authentication_1 = require("ts-jemma-genproto/dist/protobuf/authentication");
const user_1 = require("ts-jemma-genproto/dist/protobuf/user");
test('twipErrorCode.NotFound.toBe.true', async () => {
    const ctx = new ctx_1.Context();
    ctx.isDebug = false;
    try {
        const rpc = new order_service_1.OrderServiceClientImpl(new rpc_1.Rpc("api.dev.pepeunlimited.com", "80"));
        await rpc.GetOrder(ctx, { me: undefined, refNum: { referenceNumber: "helo" } });
    }
    catch (error) {
        const decoded = err_1.DecodeTwirpError(error);
        expect(decoded?.errorCode.isNotFound).toBe(true);
    }
});
test('twipErrorCode.Malformed.toBe.true', async () => {
    const ctx = new ctx_1.Context();
    ctx.isDebug = false;
    try {
        const rpc = new authentication_1.AuthenticationServiceClientImpl(new rpc_1.Rpc("api.dev.pepeunlimited.com", "80"));
        await rpc.VerifyAccessToken(ctx, { accessToken: "asdasd" });
    }
    catch (error) {
        const decoded = err_1.DecodeTwirpError(error);
        expect(decoded?.errorCode.isMalformed).toBe(true);
    }
});
test('twipErrorCode.isNotFound.toBe.true', async () => {
    const ctx = new ctx_1.Context();
    ctx.isDebug = false;
    try {
        const rpc = new authentication_1.AuthenticationServiceClientImpl(new rpc_1.Rpc("api.dev.pepeunlimited.com", "80"));
        await rpc.VerifyAccessToken(ctx, { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RhYWphLnNlcHBvQGdtYWlsLmNvbSIsImVtYWlsIjoidGVzdGFhamEuc2VwcG9AZ21haWwuY29tIiwicm9sZXMiOlsidXNlciJdLCJ1c2VyX2lkIjoxLCJleHAiOjE2MDc2MTQ2NDN9.WjFubqSqHqf_6TRFtuVjHtOgszeaCsz8SOCufJfQMWY" });
    }
    catch (error) {
        const decoded = err_1.DecodeTwirpError(error);
        expect(decoded?.errorCode.isUnauthenticated).toBe(true);
    }
});
test('twipErrorCode.isInvalidArgument.toBe.true', async () => {
    const ctx = new ctx_1.Context();
    ctx.isDebug = false;
    try {
        const rpc = new user_1.UserServiceClientImpl(new rpc_1.Rpc("api.dev.pepeunlimited.com", "80"));
        await rpc.GetUser(ctx, { userId: 0 });
    }
    catch (error) {
        const decoded = err_1.DecodeTwirpError(error);
        expect(decoded?.errorCode.isInvalidArgument).toBe(true);
    }
});
test('.DecodeTwirpError.not.toBeNull', async () => {
    const ctx = new ctx_1.Context();
    ctx.isDebug = false;
    ctx.rpcDataLoaderOptions = {
        cache: false
    };
    const rpc = new order_service_1.OrderServiceClientImpl(new rpc_1.Rpc("api.dev.pepeunlimited.com", "80"));
    const response = await Promise.allSettled([
        rpc.GetOrder(ctx, { me: undefined, refNum: { referenceNumber: "helo" } }),
        rpc.GetOrder(ctx, { me: undefined, refNum: { referenceNumber: "hello" } }) // something
    ]);
    expect(response).not.toBeNull();
});
test('.DecodeTwirpError.null', async () => {
    const ctx = new ctx_1.Context();
    ctx.isDebug = false;
    try {
        const rpc = new order_service_1.OrderServiceClientImpl(new rpc_1.Rpc("api.dev.pepunlimited.com", "80"));
        await rpc.GetOrder(ctx, { me: undefined, refNum: { referenceNumber: "helo" } });
    }
    catch (error) {
        const decoded = err_1.DecodeTwirpError(error);
        expect(decoded).toBeNull();
    }
});
test('.ServerError.NodeError', async () => {
    const ctx = new ctx_1.Context();
    ctx.isDebug = false;
    try {
        const rpc = new order_service_1.OrderServiceClientImpl(new rpc_1.Rpc("api.dev.pepnlimited.com", "80"));
        await rpc.GetOrder(ctx, { me: undefined, refNum: { referenceNumber: "helo" } });
    }
    catch (error) {
        const twirpError = err_1.DecodeTwirpError(error);
        expect(twirpError).toBeNull();
        const serverError = err_1.DecodeServerError(error);
        expect(serverError).not.toBeNull();
    }
});
/*
test('.ServerError.NotFound', async () => {
    const ctx = new Context()
    ctx.isDebug = false
    try {
        const rpc = new OrderServiceClientImpl<Context>(new Rpc("api.dev.pepeunlimited.com", "80"));
        await rpc.GetOrder(ctx, { me: undefined , refNum: { referenceNumber: "helo"  } })
    }catch (error) {
        const twirpError = DecodeTwirpError(error)
        expect(twirpError).toBeNull()
        const serverError = DecodeServerError(error);
        console.log(serverError)
        expect(serverError).not.toBeNull()
    }
});*/ 
