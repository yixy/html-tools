/**
 * pinyin-ruby.js
 * 把 md 中的紧凑注音语法 {汉字|拼音} 转换为逐字 ruby HTML。
 * 语法规则：
 *   - 组内允许穿插标点（，。？！·（）等），标点不注音、按原位保留；
 *   - 拼音按空格分词，与组内汉字按顺序一一对应；
 *   - 拼音词数与汉字数不符时，整组保持原文不动（不崩溃）。
 * 同时支持浏览器 <script> 引入（挂到全局）与 Node require（供测试用）。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.pinyinToRuby = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var HAN_RE = /[一-龥]/;
  var GROUP_RE = /\{([^{}]*)\|([^{}]*)\}/g;

  function pinyinToRuby(text) {
    return text.replace(GROUP_RE, function (match, base, pinyin) {
      var hanzi = [];
      for (var i = 0; i < base.length; i++) {
        if (HAN_RE.test(base[i])) hanzi.push(base[i]);
      }
      var tokens = pinyin.trim().split(/\s+/).filter(Boolean);
      if (hanzi.length !== tokens.length) return match; // 数量不符，保持原文
      var out = '';
      var k = 0;
      for (var j = 0; j < base.length; j++) {
        var ch = base[j];
        if (HAN_RE.test(ch)) {
          out += '<ruby>' + ch + '<rt>' + tokens[k] + '</rt></ruby>';
          k++;
        } else {
          out += ch;
        }
      }
      return out;
    });
  }

  return pinyinToRuby;
});
