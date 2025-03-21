const express = require("express");
const app = express();
const router = express.Router();
const PORT = 8080;

router.get("/ping", (req, res) => {
    console.log("Ping health check made on server");
    res.send({ status: 200, message: "Healthy" });
});

app.use("/api", router);

app.listen(PORT, () => {
    console.log("===========================================================");
    console.log(`============ Server is listening on port: ${PORT} ============`);
    console.log("===========================================================");
});
