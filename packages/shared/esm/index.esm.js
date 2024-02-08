/**
 * 创建请求空闲回调函数
 * @returns {Function} 返回请求空闲回调函数
 */
function createRequestIdleCallback() {
    return window.requestIdleCallback || function (callback, options) {
        const _startTime = performance.now();
        return window.requestAnimationFrame((time) => {
            callback({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (_startTime - time))
            });
        });
    };
}
const requestIdleCallback = createRequestIdleCallback();
const BufferTime = 0;
/**
 * 创建一个执行空闲任务的函数
 */
function createRunIdleTask() {
    /**
     * 存储任务的数组
     */
    const tasks = [];
    /**
     * 标志是否正在运行
     */
    let isRunning = false;
    /**
     * 判断是否有空闲时间
     * @param deadline 空闲截止时间
     * @returns 是否有空闲时间
     */
    function isIdea(deadline) {
        const ideaTime = deadline.timeRemaining();
        return BufferTime < ideaTime;
    }
    /**
     * 执行空闲任务
     */
    function _run() {
        isRunning = true;
        requestIdleCallback((deadline) => {
            if (!tasks.length) {
                isRunning = false;
                return;
            }
            while (tasks.length && isIdea(deadline)) {
                let _task = tasks.shift();
                if (_task) {
                    _task();
                    // 设置函数为空，及时触发垃圾回收，避免内存泄漏
                    _task = null;
                }
            }
            _run();
        });
    }
    /**
     * 返回一个用于添加任务的函数
     * @param task 任务函数
     */
    return function (task) {
        tasks.push(task);
        if (isRunning)
            return;
        _run();
    };
}
// 闲置时执行任务。用于对正确性没那么强的一些任务。
// 单个任务尽可能耗时小。
const runIdleTask = createRunIdleTask();

/**
 * 二分搜索一个范围内数据的索引, 当精确值找不到时，则返回一个近似值的索引
 * @param sortedArray 排序后的数组
 * @param compareFn  0 - 当前值  大于0 - 右区间 小于0 - 左区间
 * @returns
 */
function binaryFindIndexRange(sortedArray, compareFn) {
    let left = 0;
    let right = sortedArray.length - 1;
    let rangeIndex = null;
    while (left <= right) {
        const middleIndex = Math.floor((left + right) / 2);
        const middleValue = sortedArray[middleIndex];
        const compare = compareFn(middleValue, middleIndex);
        if (compare === 0) {
            return middleIndex;
        }
        if (compare > 0) {
            left = middleIndex + 1;
        }
        else {
            if (rangeIndex === null || rangeIndex > middleIndex) {
                rangeIndex = middleIndex;
            }
            right = middleIndex - 1;
        }
    }
    return rangeIndex !== null && rangeIndex !== void 0 ? rangeIndex : -1;
}

export { binaryFindIndexRange, requestIdleCallback, runIdleTask };
//# sourceMappingURL=index.esm.js.map
