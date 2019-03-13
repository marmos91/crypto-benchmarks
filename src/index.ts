import Enigma from '@cubbit/enigma';

Enigma.init().then(async () => 
{
    const rsa_keypair = await Enigma.RSA.create_keypair();
    console.log(rsa_keypair);

    const hashed = await Enigma.Hash.digest('Hello World');
    console.log(hashed);
});
