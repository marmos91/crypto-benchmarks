# crypto-benchmarks

Comparing Performance of JavaScript Cryptography Libraries

## How to run

To run the benchmarks just run

```bash
git clone https://github.com/marmos91/crypto-benchmarks.git
cd crypto-benchmarks

npm install
npm start
```

## Results

Benchmark results comparing Enigma with:

- [Sjcl](https://github.com/bitwiseshiftleft/sjcl)
- [WebCrypto](https://github.com/anvilresearch/webcrypto)
- [Asmcrypto](https://github.com/asmcrypto/asmcrypto.js)

Environment used for the tests: Chrome 72 on I7-7820HQ - lower is better

![Results file](https://github.com/marmos91/crypto-benchmarks/blob/master/assets/results_file.png)
![Results string](https://github.com/marmos91/crypto-benchmarks/blob/master/assets/results_string.png)

A web page will open on your browser. Just click the `Run benchmarks` button. Some tests are slow to perform. Please be patient :)

## License

[MIT](https://github.com/marmos91/crypto-benchmarks/blob/master/LICENSE)
