import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  cc = "jgkvvqnrsisnlxtezj@fxavaj.com",
  subject,
  message,
  attachments = [],
}) => {
  try {
    // Transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "c44be.route@gmail.com",
        pass: "rmhvnwiyswudcnze",
      },
      // tls:{
      //     rejectUnauthorized:false
      // }
    });

    // Send email
    const info = await transporter.sendMail({
      from: "c44be.route@gmail.com",
      to,
      cc,
      subject,
      html: message,
      attachments,
    });
    return info;
  } catch (error) {
    console.log("Email not sent Error details:");
    console.log(error);
  }
};

import { EventEmitter } from "node:events";
export const emitter = new EventEmitter();

emitter.on("sendEmails", async (args) => {
  console.log("Email sent");
  await sendEmail(args);
});
