/**
 * toc-nav.js
 * 从必背古诗文 markdown 源解析左侧目录数据。
 * 结构约定：
 *   ## 学期          -> 一个分组
 *   **1. 诗名**      -> 一首诗（诗名可含 {汉字|拼音} 注音组）
 * 同时支持浏览器 <script> 引入（挂到全局）与 Node require（供测试用）。
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.parseToc = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    var GROUP_RE = /^##\s+(.+?)\s*$/;
    var TITLE_RE = /^\*\*(.+?)\*\*\s*$/;
    var PINYIN_RE = /\{([^{}|]*)\|[^{}]*\}/g;
    var NUMBER_RE = /^\d+\.\s*/;

    function cleanTitle(text) {
        return text.replace(PINYIN_RE, '$1').replace(NUMBER_RE, '').trim();
    }

    function parseToc(md) {
        var lines = String(md).split(/\r?\n/);
        var groups = [];
        var current = null;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            var group = GROUP_RE.exec(line);
            if (group) {
                current = { title: group[1].trim(), poems: [] };
                groups.push(current);
                continue;
            }
            var title = TITLE_RE.exec(line);
            if (title && current) {
                current.poems.push({ title: cleanTitle(title[1]) });
            }
        }
        return groups;
    }

    return parseToc;
});
