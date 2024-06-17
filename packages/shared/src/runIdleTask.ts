type TaskCallback = () => void;


/**
 * 创建请求空闲回调函数
 * @returns { Function } 返回请求空闲回调函数
 */
function createRequestIdleCallback() {
  return window.requestIdleCallback || function (callback: IdleRequestCallback, options?: IdleRequestOptions) {
    const _startTime = performance.now();

    return window.requestAnimationFrame((time) => {
      callback({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (_startTime - time))
      })
    })
  }
}

export const requestIdleCallback = createRequestIdleCallback();

const BufferTime = 0;

/**
 * 创建一个执行空闲任务的函数
 */
function createRunIdleTask() {
  /**
   * 存储任务的数组
   */
  const tasks: TaskCallback[] = [];
  /**
   * 标志是否正在运行
   */
  let isRunning = false;

  /**
   * 判断是否有空闲时间
   * @param deadline 空闲截止时间
   * @returns 是否有空闲时间
   */
  function isIdea(deadline: IdleDeadline) {
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
        let _task: any = tasks.shift();

        if (_task) {
          _task();
          // 设置函数为空，及时触发垃圾回收，避免内存泄漏
          _task = null;
        }
      }
      _run();
    })
  }

  /**
   * 返回一个用于添加任务的函数
   * @param task 任务函数
   */
  return function (task: TaskCallback) {
    tasks.push(task);

    if (isRunning) return;
    
    _run();
  }
}

// 闲置时执行任务。用于对正确性没那么强的一些任务。
// 单个任务尽可能耗时小。
export const runIdleTask = createRunIdleTask();
