export function RuntimeLog() {
  return function (target: Object, proppertyKey: string | symbol, proppertyDescriptor: PropertyDescriptor) {
    const originalFunction = proppertyDescriptor.value;

    proppertyDescriptor.value = function (...args: any[]) {
      const startTime = new Date().getTime();
      const results = originalFunction.apply(this, args);
      const endTime = new Date().getTime();

      const spendTime = endTime - startTime;

      if (spendTime > 5) {
        console.warn(`*** ${proppertyKey.toString()} run time: ${spendTime} ms`);
      }

      return results
    }

    return proppertyDescriptor;
  }
}