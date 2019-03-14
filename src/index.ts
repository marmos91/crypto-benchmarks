import Enigma from '@cubbit/enigma';
import * as AsmCrypto from 'asmcrypto.js';
import * as CryptoJs from 'crypto-js';
import * as Sjcl from 'sjcl';
import * as _ from 'lodash';

import Test from './Test';
import {Suite} from './Suite';

async function run_benchmarks()
{
    const encoder = new TextEncoder();
    const short_length = 10;
    const long_length = 1024;

    const short_string = _.range(short_length).map(i => _.sample("abcdefghijklmnopqrstuvwxyz0123456789")).join('')
    const long_string = _.range(long_length).map(i => _.sample("abcdefghijklmnopqrstuvwxyz0123456789")).join('')

    const sjcl_sha256 = new Sjcl.hash.sha256();
    const asmcrypto_sha256 = new AsmCrypto.Sha256();

    const short_sha_suite = new Suite(`SHA256 (${short_length} bytes)`);
    const long_sha_suite = new Suite(`SHA256 (${long_length} bytes)`);

    short_sha_suite.add(new Test('Sjcl', async () => 
    {
        sjcl_sha256.update(short_string).finalize();
        sjcl_sha256.reset();
    })).add(new Test('CryptoJS', async () => 
    {
        CryptoJs.SHA256(short_string);
    })).add(new Test('Asmcrypto', async () => 
    {
        asmcrypto_sha256.process(encoder.encode(short_string)).finish().reset();
    })).add(new Test('Enigma', async () => 
    {
        await Enigma.Hash.digest(short_string);
    }));

    await short_sha_suite.run();
    short_sha_suite.dispose();

    long_sha_suite.add(new Test('Sjcl', async () => 
    {
        sjcl_sha256.update(long_string).finalize();
        sjcl_sha256.reset();
    })).add(new Test('CryptoJS', async () => 
    {
        CryptoJs.SHA256(long_string);
    })).add(new Test('Asmcrypto', async () => 
    {
        asmcrypto_sha256.process(encoder.encode(long_string)).finish().reset();
    })).add(new Test('Enigma', async () => 
    {
        await Enigma.Hash.digest(long_string);
    }));

    await long_sha_suite.run();
    long_sha_suite.dispose();
}

Enigma.init().then(async () => 
{
    console.log('Benchmarks started (each test is repeated 10000 times)');

    const title = document.createElement('h2');
    title.append(document.createTextNode('Crypto benchmarks'));
    document.body.append(title);

    const paragraph = document.createElement('p');
    paragraph.append(document.createTextNode('Open the console and click the following button to start benchmarks'));
    document.body.append(paragraph);

    const run_button = document.createElement('button');
    run_button.append(document.createTextNode('Run benchmarks'));
    run_button.onclick = run_benchmarks;
    document.body.append(run_button);
});
