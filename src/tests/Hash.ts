import Enigma from '@cubbit/enigma';
import * as AsmCrypto from 'asmcrypto.js';
import * as CryptoJs from 'crypto-js';
import * as _ from 'lodash';
import * as Sjcl from 'sjcl';

import {draw_canvas, draw_chart, loaded, loading} from '../ChartUtils';
import {Suite} from '../Suite';
import Test from '../Test';

export async function sha_benchmarks()
{
    console.log('Running SHA benchmarks');
    let loading_node = loading();

    const encoder = new TextEncoder();
    const short_length = 10;
    const long_length = 1024;

    const short_string = _.range(short_length).map(i => _.sample("abcdefghijklmnopqrstuvwxyz0123456789")).join('')
    const long_string = _.range(long_length).map(i => _.sample("abcdefghijklmnopqrstuvwxyz0123456789")).join('')

    const sjcl_sha256 = new Sjcl.hash.sha256();
    const asmcrypto_sha256 = new AsmCrypto.Sha256();

    let results = await new Suite(`SHA256 (${short_length} bytes) - 10K samples`).add(new Test('Enigma', async () =>
    {
        await Enigma.Hash.digest(short_string);
    })).add(new Test('CryptoJS', async () =>
    {
        CryptoJs.SHA256(short_string);
    })).add(new Test('Asmcrypto', async () =>
    {
        asmcrypto_sha256.process(encoder.encode(short_string)).finish().reset();
    })).add(new Test('Webcrypto', async () =>
    {
        await self.crypto.subtle.digest({name: 'SHA-256'}, encoder.encode(short_string));
    })).add(new Test('Sjcl', async () => 
    {
        sjcl_sha256.update(short_string).finalize();
        sjcl_sha256.reset();
    })).run();

    loaded(loading_node);

    const sha_short_context = draw_canvas();
    draw_chart(results.name, results.results, sha_short_context as CanvasRenderingContext2D);

    console.log(results);

    loading_node = loading();

    results = await new Suite(`SHA256 (${long_length} bytes) - 10K samples`)
        .add(new Test('Enigma', async () =>
        {
            await Enigma.Hash.digest(long_string);
        })).add(new Test('CryptoJS', async () =>
        {
            CryptoJs.SHA256(long_string);
        })).add(new Test('Asmcrypto', async () =>
        {
            asmcrypto_sha256.process(encoder.encode(long_string)).finish().reset();
        })).add(new Test('Webcrypto', async () =>
        {
            await self.crypto.subtle.digest({name: 'SHA-256'}, encoder.encode(long_string));
        })).add(new Test('Sjcl', async () => 
        {
            sjcl_sha256.update(long_string).finalize();
            sjcl_sha256.reset();
        })).run();

    loaded(loading_node);

    const sha_long_context = draw_canvas();
    draw_chart(results.name, results.results, sha_long_context as CanvasRenderingContext2D);

    console.log(results);
}
