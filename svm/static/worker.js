onmessage = function (event) {
  const task = event.data;
  const result = performTask(task);
  postMessage(result);
};

function performTask(task) {
  // This is where you would define the code to perform the task
  // For example:
  // const result = task * 2;
  // return result;

  let sum = 0;
  for (let i = 0; i < 100000000; i++) {
    sum += i;
  }
  return sum;
}
