import Enigma from "@cubbit/enigma";
import * as AsmCrypto from 'asmcrypto.js';
import * as CryptoJs from 'crypto-js';
import * as _ from 'lodash';
import * as Sjcl from 'sjcl';
import {Suite} from "../Suite";
import Test from "../Test";

export async function aes_benchmarks()
{
    console.log('Running AES benchmarks');

    const encoder = new TextEncoder();
    const short_length = 10;
    const long_length = 1024;

    const short_string = _.range(short_length).map(i => _.sample("abcdefghijklmnopqrstuvwxyz0123456789")).join('')
    const long_string = _.range(long_length).map(i => _.sample("abcdefghijklmnopqrstuvwxyz0123456789")).join('')

    const key = Enigma.AES.create_key();
    const iv = Enigma.Random.bytes(16);
    const enigma_aes = new Enigma.AES({key: key});
    const sjcl_cipher = new Sjcl.cipher.aes([0, 0, 0, 0, 0, 0, 0, 0]);
    const sjcl_iv = Sjcl.codec.utf8String.toBits(short_string);
    const asm_aes = new AsmCrypto.AES_GCM(key, iv);

    await new Suite(`AES256 (${short_length} bytes)`)
    // .add(new Test('Sjcl', async () => 
    // {
    //     Sjcl.mode.gcm.encrypt(sjcl_cipher, sjcl_iv, [0, 0, 0, 0, 0, 0, 0, 0]);
    // }))
    .add(new Test('CryptoJS', () => 
    {
        CryptoJs.AES.encrypt(short_string, key.toString());
    }))
    .add(new Test('Asmcrypto', () => 
    {
        asm_aes.encrypt(encoder.encode(short_string));
    }))
    .add(new Test('Enigma', async () => 
    {
        await enigma_aes.encrypt(short_string);
    }))
    .run()
    .then((suite) => suite.dispose());

    await new Suite(`AES256 (${long_length} bytes)`)
    // .add(new Test('Sjcl', async () => 
    // {
    //     Sjcl.mode.gcm.encrypt(sjcl_cipher, sjcl_iv, [0, 0, 0, 0, 0, 0, 0, 0]);
    // }))
    .add(new Test('CryptoJS', () => 
    {
        CryptoJs.AES.encrypt(long_string, key.toString());
    }))
    .add(new Test('Asmcrypto', () => 
    {
        asm_aes.encrypt(encoder.encode(long_string));
    }))
    .add(new Test('Enigma', async () => 
    {
        await enigma_aes.encrypt(long_string);
    }))
    .run()
    .then((suite) => suite.dispose());
}
