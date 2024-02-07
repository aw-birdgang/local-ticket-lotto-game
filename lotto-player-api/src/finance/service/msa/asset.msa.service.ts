import { Injectable } from '@nestjs/common';
import {GameKafkaClientService} from "../../../common/microservice/kafka-game-client-service";
import {TcpRequest} from "../../../common/microservice/tcp-request";
import {TcpResponse} from "../../../common/microservice/tcp-response";
import {GameMessagePatterns} from "../../../common/microservice/game-message-pattern";
import {AssetDto} from "../../dto/asset.dto";
import {AssetParameter} from "../../entity/finance.parameter";
import {AssetType} from "../../entity/finance.enum";

@Injectable()
export class AssetMsaService {
    constructor(private readonly gameKafkaClientService: GameKafkaClientService) {}

    async findAssetById(assetId: number): Promise<AssetDto> {
        const request = TcpRequest.from<number>(assetId);
        const response = await this.gameKafkaClientService.send<TcpResponse<AssetDto>>(
            GameMessagePatterns.FINANCE_findAssetById,
            request
        );
        return response.data;
    }

    async findAssetByOwnerIdAndAssetType(ownerId: number, assetType: AssetType): Promise<AssetDto> {
        const request = TcpRequest.from<AssetParameter>(AssetParameter.from(ownerId, assetType));
        const response = await this.gameKafkaClientService.send<TcpResponse<AssetDto>>(
            GameMessagePatterns.FINANCE_findAssetByOwnerIdAndAssetType,
            request,
        );
        return response.data;
    }
}
