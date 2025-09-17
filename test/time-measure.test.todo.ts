import { RBTree } from "./test-source";
import {getRandomInt} from './tree-test-utils'
import {format} from 'pretty-format';
import {Canvas} from 'skia-canvas';
import fsp from 'node:fs/promises';
import {Chart} from 'chart.js/auto';

const data: {
    // 数据量级
    n: number,
    // 时间，单位 ms
    time: number
}[] = [];

const stdMapData: {
    n: number,
    time: number
}[] = [];

const randomSeq = (n: number) => Array.from({length: n}, () => getRandomInt(1, n));

const testCase = [100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000];

const test_t = (name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    return end - start;
}

const testNum = 10;
testCase.forEach(n => {
    test(`${n}量级`, () => {
        let total = 0;
        for (let i = 0; i < testNum; i++) {
            const seq = randomSeq(n);
            const time = test_t(`${n}量级`, () => {
                const map = new RBTree<number, number>();
                seq.forEach(n => map.insert(n, n));
            });
            total += time;
        }
        const avg = total / testNum;
        data.push({n, time: +avg.toFixed(2)});
    });
});

testCase.forEach(n => {
    test(`${n}量级`, () => {
        let total = 0;
        for (let i = 0; i < testNum; i++) {
            const seq = randomSeq(n);
            const time = test_t(`${n}量级`, () => {
                const map = new Map<number, number>();
                seq.forEach(n => map.set(n, n));
            });
            total += time;
        }
        const avg = total / testNum;
        stdMapData.push({n, time: +avg.toFixed(2)});
    });
});

afterAll(async () => {
    console.log(format(data));
    const canvas = new Canvas(800, 600);
    const chart = new Chart(canvas as any, {
        type: 'line',
        data: {
            labels: data.map(d => d.n),
            datasets: [
                {
                    label: 'EasyMap',
                    data: data.map(d => d.time),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                    tension: 0.1,
                },
                {
                    label: 'StdMap',
                    data: stdMapData.map(d => d.time),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                    tension: 0.1,
                }
            ]
        },
        options: {
            responsive: false,
            plugins: {
                legend: { display: true },
                title: {
                    display: true,
                    text: 'EasyMap vs StdMap 性能对比',
                },
            },
            scales: {
                x: {
                    title: { display: true, text: '数据量 n' },
                },
                y: {
                    title: { display: true, text: '耗时 (ms)' },
                }
            }
        }
    });

    const pngBuffer = await canvas.toBuffer('png', {matte: 'white'});
    await fsp.writeFile('output.png', pngBuffer as any);
    chart.destroy();
})

