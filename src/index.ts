import Enigma from '@cubbit/enigma';
import {sha_benchmarks} from './tests/SHA';
import {aes_benchmarks} from './tests/AES';
import {aes_stream_benchmarks} from './tests/AESStream';

async function run_benchmarks()
{
    await sha_benchmarks();
    await aes_benchmarks();
    await aes_stream_benchmarks();
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
