import Test, {TestResult} from "./Test";

interface SuiteResults
{
    name: string;
    results: TestResult[];
    fastest: TestResult;
    slowest: TestResult;
}

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

    public async run(): Promise<SuiteResults>
    {
        console.log(`[${this._name}] Launching (please wait)...`);

        const results: TestResult[] = [];

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
            
            results.push(result);

            if(result.avg < fastest.avg)
                fastest = result;

            if(result.avg > slowest.avg)
                slowest = result;
        }

        this.dispose();

        return {
            name: this._name,
            results,
            fastest,
            slowest
        };
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
