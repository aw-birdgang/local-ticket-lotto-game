import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Asset} from "../entity/asset.entity";
import {Repository} from "typeorm";
import {AssetType} from "../entity/finance.enum";
import {CreateAssetDto} from "../dto/create-asset.dto";
import {isEmpty} from "class-validator";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";
import {ErrorCodes} from "../../common/exception/error.enum";

@Injectable()
export class AssetService {
    constructor(@InjectRepository(Asset) private assetRepository: Repository<Asset>) {}

    findById(id: number): Promise<Asset> {
        return this.assetRepository.findOneBy({ id });
    }

    findByOwnerIdAndAssetType(ownerId: number, assetType: AssetType): Promise<Asset> {
        return this.assetRepository.findOneBy({ ownerId, assetType });
    }

    findByOwnerId(ownerId: number): Promise<Asset[]> {
        return this.assetRepository.findBy({ ownerId });
    }

    createAsset(createAssetDto: CreateAssetDto): Promise<Asset> {
        return this.saveAsset(Asset.from(null, createAssetDto.assetType, createAssetDto.ownerId, 0));
    }

    saveAsset(asset: Asset): Promise<Asset> {
        return this.assetRepository.save(asset);
    }

    async plusBalance(ownerId: number, assetType: AssetType, amount: number) {
        const asset = await this.findByOwnerIdAndAssetType(ownerId, assetType);
        if (isEmpty(asset)) {
            return this.createAsset(CreateAssetDto.from(ownerId, assetType, amount));
        } else {
            asset.balance = asset.balance + amount;
            return this.saveAsset(asset);
        }
    }

    async minusBalance(ownerId: number, assetType: AssetType, amount: number) {
        const asset = await this.findByOwnerIdAndAssetType(ownerId, assetType);
        if (isEmpty(asset)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_015);
        }
        if (asset.balance < amount) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_014);
        }
        asset.balance = asset.balance - amount;
        return this.saveAsset(asset);
    }
}
