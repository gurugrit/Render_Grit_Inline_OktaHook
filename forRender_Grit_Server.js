const express = require("express");
const app = express();

app.use(express.json());

// Browser sanity check
app.get("/GurusTokenHook", (req, res) => {
  res.send("GurusTokenHook is up");
});
const patients = [
  {
    username: 'dotttest.jon@yopmail.com',
    ExternalServicePatientID: '1235',
  },
  {
    username: 'gudorais@cisco.com',
     ExternalServicePatientID: '6789',
  },
 ]
//Token Inline Hook POST from Okta (endpoint: tokenHook)

app.post("/GurusTokenHook", (request, response) => {
  console.log(" ");
  console.log(request.body.data.identity.claims["preferred_username"]);
  var patientName = request.body.data.identity.claims["preferred_username"];
  if (patients.some(user => user.username == patientName)){
    const arrayPosition = patients.findIndex(user => user.username == patientName);
    const patientID = patients[arrayPosition].ExternalServicePatientID;
    var returnValue = { "commands":[
                          { "type":"com.okta.identity.patch",
                            "value": [
                                {
                                  "op": "add",
                                  "path": "/claims/extPatientId",
                                  "value": patientID
                                }
                                ]

                          }
                                  ],
                    }
  console.log("Added claim to ID Token, with a value of: " + returnValue.commands[0].value[0]["value"]);
  response.send(JSON.stringify(returnValue));
  }
  else {
  console.log("Not part of patient data store");
  response.status(204).send();
  }
}
);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

