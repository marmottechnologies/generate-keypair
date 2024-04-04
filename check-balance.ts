import "dotenv/config";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  getKeypairFromEnvironment,
  airdropIfRequired,
} from "@solana-developers/helpers";

console.log(`Key✅:${getKeypairFromEnvironment("PRIVATE_KEY")}`);
const keyPair = getKeypairFromEnvironment("PRIVATE_KEY");
const publicKey = new PublicKey(keyPair.publicKey);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const balanceInLamports = await connection.getBalance(publicKey);

const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

if (balanceInSOL <= 0) {
  console.log("Initializing Airdrop 💵.");
  await airdropIfRequired(
    connection,
    keyPair.publicKey,
    1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL
  );
}
console.log(`Balance: ${balanceInSOL}.`);
