import { Controller } from '@nestjs/common';
import {AssetService} from "../service/asset.service";
import {GameMessagePatterns} from "../../common/microservice/game-message-pattern";
import {MessagePattern} from "@nestjs/microservices";
import {TcpRequest} from "../../common/microservice/tcp-request";
import {TcpResponse} from "../../common/microservice/tcp-response";
import {AssetDto} from "../dto/asset.dto";
import {AssetParameter} from "../entity/finance.parameter";
import {CreateAssetDto} from "../dto/create-asset.dto";
import {isEmpty} from "class-validator";

@Controller()
export class AssetController {
    constructor(private readonly assetService: AssetService) {
    }

    @MessagePattern(GameMessagePatterns.FINANCE_findAssetById)
    async findAssetById(request: TcpRequest<number>): Promise<TcpResponse<AssetDto>> {
        console.log("findAssetById  -> ", request);
        const asset = await this.assetService.findById(Number(request.data));
        return TcpResponse.from<AssetDto>(asset.toAssetDto());
    }

    @MessagePattern(GameMessagePatterns.FINANCE_findAssetByOwnerIdAndAssetType)
    async findAssetByOwnerIdAndAssetType(request: TcpRequest<AssetParameter>): Promise<TcpResponse<AssetDto>> {
        console.log("findAssetByOwnerIdAndAssetType  -> ", request);
        const asset = await this.assetService.findByOwnerIdAndAssetType(request.data.ownerId, request.data.assetType);
        console.log("findAssetByOwnerIdAndAssetType  -> ", asset);
        return TcpResponse.from<AssetDto>(isEmpty(asset) ? null : asset.toAssetDto());
    }

    @MessagePattern(GameMessagePatterns.FINANCE_createAsset)
    async createAsset(request: TcpRequest<CreateAssetDto>): Promise<TcpResponse<AssetDto>> {
        console.log("createAsset  -> ", request);
        const asset = await this.assetService.createAsset(request.data);
        return TcpResponse.from<AssetDto>(asset.toAssetDto());
    }
}
