import Enigma from '@cubbit/enigma';
import {WebFileStream} from '@cubbit/web-file-stream';
import * as AsmCrypto from 'asmcrypto.js';
import * as CryptoJs from 'crypto-js';

import {Suite} from '../Suite';
import Test from '../Test';

export async function aes_stream_benchmarks()
{
    console.log('Running AES stream benchmarks');

    const iv = Enigma.Random.bytes(16);
    const key = Enigma.AES.create_key();
    const enigma_aes = new Enigma.AES()
    await enigma_aes.init({key: key});
    // const console_stream = new Stream.Writable({
    //     write: (chunk, _, callback) =>
    //     {
    //         console.log(chunk.toString('hex'));
    //         callback();
    //     }
    // });

    const small_file = new File([new Uint8Array(1024 * 1024)], 'small_file');

    await new Suite(`AES256 (small file stream)`)
        .add(new Test('CryptoJS', () =>
        {
            return new Promise((resolve) =>
            {
                const file_stream = WebFileStream.create_read_stream(small_file);
                const cryptojs_aes = CryptoJs.algo.AES.createEncryptor(CryptoJs.enc.Hex.parse('d756db7e45654633827ca719ac22ee70a05aa0af1d95a37334411542157b13f5'), {iv: CryptoJs.enc.Hex.parse('b19bac30cbb53ec52e93433a07bdd0ca')});

                file_stream.on('data', (chunk) =>
                {
                    cryptojs_aes.process(chunk.toString());
                });

                file_stream.on('end', () =>
                {
                    try
                    {
                        cryptojs_aes.finalize();
                    }
                    catch(unused)
                    {
                        console.error(unused);
                    }
                    resolve();
                });
            });
        }, 10))
        .add(new Test('Asmcrypto', () =>
        {
            return new Promise((resolve) =>
            {
                const file_stream = WebFileStream.create_read_stream(small_file);
                const asm_aes = new AsmCrypto.AES_GCM(key, iv);
                file_stream.on('data', (chunk) => asm_aes.AES_GCM_Encrypt_process(chunk));

                file_stream.on('end', () =>
                {
                    asm_aes.AES_GCM_Encrypt_finish();
                    resolve();
                });
            });
        }, 10))
        .add(new Test('Enigma', () =>
        {
            return new Promise((resolve) =>
            {
                const file_stream = WebFileStream.create_read_stream(small_file);
                const cubbit_aes_stream = enigma_aes.encrypt_stream(iv);

                cubbit_aes_stream.on('finish', resolve);

                file_stream.pipe(cubbit_aes_stream);// .pipe(console_stream);
            });
        }, 10))
        .run()
        .then((suite) => suite.dispose());

    const large_file = new File([new Uint8Array(50 * 1024 * 1024)], 'large_file');

    await new Suite(`AES256 (large file stream)`)
        .add(new Test('CryptoJS', () =>
        {
            return new Promise((resolve) =>
            {
                const file_stream = WebFileStream.create_read_stream(large_file);
                const cryptojs_aes = CryptoJs.algo.AES.createEncryptor(CryptoJs.enc.Hex.parse('d756db7e45654633827ca719ac22ee70a05aa0af1d95a37334411542157b13f5'), {iv: CryptoJs.enc.Hex.parse('b19bac30cbb53ec52e93433a07bdd0ca')});

                file_stream.on('data', (chunk) => cryptojs_aes.process(chunk.toString()));
                file_stream.on('end', () =>
                {
                    try
                    {
                        cryptojs_aes.finalize();
                    }
                    catch(unused)
                    {
                        console.error(unused);
                    }

                    resolve();
                });
            });
        }, 1).on('testing', (n, total) => console.log('Testing', n, 'of', total)))
        .add(new Test('Asmcrypto', () =>
        {
            return new Promise((resolve) =>
            {
                const file_stream = WebFileStream.create_read_stream(large_file);
                const asm_aes = new AsmCrypto.AES_GCM(key, iv);
                file_stream.on('data', (chunk) => asm_aes.AES_GCM_Encrypt_process(chunk));
                file_stream.on('end', () =>
                {
                    asm_aes.AES_GCM_Encrypt_finish();
                    resolve();
                });
            });
        }, 10).on('testing', (n, total) => console.log('Testing', n, 'of', total)))
        .add(new Test('Enigma', () =>
        {
            return new Promise((resolve) =>
            {
                const file_stream = WebFileStream.create_read_stream(large_file);
                const cubbit_aes_stream = enigma_aes.encrypt_stream(iv);
                cubbit_aes_stream.on('finish', resolve);
                file_stream.pipe(cubbit_aes_stream);
            });
        }, 10).on('testing', (n, total) => console.log('Testing', n, 'of', total)))
        .run()
        .then((suite) => suite.dispose());
}
