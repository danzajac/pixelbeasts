const isFunctionCalled = (functionName: string): Boolean => {
  return (
    !process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === functionName
  );
};

const exportIfNeeded = (
  functionName: string,
  fileName: string,
  exports: any
): void => {
  if (isFunctionCalled(functionName)) {
    exports[functionName] = require(`../wrappers/${fileName}`).default;
  }
};
export default exportIfNeeded;
