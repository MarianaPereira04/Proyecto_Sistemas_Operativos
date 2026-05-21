"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgorithmsController = void 0;
const common_1 = require("@nestjs/common");
const algorithms_service_1 = require("./algorithms.service");
let AlgorithmsController = class AlgorithmsController {
    algorithmsService;
    constructor(algorithmsService) {
        this.algorithmsService = algorithmsService;
    }
    getStatus() {
        return { status: 'Algorithms API is running' };
    }
    simulateProcesos(algorithm, data) {
        return this.algorithmsService.simulateProcesos(algorithm, data);
    }
    simulateMemoria(algorithm, data) {
        return this.algorithmsService.simulateMemoria(algorithm, data);
    }
    simulateDisco(algorithm, data) {
        return this.algorithmsService.simulateDisco(algorithm, data);
    }
};
exports.AlgorithmsController = AlgorithmsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlgorithmsController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('procesos/:algorithm'),
    __param(0, (0, common_1.Param)('algorithm')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlgorithmsController.prototype, "simulateProcesos", null);
__decorate([
    (0, common_1.Post)('memoria/:algorithm'),
    __param(0, (0, common_1.Param)('algorithm')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlgorithmsController.prototype, "simulateMemoria", null);
__decorate([
    (0, common_1.Post)('disco/:algorithm'),
    __param(0, (0, common_1.Param)('algorithm')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AlgorithmsController.prototype, "simulateDisco", null);
exports.AlgorithmsController = AlgorithmsController = __decorate([
    (0, common_1.Controller)('algorithms'),
    __metadata("design:paramtypes", [algorithms_service_1.AlgorithmsService])
], AlgorithmsController);
//# sourceMappingURL=algorithms.controller.js.map