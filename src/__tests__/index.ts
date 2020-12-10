import {OrderServiceClientImpl} from "ts-jemma-genproto/dist/protobuf/services/order_service";
import {AuthenticationServiceClientImpl} from "ts-jemma-genproto/dist/protobuf/authentication";
import {UserServiceClientImpl} from "ts-jemma-genproto/dist/protobuf/user";
import {CredentialsServiceClientImpl} from "ts-jemma-genproto/dist/protobuf/credentials";
import {DecodeTwirpError} from "../err";
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
        expect(decoded?.isNotFound).toBe(true)
    }
});

test('.DecodeTwirpError.not.toBeNull', async () => {
    const ctx = new Context()
    ctx.isDebug = false
    try {
        const rpc = new OrderServiceClientImpl<Context>(new Rpc("api.dev.pepeunlimited.com", "80"));
        await Promise.all([rpc.GetOrder(ctx, { me: undefined , refNum: { referenceNumber: "helo"  } }), rpc.GetOrder(ctx, { me: undefined , refNum: { referenceNumber: "hello"  } })]);
    }catch (error) {
        const decoded = DecodeTwirpError(error)
        expect(decoded).not.toBeNull()
    }
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

test('.InternalServerError', async () => {
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