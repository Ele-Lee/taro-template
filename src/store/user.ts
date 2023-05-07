import makeStore from "src/utils/store";
import { useEffect } from "react";
import { login } from "src/service/user";


export const initialUser = {
  token: '',
  userId: 0
}

export const { Provider: UserProvider, useStore: userUserStore } = makeStore<typeof initialUser>();

export function useLogin() {
  const [, setUserState] = userUserStore();

  useEffect(() => {
    login().then(res => {
      setUserState({ userId: res.user_id });
    });
  }, []);
}
