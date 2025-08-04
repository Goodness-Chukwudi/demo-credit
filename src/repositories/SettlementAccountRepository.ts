import { TABLES } from "../common/constants";
import SettlementAccount from "../data/entities/settlement_account";
import Repository from "./Repository";

class SettlementAccountRepository extends Repository<SettlementAccount> {
  constructor() {
    super(TABLES.SettlementAccount);
  }
}

const settlementAccountRepository = new SettlementAccountRepository();

export default settlementAccountRepository;
