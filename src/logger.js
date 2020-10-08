const {Signale} = require("signale");
const toUpper = (str, def) => {
  return str ? str.toUpperCase() : def.toUpperCase();
};
module.exports = function Log(scope) {
  const opts = {
    scope: toUpper(scope, "SERVER"),
    types:  {
      log:{
        badge: "♻",
        color: "cyan",
        label: "sync",
        logLevel: "info"
      }
    }
  };
  Signale.prototype.create = function(sc) {
    return new Signale(Object.assign(opts,{scope:sc}));
  };
  return new Signale(opts);
};
