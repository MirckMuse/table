type TaskCallback = () => void;

function createRequestIdleCallback() {
  return globalThis.requestIdleCallback || function (callback: IdleRequestCallback, options?: IdleRequestOptions) {
    const _startTime = performance.now();

    return globalThis.requestAnimationFrame((time) => {
      callback({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (_startTime - time))
      })
    })
  }
}

export const requestIdleCallback = createRequestIdleCallback();

const Buffer_Time = 0;

function createRunIdleTask() {
  const tasks: TaskCallback[] = [];
  let isRunning = false;

  function isIdea(deadline: IdleDeadline) {
    const ideaTime = deadline.timeRemaining();
    return Buffer_Time < ideaTime;
  }

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

  return function (task: TaskCallback) {
    tasks.push(task);

    if (isRunning) return;
    _run();
  }
}

// 闲置时执行任务。用于对正确性没那么强的一些任务。
// 当个任务尽可能耗时小。
export const runIdleTask = createRunIdleTask();
