import Enigma from '@cubbit/enigma';
import * as AsmCrypto from 'asmcrypto.js';
import * as CryptoJs from 'crypto-js';
import * as _ from 'lodash';

import {Suite} from '../Suite';
import Test from '../Test';

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

    const enigma_aes = new Enigma.AES();
    await enigma_aes.init({key: key});
    const asm_aes = new AsmCrypto.AES_GCM(key, iv);
    const webcrypto_key = await self.crypto.subtle.importKey('raw', key.buffer, 'AES-GCM', false, ['encrypt']);

    await new Suite(`AES256 (${short_length} bytes)`)
    .add(new Test('CryptoJS', () =>
    {
        CryptoJs.AES.encrypt(short_string, key.toString(), {iv: iv.toString()});
    }))
    .add(new Test('Asmcrypto', () =>
    {
        asm_aes.encrypt(encoder.encode(short_string));
    }))
    .add(new Test('Webcrypto', async () =>
    {
        await self.crypto.subtle.encrypt({name: 'AES-GCM', iv, length: 128, tagLength: 128}, webcrypto_key, encoder.encode(short_string))
    }))
    .add(new Test('Enigma', async () =>
    {
        await enigma_aes.encrypt(short_string, iv);
    }))
    .run()
    .then((suite) => suite.dispose());

    await new Suite(`AES256 (${long_length} bytes)`)
    .add(new Test('CryptoJS', () =>
    {
        CryptoJs.AES.encrypt(long_string, key.toString());
    }))
    .add(new Test('Asmcrypto', () =>
    {
        asm_aes.encrypt(encoder.encode(long_string));
    }))
    .add(new Test('Webcrypto', async () =>
    {
        await self.crypto.subtle.encrypt({name: 'AES-GCM', iv, length: 128, tagLength: 128}, webcrypto_key, encoder.encode(long_string))
    }))
    .add(new Test('Enigma', async () =>
    {
        await enigma_aes.encrypt(long_string, iv);
    }))
    .run()
    .then((suite) => suite.dispose());
}
