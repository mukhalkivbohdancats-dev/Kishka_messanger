// server.js (Node.js backend)
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VIBER_AUTH_TOKEN = 'ТВІЙ_VIBER_BOT_TOKEN';
const verificationCodes = {}; // Збереження тимчасових кодів { phone: code }

// Відправка коду у Viber
app.post('/api/send-viber-code', async (req, res) => {
    const { phone, viberReceiverId } = req.body;
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    verificationCodes[phone] = code;

    try {
        await axios.post('https://chatapi.viber.com/pa/send_message', {
            receiver: viberReceiverId,
            min_api_version: 1,
            type: 'text',
            text: `Твій код підтвердження для Кішка Месенджер: ${code}`
        }, {
            headers: { 'X-Viber-Auth-Token': VIBER_AUTH_TOKEN }
        });

        res.json({ success: true, message: 'Код надіслано у Viber' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Перевірка введеного коду
app.post('/api/verify-code', (req, res) => {
    const { phone, code } = req.body;
    if (verificationCodes[phone] === code) {
        delete verificationCodes[phone];
        res.json({ success: true, token: "USER_AUTH_TOKEN" });
    } else {
        res.status(400).json({ success: false, message: 'Невірний код' });
    }
});

app.listen(3000, () => console.log('Kishka Messenger Auth Server running on port 3000'));
