module.exports = eth => (txHash, callback) => {
  let count = 0;

  const timeout = eth.options.timeout || 800000;
  const interval = eth.options.interval || 7000;
  const noop = () => {};
  const cb = callback || noop;

  return new Promise((resolve, reject) => {
    const txInterval = setInterval(() => {
      eth.getTransactionReceipt(txHash, (err, result) => {
        if (err) {
          clearInterval(txInterval);
          cb(err, null);
          reject(err);
        }

        if (!err && result) {
          clearInterval(txInterval);
          cb(null, result);
          resolve(result);
        }
      });

      if (count >= timeout) {
        clearInterval(txInterval);
        const errMessage = `Receipt timeout waiting for tx hash: ${txHash}`;
        cb(errMessage, null);
        reject(errMessage);
      }

      count += interval;
    }, interval);
  });
};
