import {Injectable} from '@nestjs/common';
import {EntityManager, Repository} from "typeorm";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {AssetTransaction} from "../entity/asset-transaction.entity";
import {AssetService} from "./asset.service";
import {OrderType, TransactionType} from "../entity/finance.enum";
import {Asset} from "../entity/asset.entity";
import {FilterSort, SortingType} from "../../common/microservice/from-search-filter";
import {Pagination} from "../../common/microservice/tcp-request";
import {isEmpty, isNotEmpty} from "class-validator";
import {AssetTransactionDto} from "../dto/asset-transaction.dto";
import {AssetTransactionDetailDto} from "../dto/asset-transaction-detail.dto";
import {PaginationMeta, TcpPaginationResponse} from "../../common/microservice/tcp-response";
import {BuyTicketDto} from "../dto/buy-ticket.dto";
import {CreateAssetDto} from "../dto/create-asset.dto";
import {DepositDto} from "../dto/deposit.dto";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";
import {ErrorCodes} from "../../common/exception/error.enum";
import {PayoutDepositDto} from "../dto/payout-deposit.dto";

@Injectable()
export class AssetTransactionService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(AssetTransaction) private assetTransactionRepository: Repository<AssetTransaction>,
        private readonly assetService: AssetService,
    ) {}

    findById(id: number): Promise<AssetTransaction> {
        return this.assetTransactionRepository.findOneBy({ id });
    }

    findByOrderTypeAndOrderId(orderType: OrderType, orderId: string): Promise<AssetTransaction> {
        return this.assetTransactionRepository.findOneBy({ orderType, orderId });
    }

    findByOwnerId(ownerId: number) {
        return this.assetTransactionRepository.find({ where: { buyerId: ownerId }, order: { transactionDate: "DESC" } });
    }

    private baseQuery() {
        return this.entityManager
            .createQueryBuilder(AssetTransaction, "at")
            .innerJoin(Asset, "as", "as.id = at.asset_id")
            .select("at.id", "id")
            .addSelect("at.buyer_id", "buyerId")
            .addSelect("at.asset_id", "assetId")
            .addSelect("at.transaction_date", "transactionDate")
            .addSelect("at.transaction_type", "transactionType")
            .addSelect("at.amount", "amount")
            .addSelect("at.order_type", "orderType")
            .addSelect("at.order_id", "orderId");
    }

    async findPaginationByFilterSort(filterSort: FilterSort, pagination: Pagination) {
        const queryBuilder = this.baseQuery();
        if (isNotEmpty(filterSort.filter["ownerId"])) {
            const ownerId = filterSort.filter["ownerId"];
            queryBuilder.andWhere("as.owner_id = :ownerId", { ownerId });
        }
        if (isNotEmpty(filterSort.filter["transactionType"])) {
            const transactionType = filterSort.filter["transactionType"];
            if (!transactionType.includes("all")) {
                queryBuilder.andWhere({ transactionType });
            }
        }
        if (isNotEmpty(filterSort.filter["startDate"]) && isNotEmpty(filterSort.filter["endDate"])) {
            const startDate = filterSort.filter["startDate"];
            const endDate = filterSort.filter["endDate"];
            queryBuilder.andWhere("at.transaction_date BETWEEN :startDate AND :endDate", {
                startDate: new Date(startDate),
                endDate: new Date(endDate + " 23:59:59"),
            });
        }
        if (isNotEmpty(filterSort.sort)) {
            queryBuilder.orderBy(filterSort.sort);
        } else {
            queryBuilder.orderBy({ transactionDate: SortingType.DESC });
        }
        const total = await queryBuilder.getCount();
        queryBuilder.offset((pagination.page - 1) * pagination.offset);
        queryBuilder.limit(pagination.offset);
        console.log("findPaginationByFilterSort  query -> ", queryBuilder.getQuery());
        const list = await queryBuilder.getRawMany<AssetTransactionDto>();
        const assetTransactionOList = await Promise.all(
            list.map(async (assetTransactionDto) => {
                return AssetTransactionDetailDto.from(assetTransactionDto, null);
            }),
        );
        return TcpPaginationResponse.from<AssetTransactionDetailDto[]>(
            assetTransactionOList,
            PaginationMeta.from(total, pagination.page, Math.ceil(total / pagination.offset)),
        );
    }

    async buyTicket(buyTicketDto: BuyTicketDto) {
        console.log("buyTicket  buyTicketDto -> ", buyTicketDto);
        let asset = await this.assetService.findByOwnerIdAndAssetType(buyTicketDto.buyerId, buyTicketDto.assetType);
        if (isEmpty(asset)) {
            asset = await this.assetService.createAsset(CreateAssetDto.from(buyTicketDto.buyerId, buyTicketDto.assetType, 0))
        }
        const assetTransaction = AssetTransaction.from(
            null,
            buyTicketDto.buyerId,
            asset.id,
            new Date(),
            TransactionType.BUY_TICKET,
            buyTicketDto.amount,
            OrderType.TICKET,
            buyTicketDto.orderId,
        );
        return this.assetTransactionRepository.save(assetTransaction);
    }

    async cancelTicket(buyTicketDto: BuyTicketDto) {
        console.log("cancelTicket  data -> ", buyTicketDto);
        const asset = await this.assetService.findByOwnerIdAndAssetType(buyTicketDto.buyerId, buyTicketDto.assetType);
        if (isEmpty(asset)) {
            return;
        }
        const assetTransaction = await this.findByOrderTypeAndOrderId(OrderType.TICKET, buyTicketDto.orderId);
        if (isEmpty(assetTransaction)) {
            return;
        }
        const updateResult = await this.assetTransactionRepository.softDelete(assetTransaction.id);
        if (isEmpty(updateResult) || updateResult.affected <= 0) {
            console.log("cancelTicket 0 data modifications or errors -> ", buyTicketDto, updateResult);
            // throw new BusinessRpcException(ErrorCodes.BUS_ERROR_009);
        }
    }

    async deposit(depositDto: DepositDto) {
        const asset = await this.assetService.plusBalance(depositDto.buyerId, depositDto.assetType, depositDto.amount);
        if (isEmpty(asset)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_015);
        }
        const assetTransaction = AssetTransaction.from(
            null,
            depositDto.buyerId,
            asset.id,
            new Date(),
            TransactionType.DEPOSIT_POINT,
            depositDto.amount,
            OrderType.DEPOSIT,
            String(asset.id),
        );
        return this.assetTransactionRepository.save(assetTransaction);
    }

    async prizePayout(payoutDepositDto: PayoutDepositDto) {
        const asset = await this.assetService.plusBalance(payoutDepositDto.buyerId, payoutDepositDto.assetType, payoutDepositDto.amount);
        if (isEmpty(asset)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_015);
        }
        const assetTransaction = AssetTransaction.from(
            null,
            payoutDepositDto.buyerId,
            asset.id,
            new Date(),
            TransactionType.PRIZE_TICKET,
            payoutDepositDto.amount,
            OrderType.PRIZE_PAYOUT,
            String(asset.id),
        );
        return this.assetTransactionRepository.save(assetTransaction);
    }
}
