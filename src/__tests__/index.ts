import {Context, Rpc} from "../index";
import {OrderServiceClientImpl} from "ts-jemma-genproto/dist/protobuf/services/order_service";
import {AuthenticationServiceClientImpl} from "ts-jemma-genproto/dist/protobuf/authentication";
import {UserServiceClientImpl} from "ts-jemma-genproto/dist/protobuf/user";
import {CredentialsServiceClientImpl} from "ts-jemma-genproto/dist/protobuf/credentials";

test('basic', async () => {
    const ctx = new Context()
    ctx.isDebug = false



        const rpc = new OrderServiceClientImpl<Context>(new Rpc("api.dev.pepeunlimited.com", "80"));
        const response = await Promise.all([rpc.GetOrder(ctx, { me: undefined , refNum: { referenceNumber: "helo"  } }), rpc.GetOrder(ctx, { me: undefined , refNum: { referenceNumber: "hello"  } })]);
        console.log(response)
        expect(ctx.isDebug).not.toBeNull()




    /*



    const rpc = new CredentialsServiceClientImpl<Context>(new Rpc("api.dev.pepeunlimited.com", "80"));
    const respose = await rpc.VerifyCredentials(ctx, { password: "newpw", username:"testaajaeppo@gmail.com" })
    console.log(respose)
    expect(ctx.isDebug).not.toBeNull()
*/

});