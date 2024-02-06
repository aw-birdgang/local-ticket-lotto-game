import {Controller, Get} from "@nestjs/common";
import {HealthCheck, HealthCheckService, MicroserviceHealthIndicator} from "@nestjs/terminus";
import {ApiTags} from "@nestjs/swagger";
import {ConfigService} from "@nestjs/config";
import {Transport} from "@nestjs/microservices";
import {generateAuthToken} from "aws-msk-iam-sasl-signer-js";

async function oauthBearerTokenProvider(region: string): Promise<{ value: string }> {
    const authTokenResponse = await generateAuthToken({ region });
    return {
        value: authTokenResponse.token
    };
}


@ApiTags("Health/check")
@Controller("api/health")
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private microservice: MicroserviceHealthIndicator,
        private configService: ConfigService,
    ) {
    }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => {
                let microserviceOptions = null;
                if (process.env.NODE_ENV === "local") {
                    microserviceOptions = {
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                clientId: process.env.KAFKA_CLIENT_PREFIX,
                                brokers: process.env.KAFKA_BROKER_URL.split(","),
                            },
                            consumer: {
                                groupId: process.env.KAFKA_CONSUMER_GROUP_PREFIX
                            }
                        }
                    }
                } else {
                    microserviceOptions = {
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                clientId: process.env.KAFKA_CLIENT_PREFIX,
                                brokers: process.env.KAFKA_BROKER_URL.split(",").sort(() => Math.random() - 0.5),
                                ssl: true,
                                sasl: {
                                    mechanism: "oauthbearer",
                                    oauthBearerProvider: () => oauthBearerTokenProvider("ap-southeast-1")
                                }
                            },
                            consumer: {
                                groupId: process.env.KAFKA_CONSUMER_GROUP_PREFIX
                            }
                        }
                    }
                }
                return this.microservice.pingCheck("kafka", microserviceOptions);
            },
        ]);
    }
}
