import 'knex';
import User from '../data/entities/user';
import LoginSession from '../data/entities/login_session';
import Password from '../data/entities/password';

declare module 'knex/types/tables' {

  interface Tables {
    users: User;
    login_sessions: LoginSession;
    passwords: Password;
  }
}
