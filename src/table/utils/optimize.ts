type TaskCallback = () => void;

function createRunIdleTask() {
  const tasks: TaskCallback[] = [];
  let isRunning = false;

  function _run() {
    isRunning = true;

    globalThis.requestIdleCallback((deadline) => {
      if (!tasks.length) {
        isRunning = false;
        return;
      }

      while (tasks.length && (performance.now() + deadline.timeRemaining()) > performance.now()) {
        const _task = tasks.shift();
        _task?.();
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
