import { TABLES } from "../common/constants";
import LockedFund from "../data/entities/locked_funds";
import Repository from "./Repository";

class LockedFundRepository extends Repository<LockedFund> {
  constructor() {
    super(TABLES.LockedFund);
  }
}

const lockedFundRepository = new LockedFundRepository();

export default lockedFundRepository;
