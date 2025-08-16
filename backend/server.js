import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const usersFile = path.join(__dirname, "data", "new-users.json");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../")));

app.post("/register", (req, res) => {
  const { username, wallet } = req.body;
  let users = JSON.parse(fs.readFileSync(usersFile, "utf8"));

  if (!username || !wallet) {
    return res
      .status(400)
      .json({ error: "Username and wallet address are required." });
  }

  users.push({ username, wallet });

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.status(201).json({ message: "User registered successfully." });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
