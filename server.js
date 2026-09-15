import express from "express";
import path from "path";

const app = express();
const port = 3000;
const dir = process.cwd();

app.use(express.static(dir));

app.get("*", (req, res) => {
  res.sendFile(path.join(dir, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
