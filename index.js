require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 3000;

const sendEmail = async ({ name, email, message }) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let info = await transporter.sendMail({
        from: `"${name || email}" <${email}>`,
        to: process.env.EMAIL_RECEIVER,
        subject: `${process.env.WEBSITE_NAME} Website Message - ${name || email}`,
        text: `${message}`,
        html: `<h3>New message from ${email}</h3>
            <p>${message}</p>
        `,
        replyTo: `${email}`,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

app.use(cors())
app.use(bodyParser.json());

app.post('/', (req, res) => {
    console.log(req.body);

    sendEmail({ name: req.body?.name, email: req.body?.email, message: req.body?.message }).catch(console.error);

    res.send('Email sent');
})

app.listen(port, () => {
    console.log(`App listening at PORT: ${port}`)
})
