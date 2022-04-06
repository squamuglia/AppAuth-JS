"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCrypto = exports.textEncodeLite = exports.urlSafe = exports.bufferToString = void 0;
var base64 = require("base64-js");
var errors_1 = require("./errors");
var Crypto = (typeof window !== "undefined" && window.crypto) || crypto;
var HAS_CRYPTO = !!Crypto;
var HAS_SUBTLE_CRYPTO = HAS_CRYPTO && !!Crypto.subtle;
var CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function bufferToString(buffer) {
    var state = [];
    for (var i = 0; i < buffer.byteLength; i += 1) {
        var index = buffer[i] % CHARSET.length;
        state.push(CHARSET[index]);
    }
    return state.join("");
}
exports.bufferToString = bufferToString;
function urlSafe(buffer) {
    var encoded = base64.fromByteArray(new Uint8Array(buffer));
    return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
exports.urlSafe = urlSafe;
// adapted from source: http://stackoverflow.com/a/11058858
// this is used in place of TextEncode as the api is not yet
// well supported: https://caniuse.com/#search=TextEncoder
function textEncodeLite(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}
exports.textEncodeLite = textEncodeLite;
/**
 * The default implementation of the `Crypto` interface.
 * This uses the capabilities of the browser.
 */
var DefaultCrypto = /** @class */ (function () {
    function DefaultCrypto() {
    }
    DefaultCrypto.prototype.generateRandom = function (size) {
        var buffer = new Uint8Array(size);
        if (HAS_CRYPTO) {
            Crypto.getRandomValues(buffer);
        }
        else {
            // fall back to Math.random() if nothing else is available
            for (var i = 0; i < size; i += 1) {
                buffer[i] = (Math.random() * CHARSET.length) | 0;
            }
        }
        return bufferToString(buffer);
    };
    DefaultCrypto.prototype.deriveChallenge = function (code) {
        if (code.length < 43 || code.length > 128) {
            return Promise.reject(new errors_1.AppAuthError("Invalid code length."));
        }
        if (!HAS_SUBTLE_CRYPTO) {
            return Promise.reject(new errors_1.AppAuthError("window.crypto.subtle is unavailable."));
        }
        return new Promise(function (resolve, reject) {
            Crypto.subtle.digest("SHA-256", textEncodeLite(code)).then(function (buffer) {
                return resolve(urlSafe(new Uint8Array(buffer)));
            }, function (error) { return reject(error); });
        });
    };
    return DefaultCrypto;
}());
exports.DefaultCrypto = DefaultCrypto;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J5cHRvX3V0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NyeXB0b191dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7OztHQVlHOzs7QUFFSCxrQ0FBb0M7QUFFcEMsbUNBQXdDO0FBRXhDLElBQU0sTUFBTSxHQUFHLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUM7QUFDMUUsSUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFFLE1BQWMsQ0FBQztBQUNyQyxJQUFNLGlCQUFpQixHQUFHLFVBQVUsSUFBSSxDQUFDLENBQUUsTUFBTSxDQUFDLE1BQWMsQ0FBQztBQUNqRSxJQUFNLE9BQU8sR0FDWCxnRUFBZ0UsQ0FBQztBQUVuRSxTQUFnQixjQUFjLENBQUMsTUFBa0I7SUFDL0MsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM3QyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUN2QyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQzVCO0lBQ0QsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFQRCx3Q0FPQztBQUVELFNBQWdCLE9BQU8sQ0FBQyxNQUFrQjtJQUN4QyxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDN0QsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUhELDBCQUdDO0FBRUQsMkRBQTJEO0FBQzNELDREQUE0RDtBQUM1RCwwREFBMEQ7QUFDMUQsU0FBZ0IsY0FBYyxDQUFDLEdBQVc7SUFDeEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hDLElBQU0sT0FBTyxHQUFHLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXBDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ25DLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hDO0lBQ0QsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQVJELHdDQVFDO0FBY0Q7OztHQUdHO0FBQ0g7SUFBQTtJQWlDQSxDQUFDO0lBaENDLHNDQUFjLEdBQWQsVUFBZSxJQUFZO1FBQ3pCLElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksVUFBVSxFQUFFO1lBQ2QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNoQzthQUFNO1lBQ0wsMERBQTBEO1lBQzFELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbEQ7U0FDRjtRQUNELE9BQU8sY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCx1Q0FBZSxHQUFmLFVBQWdCLElBQVk7UUFDMUIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtZQUN6QyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxxQkFBWSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztTQUNqRTtRQUNELElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUN0QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQ25CLElBQUkscUJBQVksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUN6RCxDQUFDO1NBQ0g7UUFFRCxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDeEQsVUFBQyxNQUFNO2dCQUNMLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsQ0FBQyxFQUNELFVBQUMsS0FBSyxJQUFLLE9BQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFiLENBQWEsQ0FDekIsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQWpDRCxJQWlDQztBQWpDWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0XG4gKiBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlXG4gKiBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlclxuICogZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBiYXNlNjQgZnJvbSBcImJhc2U2NC1qc1wiO1xuXG5pbXBvcnQgeyBBcHBBdXRoRXJyb3IgfSBmcm9tIFwiLi9lcnJvcnNcIjtcblxuY29uc3QgQ3J5cHRvID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmNyeXB0bykgfHwgY3J5cHRvO1xuY29uc3QgSEFTX0NSWVBUTyA9ICEhKENyeXB0byBhcyBhbnkpO1xuY29uc3QgSEFTX1NVQlRMRV9DUllQVE8gPSBIQVNfQ1JZUFRPICYmICEhKENyeXB0by5zdWJ0bGUgYXMgYW55KTtcbmNvbnN0IENIQVJTRVQgPVxuICBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWZmZXJUb1N0cmluZyhidWZmZXI6IFVpbnQ4QXJyYXkpIHtcbiAgbGV0IHN0YXRlID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmZmVyLmJ5dGVMZW5ndGg7IGkgKz0gMSkge1xuICAgIGxldCBpbmRleCA9IGJ1ZmZlcltpXSAlIENIQVJTRVQubGVuZ3RoO1xuICAgIHN0YXRlLnB1c2goQ0hBUlNFVFtpbmRleF0pO1xuICB9XG4gIHJldHVybiBzdGF0ZS5qb2luKFwiXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXJsU2FmZShidWZmZXI6IFVpbnQ4QXJyYXkpOiBzdHJpbmcge1xuICBjb25zdCBlbmNvZGVkID0gYmFzZTY0LmZyb21CeXRlQXJyYXkobmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSk7XG4gIHJldHVybiBlbmNvZGVkLnJlcGxhY2UoL1xcKy9nLCBcIi1cIikucmVwbGFjZSgvXFwvL2csIFwiX1wiKS5yZXBsYWNlKC89L2csIFwiXCIpO1xufVxuXG4vLyBhZGFwdGVkIGZyb20gc291cmNlOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMTA1ODg1OFxuLy8gdGhpcyBpcyB1c2VkIGluIHBsYWNlIG9mIFRleHRFbmNvZGUgYXMgdGhlIGFwaSBpcyBub3QgeWV0XG4vLyB3ZWxsIHN1cHBvcnRlZDogaHR0cHM6Ly9jYW5pdXNlLmNvbS8jc2VhcmNoPVRleHRFbmNvZGVyXG5leHBvcnQgZnVuY3Rpb24gdGV4dEVuY29kZUxpdGUoc3RyOiBzdHJpbmcpIHtcbiAgY29uc3QgYnVmID0gbmV3IEFycmF5QnVmZmVyKHN0ci5sZW5ndGgpO1xuICBjb25zdCBidWZWaWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGJ1ZlZpZXdbaV0gPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgfVxuICByZXR1cm4gYnVmVmlldztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDcnlwdG8ge1xuICAvKipcbiAgICogR2VuZXJhdGUgYSByYW5kb20gc3RyaW5nXG4gICAqL1xuICBnZW5lcmF0ZVJhbmRvbShzaXplOiBudW1iZXIpOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBDb21wdXRlIHRoZSBTSEEyNTYgb2YgYSBnaXZlbiBjb2RlLlxuICAgKiBUaGlzIGlzIHVzZWZ1bCB3aGVuIHVzaW5nIFBLQ0UuXG4gICAqL1xuICBkZXJpdmVDaGFsbGVuZ2UoY29kZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+O1xufVxuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBgQ3J5cHRvYCBpbnRlcmZhY2UuXG4gKiBUaGlzIHVzZXMgdGhlIGNhcGFiaWxpdGllcyBvZiB0aGUgYnJvd3Nlci5cbiAqL1xuZXhwb3J0IGNsYXNzIERlZmF1bHRDcnlwdG8gaW1wbGVtZW50cyBDcnlwdG8ge1xuICBnZW5lcmF0ZVJhbmRvbShzaXplOiBudW1iZXIpIHtcbiAgICBjb25zdCBidWZmZXIgPSBuZXcgVWludDhBcnJheShzaXplKTtcbiAgICBpZiAoSEFTX0NSWVBUTykge1xuICAgICAgQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyhidWZmZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBmYWxsIGJhY2sgdG8gTWF0aC5yYW5kb20oKSBpZiBub3RoaW5nIGVsc2UgaXMgYXZhaWxhYmxlXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkgKz0gMSkge1xuICAgICAgICBidWZmZXJbaV0gPSAoTWF0aC5yYW5kb20oKSAqIENIQVJTRVQubGVuZ3RoKSB8IDA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBidWZmZXJUb1N0cmluZyhidWZmZXIpO1xuICB9XG5cbiAgZGVyaXZlQ2hhbGxlbmdlKGNvZGU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgaWYgKGNvZGUubGVuZ3RoIDwgNDMgfHwgY29kZS5sZW5ndGggPiAxMjgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQXBwQXV0aEVycm9yKFwiSW52YWxpZCBjb2RlIGxlbmd0aC5cIikpO1xuICAgIH1cbiAgICBpZiAoIUhBU19TVUJUTEVfQ1JZUFRPKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXG4gICAgICAgIG5ldyBBcHBBdXRoRXJyb3IoXCJ3aW5kb3cuY3J5cHRvLnN1YnRsZSBpcyB1bmF2YWlsYWJsZS5cIilcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIENyeXB0by5zdWJ0bGUuZGlnZXN0KFwiU0hBLTI1NlwiLCB0ZXh0RW5jb2RlTGl0ZShjb2RlKSkudGhlbihcbiAgICAgICAgKGJ1ZmZlcikgPT4ge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKHVybFNhZmUobmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSkpO1xuICAgICAgICB9LFxuICAgICAgICAoZXJyb3IpID0+IHJlamVjdChlcnJvcilcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==