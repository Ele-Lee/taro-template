import './app.css';
import { UserProvider, initialUser } from './store/user';

export default props => {
  return <UserProvider initialValue={initialUser}>{props.children}</UserProvider>;
};
