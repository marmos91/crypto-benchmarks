import {Chart} from 'chart.js';

import {TestResult} from './Test';

export function loading()
{
    const loading_text = document.createElement('div');
    loading_text.append(document.createTextNode('Loading...'));

    const container = document.getElementById('container');

    if(container)
        container.append(loading_text);

    return loading_text;
}

export function loaded(loading_node: HTMLDivElement)
{
    if(loading_node)
    {
        loading_node.remove();
    }
}

export function draw_canvas()
{
    const results_canvas = document.createElement('canvas');
    results_canvas.width = 400;
    results_canvas.height = 400;
    const container = document.getElementById('container');

    if(container)
        container.append(results_canvas);

    return results_canvas.getContext('2d');
}

export function draw_chart(label: string, results: TestResult[], canvas_context: CanvasRenderingContext2D)
{
    const labels = [];
    const data = [];

    for(const result of results)
    {
        labels.push(result.name);
        data.push(1 / result.avg);
    }

    new Chart(canvas_context, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label,
                data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
