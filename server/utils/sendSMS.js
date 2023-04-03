const accountSid = "AC10f275c9e9fea59028afbf843ba23d1f";
const authToken = "7a946174e69d8356d0a535c128854939";
import twilio from "twilio";
let client = twilio(accountSid, authToken);

async function sendSMS(obj) {
  let mes = await client.messages
    .create({
      body: obj.message,
      from: "+18124164784",
      to: obj.phone,
    })
    console.log(mes.sid)
}



export default sendSMS