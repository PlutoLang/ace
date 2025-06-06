"use strict";

var PythonMode = require("../python").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");

module.exports = {

    "test: bracket folding": function() {
        var session = new EditSession([
            '[ ',
            'stuff',
            ']',
            '[ ',
            '{ ',
            '[  #-'
        ]);

        var mode = new PythonMode();
        session.setFoldStyle("markbeginend");
        session.setMode(mode);

        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "");
        assert.equal(session.getFoldWidget(2), "");
        assert.equal(session.getFoldWidget(3), "start");
        assert.equal(session.getFoldWidget(4), "start");
        assert.equal(session.getFoldWidget(5), "");

        assert.range(session.getFoldWidgetRange(0), 0, 1, 2, 0);
        assert.equal(session.getFoldWidgetRange(3), null);
        assert.equal(session.getFoldWidgetRange(5), null);
    },

    "test: indentation folding": function() {
        var session = new EditSession([
            'def a: #',
            '',
            ' b:',
            '  c',
            ' ',
            '  c',
            '',
            ' ',
            ''
        ]);

        var mode = new PythonMode();
        session.setFoldStyle("markbeginend");
        session.setMode(mode);

        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "");
        assert.equal(session.getFoldWidget(2), "start");

        assert.range(session.getFoldWidgetRange(0), 0, 6, 5, 3);
        assert.range(session.getFoldWidgetRange(2), 2, 3, 5, 3);
    },
    
    "test: indentation folding with strings": function() {
        var session = new EditSession([
            'def a: #',
            '  print """',
            'xx',
            '"""',
            '',
            '  c',
            '',
            ''
        ]);

        var mode = new PythonMode();
        session.setFoldStyle("markbeginend");
        session.setMode(mode);

        assert.equal(session.getFoldWidget(0), "start");
        session.bgTokenizer.$worker();
        assert.range(session.getFoldWidgetRange(0), 0, 6, 5, 3);
    }
};


if (typeof module !== "undefined" && module === require.main)
    require("asyncjs").test.testcase(module.exports).exec();
