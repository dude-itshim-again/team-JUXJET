"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Priority = exports.ComplaintStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["CITIZEN"] = "CITIZEN";
    Role["STAFF"] = "STAFF";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var ComplaintStatus;
(function (ComplaintStatus) {
    ComplaintStatus["SUBMITTED"] = "SUBMITTED";
    ComplaintStatus["ASSIGNED"] = "ASSIGNED";
    ComplaintStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ComplaintStatus["RESOLVED"] = "RESOLVED";
})(ComplaintStatus || (exports.ComplaintStatus = ComplaintStatus = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "LOW";
    Priority["MEDIUM"] = "MEDIUM";
    Priority["HIGH"] = "HIGH";
    Priority["CRITICAL"] = "CRITICAL";
})(Priority || (exports.Priority = Priority = {}));
//# sourceMappingURL=enums.js.map