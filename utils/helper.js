import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';
dotenv.config();

export async function getAccessToken() {

    const tokenEndpoint = process.env.URL_TOKEN;
   
    
    const data = qs.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        scope: process.env.SCOPE,
        username: "maha.assi@arizglobal.com",
        password: process.env.PASSWORD,
        grant_type: process.env.GRANT_TYPE,
    });
  console.log("About to send request...");
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    
    try {
      const response = await axios.post(tokenEndpoint, data, config);
      return response.data.access_token;
    } catch (err) {
      console.error('Access Token Error:', err.response?.data || err.message);
      throw err;
    }
  }

export async function sendMail(accessToken, to, subject, body) {
  const url = process.env.URL_SENDMAIL;
  const payload =  {
    message: {
      subject,
      body: {
        contentType: "HTML",
        content: body,
      },
      toRecipients: [
        {
          emailAddress: {
            address: to,
          },
        },
      ],
    },
    // saveToSentItems: "true",
  };

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return await axios.post(url, payload, config);
}

