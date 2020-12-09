"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const credentials_1 = require("ts-jemma-genproto/dist/protobuf/credentials");
test('basic', async () => {
    const ctx = new index_1.Context();
    ctx.isDebug = false;
    /*
        const rpc = new OrderServiceClientImpl<Context>(new Rpc("api.dev.pepeunlimited.com", "80"));
        const response = await Promise.all([rpc.GetOrder(ctx, { me: undefined , refNum: { referenceNumber: "hello"  } }), rpc.GetOrder(ctx, { me: undefined , refNum: { referenceNumber: "hello"  } })]);
        expect(ctx.isDebug).not.toBeNull()
        */
    const rpc = new credentials_1.CredentialsServiceClientImpl(new index_1.Rpc("api.dev.pepeunlimited.com", "80"));
    const respose = await rpc.VerifyCredentials(ctx, { password: "newpw", username: "testaaja.seppo@gmail.com" });
    console.log(respose);
    expect(ctx.isDebug).not.toBeNull();
});
