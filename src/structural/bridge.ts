// ❌ Bad: 결제 처리 방식과 구현이 강하게 결합된 방식
class PayPalRegularPayment {
  processPayment(amount: number, details: string): void {
    console.log("Processing regular payment...");
    console.log(`Paid ${amount} via PayPal to ${details}`);
  }
}

class PayPalSubscriptionPayment {
  processPayment(amount: number, details: string): void {
    console.log("Processing subscription payment...");
    console.log(`Paid ${amount} via PayPal to ${details}`);
  }
}

class StripeRegularPayment {
  processPayment(amount: number, details: string): void {
    console.log("Processing regular payment...");
    console.log(`Charged ${amount} to card ${details}`);
  }
}

class StripeSubscriptionPayment {
  processPayment(amount: number, details: string): void {
    console.log("Processing subscription payment...");
    console.log(`Charged ${amount} to card ${details}`);
  }
}

// 직접 사용
const paypalRegular = new PayPalRegularPayment();
const paypalSubscription = new PayPalSubscriptionPayment();
const stripeRegular = new StripeRegularPayment();
const stripeSubscription = new StripeSubscriptionPayment();

paypalRegular.processPayment(100, "user@example.com");
paypalSubscription.processPayment(50, "user@example.com");
stripeRegular.processPayment(200, "1234-5678-9012-3456");
stripeSubscription.processPayment(75, "1234-5678-9012-3456");

// ✅ Good: Bridge 패턴 사용
interface PaymentImplementation {
  process(amount: number, details: string): void;
}

// Concrete implementations
class PayPalImplementation implements PaymentImplementation {
  process(amount: number, details: string): void {
    console.log(`Paid ${amount} via PayPal to ${details}`);
  }
}

class StripeImplementation implements PaymentImplementation {
  process(amount: number, details: string): void {
    console.log(`Charged ${amount} to card ${details}`);
  }
}

// Abstraction
abstract class PaymentProcessor {
  constructor(protected implementation: PaymentImplementation) {}

  abstract processPayment(amount: number, details: string): void;
}

// Refined abstractions
class RegularPayment extends PaymentProcessor {
  processPayment(amount: number, details: string): void {
    console.log("Processing regular payment...");
    this.implementation.process(amount, details);
  }
}

class SubscriptionPayment extends PaymentProcessor {
  processPayment(amount: number, details: string): void {
    console.log("Processing subscription payment...");
    this.implementation.process(amount, details);
  }
}

// Bridge 패턴을 통한 사용
const paypal = new PayPalImplementation();
const stripe = new StripeImplementation();

const regularPaypalPayment = new RegularPayment(paypal);
const regularStripePayment = new RegularPayment(stripe);
const subscriptionPaypalPayment = new SubscriptionPayment(paypal);
const subscriptionStripePayment = new SubscriptionPayment(stripe);

// 동일한 인터페이스로 다른 결제 시스템 사용
regularPaypalPayment.processPayment(100, "user@example.com");
regularStripePayment.processPayment(200, "1234-5678-9012-3456");
subscriptionPaypalPayment.processPayment(50, "user@example.com");
subscriptionStripePayment.processPayment(75, "1234-5678-9012-3456"); 