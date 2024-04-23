/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"moovi/m10a2/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
