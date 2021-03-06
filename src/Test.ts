import * as _ from 'lodash';
import {EventEmitter} from 'events';

export interface TestResult
{
    name: string;
    min: number;
    max: number;
    avg: number;
    results: number[];
}

export default class Test extends EventEmitter
{
    private _name: string;
    private _test: () => void;
    private _test_repetitions = 1000;

    constructor(name: string, test: () => void, test_repetitions?: number)
    {
        super();
        this._name =  name;
        this._test = test;

        if(test_repetitions)
            this._test_repetitions = test_repetitions;
    }

    public async run(): Promise<TestResult>
    {
        let min = Number.MAX_VALUE;
        let max = 0;
        const times: number[] = [];

        for(let i = 0; i < this._test_repetitions; i++)
        {
            this.emit('testing', i, this._test_repetitions);
            const start = performance.now();
            await this._test();
            const time = performance.now() - start;

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
            results: times,
            avg: _.mean(times)
        }
    }

    public get name(): string
    {
        return this._name;
    }
}
