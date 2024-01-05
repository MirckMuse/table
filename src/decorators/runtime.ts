export function RuntimeLog() {
  return function (target: Object, proppertyKey: string | symbol, proppertyDescriptor: PropertyDescriptor) {
    const originalFunction = proppertyDescriptor.value;

    proppertyDescriptor.value = function (...args: any[]) {
      const startTime = new Date().getTime();
      const results = originalFunction.apply(this, args);
      const endTime = new Date().getTime();

      console.log(`*** ${proppertyKey.toString()} run time: ${endTime - startTime} ms`);

      return results
    }

    return proppertyDescriptor;
  }
}