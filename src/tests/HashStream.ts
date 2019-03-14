import Enigma from '@cubbit/enigma';
import {WebFileStream} from '@cubbit/web-file-stream';
import * as AsmCrypto from 'asmcrypto.js';
import * as CryptoJs from 'crypto-js';
import * as Sjcl from 'sjcl';

import {draw_canvas, draw_chart, loaded, loading} from '../ChartUtils';
import {Suite} from '../Suite';
import Test from '../Test';

export async function hash_stream_benchmarks()
{
    console.log('Running Hash stream benchmarks');
    let loading_node = loading();

    const asmcrypto_sha256 = new AsmCrypto.Sha256();
    const crypto_sha256 = CryptoJs.algo.SHA256.create();
    const sjcl_sha256 = new Sjcl.hash.sha256();

    const small_file = new File([new Uint8Array(1024 * 1024)], 'small_file');

    let results = await new Suite(`SHA256 (small file stream)`)
        .add(new Test('Sjcl', () => 
        {
            return new Promise((resolve) => 
            {
                const file_stream = WebFileStream.create_read_stream(small_file);
                file_stream.on('data', (chunk) => 
                {
                    sjcl_sha256.update(chunk);
                });
                file_stream.on('end', () => 
                {
                    sjcl_sha256.finalize();
                    sjcl_sha256.reset();
                    resolve();
                });
            });
        }))
        .add(new Test('CryptoJS', () => 
        {
            return new Promise((resolve) => 
            {
                const file_stream = WebFileStream.create_read_stream(small_file);
                file_stream.on('data', (chunk) =>
                {
                    try
                    {
                        crypto_sha256.update(chunk.toString());
                    }
                    catch(error)
                    {
                        console.error(error);
                    }
                });

                file_stream.on('end', () =>
                {
                    crypto_sha256.finalize();
                    resolve();
                });
            });
        }, 10))
        .add(new Test('Asmcrypto', () => 
        {
            return new Promise((resolve) => 
            {
                const file_stream = WebFileStream.create_read_stream(small_file);
                file_stream.on('data', (chunk) => 
                {
                    asmcrypto_sha256.process(chunk);
                });
                file_stream.on('end', () => 
                {
                    asmcrypto_sha256.finish().reset();
                    resolve();
                });
            });
        }, 10))
        .add(new Test('Enigma', () => 
        {
            return new Promise((resolve) => 
            {
                const file_stream = WebFileStream.create_read_stream(small_file);
                const cubbit_hash_stream = Enigma.Hash.stream();
                cubbit_hash_stream.on('finish', resolve);
                file_stream.pipe(cubbit_hash_stream);
            });
        }, 10))
        .run();

    loaded(loading_node);

    const sha_small_context = draw_canvas();
    draw_chart(results.name, results.results, sha_small_context as CanvasRenderingContext2D);
    console.log(results);

    loading_node = loading();
    const large_file = new File([new Uint8Array(50 * 1024 * 1024)], 'large_file');

    results = await new Suite(`SHA256 (large file stream)`)
        .add(new Test('Sjcl', () => 
        {
            return new Promise((resolve) => 
            {
                const file_stream = WebFileStream.create_read_stream(large_file);
                file_stream.on('data', (chunk) => 
                {
                    sjcl_sha256.update(chunk);
                });
                file_stream.on('end', () => 
                {
                    sjcl_sha256.finalize();
                    sjcl_sha256.reset();
                    resolve();
                });
            });
        }))
        .add(new Test('CryptoJS', () => 
        {
            return new Promise((resolve) => 
            {
                const file_stream = WebFileStream.create_read_stream(large_file);
                file_stream.on('data', (chunk) =>
                {
                    crypto_sha256.update(chunk.toString());
                });

                file_stream.on('end', () =>
                {
                    crypto_sha256.finalize();
                    resolve();
                });
            });
        }, 10).on('testing', (n, total) => console.log('Testing', n, 'of', total)))
        .add(new Test('Asmcrypto', () => 
        {
            return new Promise((resolve) => 
            {
                const file_stream = WebFileStream.create_read_stream(large_file);

                file_stream.on('data', (chunk) => 
                {
                    asmcrypto_sha256.process(chunk);
                });

                file_stream.on('end', () => 
                {
                    asmcrypto_sha256.finish().reset();
                    resolve();
                });
            });
        }, 10).on('testing', (n, total) => console.log('Testing', n, 'of', total)))
        .add(new Test('Enigma', () => 
        {
            return new Promise((resolve) => 
            {
                const file_stream = WebFileStream.create_read_stream(large_file);
                const cubbit_hash_stream = Enigma.Hash.stream();
                cubbit_hash_stream.on('finish', resolve);
                file_stream.pipe(cubbit_hash_stream);
            });
        }, 10).on('testing', (n, total) => console.log('Testing', n, 'of', total)))
        .run();

    const sha_big_context = draw_canvas();
    draw_chart(results.name, results.results, sha_big_context as CanvasRenderingContext2D);
}
