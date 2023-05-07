import { get } from "src/utils/http";

export function login(): Promise<{ token: string, user_id: number }> {
  return get('/user/login')
}
