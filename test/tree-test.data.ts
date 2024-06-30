import {generateRandomSequence, getRandomInt, TestOption} from "./tree-test-utils";

// 递增插入序列
export const increaseInsertData = (n: number) => {
    const options: TestOption<number, number>[] = [];
    for (let i = 1; i <= n; i ++) {
        options.push({type: 'insert', key: i, value: i});
    }
    for (let i = 1; i <= n; i ++) {
        options.push({type: 'get', key: i, value: i});
    }
    return options;
}

// 递减插入序列
export const decreaseInsertData = (n: number) => {
    const options: TestOption<number, number>[] = [];
    for (let i = n; i > 0; i --) {
        options.push({type: 'insert', key: i, value: i});
    }
    for (let i = n; i > 0; i --) {
        options.push({type: 'get', key: i, value: i});
    }
    return options;
}

// 随机插入序列
export const randomInsertData = (n: number) => {
    const seq = generateRandomSequence(n);
    const options: TestOption<number, number>[] = [
        ...seq.map(i => {
            return {type: 'insert', key: i, value: i};
        }),
        ...seq.map(i => ({type: 'get', key: i, value: i}))
    ] as any;
    return options;
}

export const increaseEraseData = (n: number) => {
    const options: TestOption<number, number>[] = [];
    for (let i = 1; i <= n; i ++) {
        options.push({type: 'insert', key: i, value: i});
    }
    for (let i = 1; i <= n; i ++) {
        options.push({type: 'erase', key: i});
        for (let j = 1; j <= n; j ++) {
            options.push({type: 'get', key: j, value: j <= i ? null : j});
        }
    }
    return options;
};

export const randomEraseData = (n: number, delNum: number, checkNum: number) => {
    const seq = generateRandomSequence(n);
    const options: TestOption<number, number>[] = [
        ...seq.map(i => {
            return {type: 'insert', key: i, value: i};
        })
    ] as any;
    while (delNum --) {
        const delIndex = getRandomInt(0, seq.length - 1);
        // 删除 delIndex
        options.push({type: 'erase', key: seq[delIndex]});
        options.push({type: 'get', key: seq[delIndex], value: null});
        seq.splice(delIndex, 1);

        // 进行 checkNum 次查询测试
        for (let i = 0; i < checkNum; i ++) {
            const checkIndex = getRandomInt(0, seq.length - 1);
            options.push({type: 'get', key: seq[checkIndex], value: seq[checkIndex]});
        }
    }
    return options;
}