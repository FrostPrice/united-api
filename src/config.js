const prismaClient = require("@prisma/client");
const fs = require("fs");
const path = require("path");

exports.prisma = new prismaClient.PrismaClient();

const secretKeyPath = path.join(__dirname, "secret.key");
try {
  const secretKeyBinary = fs.readFileSync(secretKeyPath);
  exports.secretKeyBase64 = secretKeyBinary.toString("base64");
} catch (err) {
  console.error("Failed to read or process the secret key file:", err);
}
