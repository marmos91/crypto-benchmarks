import Test, {TestResult} from "./Test";

export class Suite
{
    private _name: string;
    private _tests: Test[];

    public constructor(name: string)
    {
        this._name = name;
        this._tests = [];
    }

    public add(test: Test): Suite
    {
        this._tests.push(test);
        return this;
    }

    public async run(): Promise<Suite>
    {
        console.log(`[${this._name}] Launching (please wait)...`);

        let fastest: TestResult = {
            name: 'placeholder',
            max: Number.MAX_VALUE,
            avg: Number.MAX_VALUE,
            min: 0
        };

        let slowest: TestResult = {
            name: 'placeholder',
            max: 0,
            avg: 0,
            min: 0
        };

        for(const test of this._tests)
        {
            const result = await test.run();
            
            console.log(result);

            if(result.avg < fastest.avg)
                fastest = result;

            if(result.avg > slowest.avg)
                slowest = result;
        }

        console.log(`[${this._name}]: Fastest is`, fastest);
        console.log(`[${this._name}]: Slowest is`, slowest);

        return this;
    }

    public dispose()
    {
        this._tests = [];
        delete this._tests;
    }

    public get name(): string
    {
        return this._name;
    }
}
