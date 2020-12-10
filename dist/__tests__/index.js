"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_service_1 = require("ts-jemma-genproto/dist/protobuf/services/order_service");
const err_1 = require("../err");
const ctx_1 = require("../ctx");
const rpc_1 = require("../rpc");
test('.isNotFound.toBe.true', async () => {
    const ctx = new ctx_1.Context();
    ctx.isDebug = false;
    try {
        const rpc = new order_service_1.OrderServiceClientImpl(new rpc_1.Rpc("api.dev.pepeunlimited.com", "80"));
        await rpc.GetOrder(ctx, { me: undefined, refNum: { referenceNumber: "helo" } });
    }
    catch (error) {
        const decoded = err_1.DecodeTwirpError(error);
        expect(decoded?.isNotFound).toBe(true);
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
