import * as _ from 'lodash';

export interface TestResult
{
    name: string;
    min: number;
    max: number;
    avg: number;
}

export default class Test
{
    private _name: string;
    private _test: () => void;
    private _test_repetitions = 10000;

    constructor(name: string, test: () => void)
    {
        this._name =  name;
        this._test = test;
    }

    public async run(): Promise<TestResult>
    {
        let min = Number.MAX_VALUE;
        let max = 0;
        const times: number[] = [];

        for(let i = 0; i < this._test_repetitions; i++)
        {
            const start = window.performance.now();
            await this._test();
            const time = window.performance.now() - start;

            if(time < min)
                min = time;

            if(time > max)
                max = time;

            times.push(time);
        }

        return {
            name: this._name,
            min,
            max,
            avg: _.mean(times)
        }
    }

    public get name(): string
    {
        return this._name;
    }
}
