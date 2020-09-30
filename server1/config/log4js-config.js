'use strict';

const path = require("path");
// ログ出力先は、サーバー内の絶対パスを動的に取得して出力先を設定したい
const APP_ROOT = path.join(__dirname, "../");

// ログ出力設定
// log4jsはルートロガーで使用するので、エクスポートに変更

let config = {};

module.exports = {
  appenders: {
    consoleLog: {
      type: "console"
    },
    systemLog: {
      type: "file",
      filename: path.join(APP_ROOT, "./log/system/system.log"),
      maxLogSize: 5000000, // 5MB
      backups: 5, // 世代管理は5ファイルまで、古いやつgzで圧縮されていく
      compress: true
    },
    applicationLog: {
      type: "multiFile",
      base: path.join(APP_ROOT, "./log/application/"),
      property: "key",
      extension: ".log", // ファイルの拡張子はlogとする
      maxLogSize: 5000000, // 5MB
      backups: 5, // 世代管理は5ファイルまで、古いやつからgzで圧縮されていく
      compress: true,
    },
    accessLog: {
      type: "dateFile",
      filename: path.join(APP_ROOT, "./log/access/access.log"),
      pattern: "yyyy-MM-dd", // 日毎にファイル分割
      daysToKeep: 5, // 5日分の世代管理設定
      compress: true,
      keepFileExt: true,
    }
  },
  categories: {
    default: {
      appenders: ["consoleLog"],
      level: "ALL"
    },
    system: {
      appenders: ["systemLog"],
      level: "ERROR"
    },
    application: {
      appenders: ["applicationLog"],
      level: "ERROR"
    },
    access: {
      appenders: ["accessLog"],
      level: "INFO"
    }
  }
};

// module.exports = config;