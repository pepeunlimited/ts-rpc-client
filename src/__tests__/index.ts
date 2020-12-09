import {Context, Rpc} from "../index";
import {OrderServiceClientImpl} from "ts-jemma-genproto/dist/protobuf/services/order_service";

test('basic', async () => {
    const ctx = new Context()
    ctx.isDebug = true
    const rpc = new OrderServiceClientImpl<Context>(new Rpc("api.dev.pepeunlimited.com", "80"));
    const order1 = await rpc.GetOrder(ctx, { me: undefined , refNum: { referenceNumber: "hello"  } });
    console.log(order1)
    expect(order1).not.toBeNull()
});