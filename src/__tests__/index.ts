import {OrderServiceClientImpl} from "ts-jemma-genproto/dist/protobuf/services/order_service";
import {DecodeServerError, DecodeTwirpError} from "../err";
import {Context} from "../ctx";
import {Rpc} from "../rpc";
import {AuthenticationServiceClientImpl} from "ts-jemma-genproto/dist/protobuf/authentication";
import {UserServiceClientImpl} from "ts-jemma-genproto/dist/protobuf/user";


test('twipErrorCode.NotFound.toBe.true', async () => {
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

test('twipErrorCode.Malformed.toBe.true', async () => {
    const ctx = new Context()
    ctx.isDebug = false
    try {
        const rpc = new AuthenticationServiceClientImpl<Context>(new Rpc("api.dev.pepeunlimited.com", "80"));
        await rpc.VerifyAccessToken(ctx, { accessToken: "asdasd" })
    }catch (error) {
        const decoded = DecodeTwirpError(error)
        expect(decoded?.errorCode.isMalformed).toBe(true)
    }
});

test('twipErrorCode.isNotFound.toBe.true', async () => {
    const ctx = new Context()
    ctx.isDebug = false
    try {
        const rpc = new AuthenticationServiceClientImpl<Context>(new Rpc("api.dev.pepeunlimited.com", "80"));
        await rpc.VerifyAccessToken(ctx, { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RhYWphLnNlcHBvQGdtYWlsLmNvbSIsImVtYWlsIjoidGVzdGFhamEuc2VwcG9AZ21haWwuY29tIiwicm9sZXMiOlsidXNlciJdLCJ1c2VyX2lkIjoxLCJleHAiOjE2MDc2MTQ2NDN9.WjFubqSqHqf_6TRFtuVjHtOgszeaCsz8SOCufJfQMWY" })
    }catch (error) {
        const decoded = DecodeTwirpError(error)
        expect(decoded?.errorCode.isUnauthenticated).toBe(true)
    }
});

test('twipErrorCode.isInvalidArgument.toBe.true', async () => {
    const ctx = new Context()
    ctx.isDebug = false
    try {
        const rpc = new UserServiceClientImpl<Context>(new Rpc("api.dev.pepeunlimited.com", "80"));
        await rpc.GetUser(ctx, { userId: 0 })
    }catch (error) {
        const decoded = DecodeTwirpError(error)
        expect(decoded?.errorCode.isInvalidArgument).toBe(true)
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