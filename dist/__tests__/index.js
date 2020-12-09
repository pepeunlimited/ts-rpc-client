"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const order_service_1 = require("ts-jemma-genproto/dist/protobuf/services/order_service");
test('basic', async () => {
    const ctx = new index_1.Context();
    ctx.isDebug = false;
    const rpc = new order_service_1.OrderServiceClientImpl(new index_1.Rpc("api.dev.pepeunlimited.com", "80"));
    const response = await Promise.all([rpc.GetOrder(ctx, { me: undefined, refNum: { referenceNumber: "helo" } }), rpc.GetOrder(ctx, { me: undefined, refNum: { referenceNumber: "hello" } })]);
    console.log(response);
    expect(ctx.isDebug).not.toBeNull();
    /*



    const rpc = new CredentialsServiceClientImpl<Context>(new Rpc("api.dev.pepeunlimited.com", "80"));
    const respose = await rpc.VerifyCredentials(ctx, { password: "newpw", username:"testaajaeppo@gmail.com" })
    console.log(respose)
    expect(ctx.isDebug).not.toBeNull()
*/
});
