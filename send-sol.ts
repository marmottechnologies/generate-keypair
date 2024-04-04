import * as web3 from "@solana/web3.js";
import "dotenv/config";
import {
  getKeypairFromEnvironment,
  airdropIfRequired,
} from "@solana-developers/helpers";
import readline from "readline";

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

r1.question(
  "Please provide a Solana address to send funds to: ",
  async (suppliedToPubkey) => {
    if (!suppliedToPubkey) {
      console.log("No address provided.Exiting!");
      r1.close();
      process.exit(1);
    }
    r1.question("Please provide amount of SOL to send: ", async (solAmount) => {
      const solAmountNumeric = parseFloat(solAmount);

      if (isNaN(solAmountNumeric) || solAmountNumeric <= 0) {
        console.log(`Invalid amount. Exiting.`);
        process.exit(1);
      }

      const connection = new web3.Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );

      const senderKeypair = getKeypairFromEnvironment("PRIVATE_KEY");
      const publicKeyBeneficiary = new web3.PublicKey(suppliedToPubkey);

      const transaction = new web3.Transaction();
      const lamportsToSend = solAmountNumeric * web3.LAMPORTS_PER_SOL;

      const sendSolInstruction = web3.SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: publicKeyBeneficiary,
        lamports: lamportsToSend,
      });

      transaction.add(sendSolInstruction);

      const signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [senderKeypair]
      );

      console.log(
        `💸 Finished! Sent ${solAmount} SOL to the address ${publicKeyBeneficiary}. `
      );
      console.log(
        `Transaction reciept: \nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
      );

      r1.close();
    });
  }
);
