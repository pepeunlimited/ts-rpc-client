import {OrderServiceClientImpl} from "ts-jemma-genproto/dist/protobuf/services/order_service";
import {DecodeServerError, DecodeTwirpError} from "../err";
import {Context} from "../ctx";
import {Rpc} from "../rpc";


test('.isNotFound.toBe.true', async () => {
    const ctx = new Context()
    ctx.isDebug = false
    try {
        const rpc = new OrderServiceClientImpl<Context>(new Rpc("api.dev.pepeunlimited.com", "80"));
        await rpc.GetOrder(ctx, { me: undefined , refNum: { referenceNumber: "helo"  } })
    }catch (error) {
        const decoded = DecodeTwirpError(error)
        expect(decoded?.errorCode.isNotFound).toBe(true)
    }
});

test('.DecodeTwirpError.not.toBeNull', async () => {
    const ctx = new Context()
    ctx.isDebug = false
    ctx.rpcDataLoaderOptions = {
        cache: false
    }
    const rpc = new OrderServiceClientImpl<Context>(new Rpc("api.dev.pepeunlimited.com", "80"));
    const response = await Promise.allSettled([
        rpc.GetOrder(ctx, { me: undefined , refNum: { referenceNumber: "helo" } }), // not found
        rpc.GetOrder(ctx, { me: undefined , refNum: { referenceNumber: "hello" } }) // something
    ]);
    expect(response).not.toBeNull()
});

test('.DecodeTwirpError.null', async () => {
    const ctx = new Context()
    ctx.isDebug = false
    try {
        const rpc = new OrderServiceClientImpl<Context>(new Rpc("api.dev.pepunlimited.com", "80"));
        await rpc.GetOrder(ctx, { me: undefined , refNum: { referenceNumber: "helo"  } })
    }catch (error) {
        const decoded = DecodeTwirpError(error)
        expect(decoded).toBeNull()
    }
});

test('.ServerError.NodeError', async () => {
    const ctx = new Context()
    ctx.isDebug = false
    try {
        const rpc = new OrderServiceClientImpl<Context>(new Rpc("api.dev.pepnlimited.com", "80"));
        await rpc.GetOrder(ctx, { me: undefined , refNum: { referenceNumber: "helo"  } })
    }catch (error) {
        const twirpError = DecodeTwirpError(error)
        expect(twirpError).toBeNull()
        const serverError = DecodeServerError(error);
        expect(serverError).not.toBeNull()
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