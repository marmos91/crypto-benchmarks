import Enigma from '@cubbit/enigma';
import {sha_benchmarks} from './tests/Hash';
import {aes_benchmarks} from './tests/AES';
import {aes_stream_benchmarks} from './tests/AESStream';
import {hash_stream_benchmarks} from './tests/HashStream';

async function run_benchmarks()
{
    await aes_benchmarks();
    await sha_benchmarks();
    await aes_stream_benchmarks();
    await hash_stream_benchmarks();
}

Enigma.init().then(async () => 
{
    console.log('Benchmarks started (each test is repeated 10000 times)');

    const controllers = document.getElementById('controllers');

    if(controllers)
    {
        const run_button = document.createElement('button');
        run_button.append(document.createTextNode('Run benchmarks'));
        run_button.onclick = run_benchmarks;
        controllers.append(run_button);
    }
});
