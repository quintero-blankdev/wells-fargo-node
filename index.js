import express from 'express';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from "uuid";
import UserAgent from 'user-agents';
import ip from 'ip';


const app = express();


// Oauth2 Code

const id = Buffer.from('j1QArbI6z1RbaGcHShXcXxk0TpyoVqsW:jtVylVejjMB6jYe1').toString('base64');

const params = new URLSearchParams()
params.append('grant_type', 'client_credentials')
params.append('scope', 'AUTH-SessionToken')
params.append('PLCCA-Prequalifications', 'true')
params.append('PLCCA-PLCCA-Applications', 'true')
params.append('PLCCA-Transactions-Term', 'true')
params.append('PLCCA-Account-Details', 'true')
params.append('PLCCA-Payment-Calculations', 'true')
params.append('PLCCA-SDK-logs PLCCA-Offers-Search', 'true')
params.append('PLCCA-Transactions-Authorization', 'true')
params.append('DOCVRFY', 'true')

const url = 'https://api-sandbox.wellsfargo.com/';
var token = null
const vm = this

async function createApiAuth() {
    const response = await fetch(url + 'oauth2/v1/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${id}`,
            'gateway-entity-id': '2427476133-9d03b-ae4b8',
            'client-request-id': `${uuidv4()}`
        },
        body: "grant_type=client_credentials&scope=AUTH-SessionToken PLCCA-Prequalifications PLCCA-Applications PLCCA-Transactions-Term PLCCA-Account-Details PLCCA-Payment-Calculations PLCCA-SDK-logs PLCCA-Offers-Search PLCCA-Transactions-Authorization DOCVRFY",
    });
    const data = await response.json()
    token = data.token_type + " " + data.access_token
    console.log(token)
    generateSesionToken(token)
}

async function generateSesionToken() {
    const userAgent = new UserAgent();
    console.log(ip.address());
    const response = await fetch("https://api-sandbox.wellsfargo.com/auth/v1/session-tokens", {
        body: `{"device_fingerprint":{"ip_address":"${ip.address()}","user_agent":"${userAgent.toString()}"}}`,
        headers: {
            'Authorization': token,
            'gateway-entity-id': '2427476133-9d03b-ae4b8',
            'client-request-id': `${uuidv4()}`,
            'Content-Type': 'application/json'
        },
        method: "POST"
      })
      const data1 = await response.json();
      console.log(data1);
}


//Prequalify an online customer

async function customerPrequalify() {
    const response = await fetch(url + 'credit-cards/private-label/new-accounts/v2/prequalifications', {
        method: 'POST',
        headers: {
            'Authorization': token,
            'gateway-entity-id': '2427476133-9d03b-ae4b8',
            'client-request-id': `${uuidv4()}`,
            'Content-Type': 'application/json'
        },
        body: '{\n        "merchant_number":"577442114000045",\n        "transaction_code": "IIS",\n        "main_applicant": {\n          "first_name": "GREGORY",\n          "last_name": "SEAMSTER",\n          "last_four_ssn": "9999",\n          "email":"demo@wellsfargo.com",\n\n          "address": {\n            "address_line_1": "2524 5TH AV",\n            "city": "FORT WORTH",\n            "state_code": "TX",\n            "postal_code": "76110"\n          }\n        },\n        "entry_point": "WEB",\n        "consent_datetime":"2019-01-09",\n        "return_URL":"http://www.wellsfargo.com"\n      }'
    });
    const data1 = await response.json();

    console.log(data1);
}

//Submit a credit application

async function creditApplication(token) {
    const response = await fetch(url + 'credit-cards/private-label/new-accounts/v2/applications', {
        method: 'POST',
        headers: {
            'Authorization': token ,
            'gateway-entity-id': '2427476133-9d03b-ae4b8',
            'client-request-id': `${uuidv4()}`,
            'Content-Type': 'application/json'
        },
        body: '{\n  "return_URL": "https://retailservices.wellsfargo.com",\n  "merchant_number": "577442107000010",\n  "transaction_code": "A6",\n  "requested_credit_limit": 99,\n  "main_applicant": {\n    "first_name": "Mary",\n    "last_name": "Smith",\n    "middle_initial": "A",\n    "date_of_birth": "1986-31-31",\n    "ssn": "999999994",\n    "annual_income": 100,\n    "home_phone": "9998887777",\n    "work_phone": "9998887777",\n    "address": {\n      "address_line_1": "Apt. 456",\n      "address_line_2": "123 First Street",\n      "city": "Des Moines",\n      "state_code": "IA",\n      "postal_code": "50322"\n    }\n  },\n  "joint_applicant": {\n    "first_name": "Marie",\n    "last_name": "Tester",\n    "middle_initial": "P",\n    "date_of_birth": "1986-01-01",\n    "ssn": "999999991",\n    "annual_income": 23,\n    "email_address": "test@gmail.com",\n    "mobile_phone": "7776667777",\n     "home_phone": "7776667777",\n      "work_phone": "7776667777",\n    "address": {\n      "address_line_1": "999 Second Street",\n      "address_line_2": "Apartment B",\n      "city": "West Des Moines",\n      "state_code": "IA",\n      "postal_code": "50322"\n    }\n  },\n "salesperson": "string1233",\n  "language_preference": "E"\n}'
    });
    const data1 = await response.json();

    console.log(data1);
}




//Run Servers
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(3000, function () {
    createApiAuth()
    console.log('Example app listening on port 3000!');
});