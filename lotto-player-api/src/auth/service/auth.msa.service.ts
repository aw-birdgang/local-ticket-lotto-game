import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import bcryptjs from "bcryptjs";
import {TcpRequest} from "../../common/microservice/tcp-request";
import {AuthMessagePatterns} from "../../common/microservice/auth-message-pattern";
import {AuthKafkaClientService} from "../../common/microservice/kafka-auth-client-service";
import {TcpResponse} from "../../common/microservice/tcp-response";
import {SignUpDto} from "../dto/sign-up.dto";
import {PlayerUserDto} from "../../account/dto/player-user.dto";
import {LogInDto} from "../dto/log-in.dto";
import {RequestRefreshTokenDto} from "../dto/request-refresh-token.dto";
import {JWTokenDto} from "../dto/jwt-tokens.dto";
import {Payload} from "../dto/jwt-payload.dto";
import {ClientAccessType, SocialType} from "../../account/entity/account.enum";
import {PlayerUserSocialDto} from "../../account/dto/player-user-social.dto";
import {format} from "date-fns";
import {EditTokenParameter} from "../../account/entity/account.parameter";
import {AccountMsaService} from "../../account/service/account.msa.service";
import {ClientRegisterMsaService} from "../../account/service/client-register.msa.service";

@Injectable()
export class AuthPlayerService {
  private readonly jwtSecretKey = process.env.JWT_SECRET_KEY;

  constructor(
    private readonly jwtService: JwtService,
    private readonly playerUserMsService: AccountMsaService,
    private readonly clientRegisterMsService: ClientRegisterMsaService,
    private readonly authKafkaClientService: AuthKafkaClientService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<TcpResponse<PlayerUserDto>> {
    const request = TcpRequest.from<SignUpDto>(signUpDto);
    return await this.authKafkaClientService.send<TcpResponse<PlayerUserDto>>(AuthMessagePatterns.AUTH_playerUserSignup, request);
  }

  async login(loginDto: LogInDto) {
    const request = TcpRequest.from<LogInDto>(loginDto);
    return await this.authKafkaClientService.send<TcpResponse<PlayerUserDto>>(AuthMessagePatterns.AUTH_playerUserLogin, request);
  }

  async refresh(requestRefreshToken: RequestRefreshTokenDto): Promise<TcpResponse<JWTokenDto>> {
    const request = TcpRequest.from<RequestRefreshTokenDto>(requestRefreshToken);
    return await this.authKafkaClientService.send<TcpResponse<RequestRefreshTokenDto>>(AuthMessagePatterns.AUTH_playerUserRefreshToken, request);
  }

  tokenVerify(token: string): Promise<Payload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.jwtSecretKey,
    });
  }

  private generateAccessToken(payload: object): Promise<string> {
    console.log("generateAccessToken  -> ", this.jwtSecretKey);
    const options = {
      secret: this.jwtSecretKey,
      expiresIn: "7d",
    };
    return this.jwtService.signAsync(payload, options);
  }

  private generateRefreshToken(payload: object): Promise<string> {
    const options = {
      secret: this.jwtSecretKey,
      expiresIn: "30d",
    };
    return this.jwtService.signAsync(payload, options);
  }

  private hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, 12);
  }

  private comparePasswords(password: string, passwordHash: string): Promise<boolean> {
    return bcryptjs.compare(password, passwordHash);
  }

  async googleLoginCallBack(req: any) {
    if (!req.user) {
      console.error('No user from google');
    }
    const name = req.user.lastName+req.user.firstName;
    const email = req.user.email;

    const playerUserSocialDto = new PlayerUserSocialDto();
    playerUserSocialDto.email = email;
    playerUserSocialDto.username = name;
    playerUserSocialDto.accessToken = req.user.accessToken;
    playerUserSocialDto.socialType = SocialType.GOOGLE;

    await this.playerUserMsService.playerUserGoogleLogin(playerUserSocialDto);

    const payload = { username: name, sub: email, roles: [] };
    const jwTokenDto = new JWTokenDto();
    jwTokenDto.accessToken = await this.generateAccessToken(payload);
    jwTokenDto.refreshToken = await this.generateRefreshToken(payload);
    await this.clientRegisterMsService.editClientRegisterToken(EditTokenParameter.from(email, ClientAccessType.PLAYER_USER, jwTokenDto.refreshToken));

    const result = {
      email: email,
      jwt: jwTokenDto.accessToken,
      refresh: jwTokenDto.refreshToken,
      expiresIn: format(new Date(), "yyyy-MM-dd'T'HH:mm:00.000")
    };

    return result;
  }
}
