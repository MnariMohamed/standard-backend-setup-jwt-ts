import { CourierClient } from "@trycourier/courier";
import Vonage from '@vonage/server-sdk';


const courier = CourierClient(
    { authorizationToken: process.env.COURIER_authorizationToken });


export async function sendEmail(mailOptions: any) {

    try {

        const { requestId } = await courier.send({
            message: {
                content: {
                    title: mailOptions.subject,
                    body: mailOptions.html,
                },
                to: {
                    email: mailOptions.to
                },
                routing: {
                    method: "single",
                    channels: ["email"]
                },
                channels: {
                    email: {
                        providers: ["gmail"],
                        "override": {
                            "html": mailOptions.html
                        }
                    }
                },
            }
        });

        console.log('Email Sent');
    } catch (err: any) { console.log(err); }

}


/*** SMS */
const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
});


//send sms func
export function sendSMS(phoneNumber: string, text: string) {
    const from = "R3";
    const to = phoneNumber;

    vonage.message.sendSms(from, to, text, {}, (err, responseData) => {
        if (err) { console.log(err); }
        else {
            if (responseData.messages[0]['status'] === '0') {
                console.log('Message sent successfully.');
            } else { console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`); }
        }
    });
}
