const express = require("express");
const app = express();

app.use(express.json());

// Browser sanity check
app.get("/GurusTokenHook", (req, res) => {
  res.send("GurusTokenHook is up");
});

// Okta token inline hook endpoint
app.post("/GurusTokenHook", (req, res) => {
  console.log("Received hook payload:");
  console.log(JSON.stringify(req.body, null, 2));

  // minimal valid response
  res.json({
    commands: []
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});