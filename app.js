async function encryptMessage() {
  const message = document.getElementById("encrypt-message").value;
  const publicKeyArmored = document.getElementById("public-key").value;

  if (!publicKeyArmored) {
    alert("Please provide a public key.");
    return;
  }

  try {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    // Encrypt the message using the public key
    const encryptedMessage = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: message }),
      encryptionKeys: publicKey
    });

    // Append the public key to the encrypted message
    const result = `${encryptedMessage}\n`;
    document.getElementById("encrypted-message").value = result;
    } catch (error) {
    alert("Error encrypting message: " + error);
  }
}
async function decryptMessage() {
  const encryptedMessageWithKey = document.getElementById("decrypt-message").value;
  const privateKeyArmored = document.getElementById("private-key").value; // Use the provided private key directly
  const privateKeyPassphrase = document.getElementById("private-key-passphrase").value;

  if (!privateKeyPassphrase) {
    alert("Please provide your private key passphrase.");
    return;
  }

  try {
    // Split the encrypted message to extract the encrypted content
    const messageParts = encryptedMessageWithKey.split("-----BEGIN PGP PUBLIC KEY BLOCK-----");
    const encryptedMessage = messageParts[0].trim();

    // Read and decrypt the private key
    const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
    const decryptedPrivateKey = await openpgp.decryptKey({
      privateKey,
      passphrase: privateKeyPassphrase
    });

    // Decrypt the message using the private key
    const message = await openpgp.decrypt({
      message: await openpgp.readMessage({ armoredMessage: encryptedMessage }),
      decryptionKeys: decryptedPrivateKey
    });

    document.getElementById("decrypted-message").value = message.data; // Use `message.data` for the decrypted text
  }
  catch (error) {
    alert("Error decrypting message: " + error);
  }
}