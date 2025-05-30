export interface JwtUtils {
  sign: (payload: any) => string;
  verify: (token: string) => any;
}
