'use strict';

// const cluster = require('cluster');
const log4js = require('log4js');
const levels = require("log4js/lib/levels").levels;
const config = require('../../config/log4js-config.js');

log4js.configure(config);

// if (cluster.isMaster) {

// } else {
//   // log4js.configure(config.log4js.worker);
// }

// それぞれのログ種別ごとに作成
const console = log4js.getLogger();
const system = log4js.getLogger('system');  // 上で作成したcategoriesのsystemで作成します。
const access = log4js.getLogger("access");

const ApplicationLogger = function() {
  this.logger = log4js.getLogger('application');
};

const proto = ApplicationLogger.prototype;
for (let level of levels) {
  // log4jsのソースコード見ると、大文字になっているので小文字にします。
  level = level.toString().toLowerCase();
  proto[level] = (function (level) {
    return function (key, message) {
      const logger = this.logger;
      logger.addContext("key", key); // logger.Context("key", "test") で実装していたところをこちらで任意の値が設定できるようにする
      logger[level](message);
    };
  })(level);
}

// 新たにロガーを生成
const application = new ApplicationLogger();

module.exports = {
  console,
  system,
  application,
  access
};
