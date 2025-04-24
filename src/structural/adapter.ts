// ❌ Bad: 직접 다른 인터페이스를 사용하는 방식
class PayPalPayment {
  makePayment(amount: number, email: string): void {
    console.log(`Paid ${amount} via PayPal to ${email}`);
  }
}

class StripePayment {
  charge(amount: number, cardNumber: string): void {
    console.log(`Charged ${amount} to card ${cardNumber}`);
  }
}

// 직접 다른 인터페이스 사용
const paypal = new PayPalPayment();
const stripe = new StripePayment();

paypal.makePayment(100, "user@example.com");
stripe.charge(200, "1234-5678-9012-3456");

// ✅ Good: Adapter 패턴 사용
// Target 인터페이스
interface PaymentProcessor {
  processPayment(amount: number, details: string): void;
}

// Adapter 클래스들
class PayPalService {
  makePayment(amount: number, email: string): void {
    console.log(`Paid ${amount} via PayPal to ${email}`);
  }
}

class StripeService {
  charge(amount: number, cardNumber: string): void {
    console.log(`Charged ${amount} to card ${cardNumber}`);
  }
}

// Adapter 클래스들
class PayPalAdapter implements PaymentProcessor {
  constructor(private paypal: PayPalService) {}

  processPayment(amount: number, details: string): void {
    this.paypal.makePayment(amount, details);
  }
}

class StripeAdapter implements PaymentProcessor {
  constructor(private stripe: StripeService) {}

  processPayment(amount: number, details: string): void {
    this.stripe.charge(amount, details);
  }
}

// 클라이언트 코드
function processPayments(processor: PaymentProcessor, amount: number, details: string): void {
  processor.processPayment(amount, details);
}

// Adapter를 통한 사용
const paypalAdapter = new PayPalAdapter(new PayPalService());
const stripeAdapter = new StripeAdapter(new StripeService());

// 동일한 인터페이스로 다른 결제 시스템 사용
processPayments(paypalAdapter, 100, "user@example.com");
processPayments(stripeAdapter, 200, "1234-5678-9012-3456"); 