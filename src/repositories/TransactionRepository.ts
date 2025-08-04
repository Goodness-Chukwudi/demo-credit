import { TABLES } from "../common/constants";
import Transaction from "../data/entities/transaction";
import Repository from "./Repository";

class TransactionRepository extends Repository<Transaction> {
  constructor() {
    super(TABLES.Transaction);
  }
}

const transactionRepository = new TransactionRepository();

export default transactionRepository;
