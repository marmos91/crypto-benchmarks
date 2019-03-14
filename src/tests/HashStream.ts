import Enigma from '@cubbit/enigma';
import {WebFileStream} from '@cubbit/web-file-stream';
import * as AsmCrypto from 'asmcrypto.js';
import * as CryptoJs from 'crypto-js';

import {Suite} from '../Suite';
import Test from '../Test';

export async function hash_stream_benchmarks()
{
    console.log('Running Hash stream benchmarks');

    const asmcrypto_sha256 = new AsmCrypto.Sha256();
    const crypto_sha256 = CryptoJs.algo.SHA256.create();

    const small_file = new File([new Uint8Array(1024 * 1024)], 'small_file');

    await new Suite(`SHA256 (small file stream)`)
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
        .run()
        .then((suite) => suite.dispose());

    const large_file = new File([new Uint8Array(50 * 1024 * 1024)], 'large_file');

    await new Suite(`SHA256 (large file stream)`)
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
        .run()
        .then((suite) => suite.dispose());
}
