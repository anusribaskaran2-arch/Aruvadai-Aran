import bcrypt from "bcryptjs";

// Get password from command line arguments
const password = process.argv[2];

if (!password) {
  console.log("Usage: node generatePasswordHash.js <password>");
  console.log("Example: node generatePasswordHash.js mypassword123");
  process.exit(1);
}

// Generate hash
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error("❌ Error generating hash:", err);
    process.exit(1);
  }
  console.log("\n✅ Password Hash Generated:");
  console.log(hash);
  console.log("\n📋 Use this hash in MongoDB Compass for the 'password' field\n");
});



