"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompressionMethods = exports.CompressionEncodings = void 0;
var CompressionEncodings;
(function (CompressionEncodings) {
    CompressionEncodings["None"] = "None";
    CompressionEncodings["Binary"] = "Binary";
    CompressionEncodings["base64"] = "base64";
    CompressionEncodings["UInt8Array"] = "UInt8Array";
})(CompressionEncodings = exports.CompressionEncodings || (exports.CompressionEncodings = {}));
var CompressionMethods;
(function (CompressionMethods) {
    CompressionMethods["None"] = "None";
    CompressionMethods["Pako"] = "Pako";
})(CompressionMethods = exports.CompressionMethods || (exports.CompressionMethods = {}));
