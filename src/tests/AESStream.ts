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
    const enigma_aes = new Enigma.AES({key: key});

    const small_file = new File([new Uint8Array(20 * 1024 * 1024)], 'small_file');
    const large_file = new File([new Uint8Array(1024 * 1024 * 1024)], 'large_file');

    await new Suite(`AES256 (small file stream)`)
        .add(new Test('CryptoJS', () => 
        {
            return new Promise((resolve) => 
            {
                const file_stream = WebFileStream.create_read_stream(small_file);
                const cryptojs_aes = CryptoJs.algo.AES.createEncryptor(key.toString(), {iv: iv.toString()});
                file_stream.on('data', (chunk) => cryptojs_aes.process(chunk));
                file_stream.on('end', () => 
                {
                    try 
                    {
                        cryptojs_aes.finalize();
                    }
                    catch(unused) {}
                    file_stream.destroy();
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
                    file_stream.destroy();
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
                file_stream.pipe(cubbit_aes_stream);
            });
        }, 10))
        .run()
        .then((suite) => suite.dispose());

    await new Suite(`AES256 (large file stream)`)
        .add(new Test('CryptoJS', () => 
        {
            return new Promise((resolve) => 
            {
                const file_stream = WebFileStream.create_read_stream(large_file);
                const cryptojs_aes = CryptoJs.algo.AES.createEncryptor(key.toString(), {iv: iv.toString()});
                file_stream.on('data', (chunk) => cryptojs_aes.process(chunk));
                file_stream.on('end', () => 
                {
                    try 
                    {
                        cryptojs_aes.finalize();
                    }
                    catch(unused) {}
                    file_stream.destroy();
                    resolve();
                });
            });
        }, 10))
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
                    file_stream.destroy();
                    resolve();
                });
            });
        }, 10))
        .add(new Test('Enigma', () => 
        {
            return new Promise((resolve) => 
            {
                const file_stream = WebFileStream.create_read_stream(large_file);
                const cubbit_aes_stream = enigma_aes.encrypt_stream(iv);
                cubbit_aes_stream.on('finish', resolve);
                file_stream.pipe(cubbit_aes_stream);
            });
        }, 10))
        .run()
        .then((suite) => suite.dispose());
}
