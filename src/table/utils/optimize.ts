type TaskCallback = () => void;

function createRunIdleTask() {
  const taskList: TaskCallback[] = [];
  let isRuning = false;

  function _run() {
    isRuning = true;

    globalThis.requestIdleCallback((deadline) => {
      if (!taskList.length) {
        isRuning = false;
        return;
      }

      while (taskList.length) {
        if (deadline.timeRemaining() > 0) {
          const _task = taskList.shift();
          _task?.();
        } else {
          break;
        }
      }
      _run();
    })
  }

  return function (task: TaskCallback) {
    taskList.push(task);

    if (isRuning) return;
    _run();
  }
}

// 闲置时执行任务。用于对正确性没那么强的一些任务。
// 当个任务尽可能耗时小。
export const runIdleTask = createRunIdleTask();
