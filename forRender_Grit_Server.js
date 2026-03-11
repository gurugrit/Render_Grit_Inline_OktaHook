const express = require("express");
const app = express();

app.use(express.json());

// Browser sanity check
app.get("/GurusTokenHook", (req, res) => {
  res.status(200).send("GurusTokenHook is up");
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

  try {

    const auth = request.headers["authorization"];

    if (auth !== "my-inline-hook-secret") {
      return response.status(401).json({ error: "Unauthorized" });
    }

    console.log(" ");

    const patientName = request.body?.data?.identity?.claims?.preferred_username;

    console.log(patientName);

    if (!patientName) {
      console.log("preferred_username missing in payload");
      return response.status(200).json({ commands: [] });
    }

    if (patients.some(user => user.username === patientName)) {

      const arrayPosition =
        patients.findIndex(user => user.username === patientName);

      const patientID =
        patients[arrayPosition].ExternalServicePatientID;

      const returnValue = {
        commands: [
          {
            type: "com.okta.identity.patch",
            value: [
              {
                op: "add",
                path: "/claims/extPatientId",
                value: patientID
              }
            ]
          }
        ]
      };

      console.log(
        "Added claim to ID Token with value: " + patientID
      );

      return response.status(200).json(returnValue);

    } else {

      console.log("Not part of patient data store");

      return response.status(200).json({
        commands: []
      });
    }

  } catch (err) {

    console.error("Hook error:", err);

    return response.status(200).json({
      commands: []
    });
  }

});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



