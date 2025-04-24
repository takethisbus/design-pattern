// ❌ Bad: 직접 서브시스템에 접근하는 방식
class BadAccountService {
  constructor(private balance: number) {}

  getBalance(): number {
    return this.balance;
  }

  deposit(amount: number): void {
    this.balance += amount;
    console.log(`Deposited ${amount}. New balance: ${this.balance}`);
  }

  withdraw(amount: number): void {
    if (this.balance >= amount) {
      this.balance -= amount;
      console.log(`Withdrawn ${amount}. New balance: ${this.balance}`);
    } else {
      console.log("Insufficient funds");
    }
  }
}

class BadTransactionService {
  private transactions: string[] = [];

  recordTransaction(description: string): void {
    this.transactions.push(`${new Date().toISOString()} - ${description}`);
    console.log("Transaction recorded:", description);
  }

  getTransactionHistory(): string[] {
    return this.transactions;
  }
}

class BadNotificationService {
  sendNotification(message: string): void {
    console.log("Notification sent:", message);
  }
}

// 직접 서브시스템 사용
const badAccount = new BadAccountService(1000);
const badTransaction = new BadTransactionService();
const badNotification = new BadNotificationService();

// 계좌 이체 시 모든 서브시스템을 직접 조작해야 함
badAccount.withdraw(500);
badTransaction.recordTransaction("Withdrawal of 500");
badNotification.sendNotification("Withdrawal of 500 completed");
badAccount.deposit(500);
badTransaction.recordTransaction("Deposit of 500");
badNotification.sendNotification("Deposit of 500 completed");

console.log("Bad Example - Balance:", badAccount.getBalance());
console.log(
  "Bad Example - Transactions:",
  badTransaction.getTransactionHistory()
);

// ✅ Good: Facade 패턴 사용
// 서브시스템 클래스들
class AccountService {
  constructor(private balance: number) {}

  getBalance(): number {
    return this.balance;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }

  withdraw(amount: number): boolean {
    if (this.balance >= amount) {
      this.balance -= amount;
      return true;
    }
    return false;
  }
}

class TransactionService {
  private transactions: string[] = [];

  recordTransaction(description: string): void {
    this.transactions.push(`${new Date().toISOString()} - ${description}`);
  }

  getTransactionHistory(): string[] {
    return this.transactions;
  }
}

class NotificationService {
  sendNotification(message: string): void {
    console.log("Notification sent:", message);
  }
}

// Facade 클래스
class BankFacade {
  private account: AccountService;
  private transaction: TransactionService;
  private notification: NotificationService;

  constructor(initialBalance: number) {
    this.account = new AccountService(initialBalance);
    this.transaction = new TransactionService();
    this.notification = new NotificationService();
  }

  // 단순화된 인터페이스 제공
  transfer(amount: number, toAccount: string): boolean {
    console.log(`Transferring ${amount} to account ${toAccount}`);

    if (this.account.withdraw(amount)) {
      this.transaction.recordTransaction(
        `Transfer of ${amount} to ${toAccount}`
      );
      this.notification.sendNotification(
        `Transfer of ${amount} to ${toAccount} completed`
      );
      return true;
    } else {
      this.notification.sendNotification("Transfer failed: Insufficient funds");
      return false;
    }
  }

  deposit(amount: number): void {
    this.account.deposit(amount);
    this.transaction.recordTransaction(`Deposit of ${amount}`);
    this.notification.sendNotification(`Deposit of ${amount} completed`);
  }

  getBalance(): number {
    return this.account.getBalance();
  }

  getTransactionHistory(): string[] {
    return this.transaction.getTransactionHistory();
  }
}

// Facade를 통한 사용
const bank = new BankFacade(1000);

// 복잡한 서브시스템을 단순화된 인터페이스로 사용
bank.deposit(500);
console.log("Good Example - Balance after deposit:", bank.getBalance());

const transferSuccess = bank.transfer(300, "67890");
console.log("Good Example - Transfer successful:", transferSuccess);
console.log("Good Example - Balance after transfer:", bank.getBalance());
console.log(
  "Good Example - Transaction history:",
  bank.getTransactionHistory()
);
