import { TABLES } from "../common/constants";
import Wallet from "../data/entities/wallet";
import Repository from "./Repository";

class WalletRepository extends Repository<Wallet> {
  constructor() {
    super(TABLES.Wallet);
  }
}

const walletRepository = new WalletRepository();

export default walletRepository;
