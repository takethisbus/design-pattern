// ❌ Bad: 모든 설정을 한 번에 전달하는 방식
class BadHttpRequest {
  constructor(
    public url: string,
    public method: string,
    public headers: Record<string, string>,
    public body: any,
    public timeout: number,
    public retryCount: number,
    public cache: boolean
  ) {}

  execute(): void {
    console.log(`Executing ${this.method} request to ${this.url}`);
    console.log("Headers:", this.headers);
    console.log("Body:", this.body);
    console.log("Timeout:", this.timeout);
    console.log("Retry Count:", this.retryCount);
    console.log("Cache:", this.cache);
  }
}

// 모든 설정을 한 번에 전달해야 함
const badRequest = new BadHttpRequest(
  "https://api.example.com/users",
  "POST",
  {
    "Content-Type": "application/json",
    Authorization: "Bearer token123",
  },
  { name: "John", age: 30 },
  5000,
  3,
  true
);

console.log("Bad Example:");
badRequest.execute();

// ✅ Good: Builder 패턴 사용
class HttpRequest {
  constructor(
    public url: string,
    public method: string,
    public headers: Record<string, string>,
    public body: any,
    public timeout: number,
    public retryCount: number,
    public cache: boolean
  ) {}

  execute(): void {
    console.log(`Executing ${this.method} request to ${this.url}`);
    console.log("Headers:", this.headers);
    console.log("Body:", this.body);
    console.log("Timeout:", this.timeout);
    console.log("Retry Count:", this.retryCount);
    console.log("Cache:", this.cache);
  }
}

interface HttpRequestBuilder {
  setUrl(url: string): HttpRequestBuilder;
  setMethod(method: string): HttpRequestBuilder;
  setHeader(key: string, value: string): HttpRequestBuilder;
  setBody(body: any): HttpRequestBuilder;
  setTimeout(timeout: number): HttpRequestBuilder;
  setRetryCount(count: number): HttpRequestBuilder;
  setCache(cache: boolean): HttpRequestBuilder;
  build(): HttpRequest;
}

class DefaultHttpRequestBuilder implements HttpRequestBuilder {
  private url: string = "";
  private method: string = "GET";
  private headers: Record<string, string> = {};
  private body: any = null;
  private timeout: number = 3000;
  private retryCount: number = 0;
  private cache: boolean = false;

  setUrl(url: string): HttpRequestBuilder {
    this.url = url;
    return this;
  }

  setMethod(method: string): HttpRequestBuilder {
    this.method = method;
    return this;
  }

  setHeader(key: string, value: string): HttpRequestBuilder {
    this.headers[key] = value;
    return this;
  }

  setBody(body: any): HttpRequestBuilder {
    this.body = body;
    return this;
  }

  setTimeout(timeout: number): HttpRequestBuilder {
    this.timeout = timeout;
    return this;
  }

  setRetryCount(count: number): HttpRequestBuilder {
    this.retryCount = count;
    return this;
  }

  setCache(cache: boolean): HttpRequestBuilder {
    this.cache = cache;
    return this;
  }

  build(): HttpRequest {
    return new HttpRequest(
      this.url,
      this.method,
      this.headers,
      this.body,
      this.timeout,
      this.retryCount,
      this.cache
    );
  }
}

// 디렉터 클래스 - 자주 사용되는 요청 설정을 미리 정의
class HttpRequestDirector {
  constructor(private builder: HttpRequestBuilder) {}

  createUserRequest(userData: any): HttpRequest {
    return this.builder
      .setUrl("https://api.example.com/users")
      .setMethod("POST")
      .setHeader("Content-Type", "application/json")
      .setHeader("Authorization", "Bearer token123")
      .setBody(userData)
      .setTimeout(5000)
      .setRetryCount(3)
      .setCache(false)
      .build();
  }

  getUserRequest(userId: string): HttpRequest {
    return this.builder
      .setUrl(`https://api.example.com/users/${userId}`)
      .setMethod("GET")
      .setHeader("Authorization", "Bearer token123")
      .setTimeout(3000)
      .setRetryCount(2)
      .setCache(true)
      .build();
  }
}

// Builder 패턴을 사용한 HTTP 요청 생성
const builder = new DefaultHttpRequestBuilder();
const director = new HttpRequestDirector(builder);

// 디렉터를 사용하여 미리 정의된 요청 생성
const createUserRequest = director.createUserRequest({
  name: "John",
  age: 30,
  email: "john@example.com",
});

const getUserRequest = director.getUserRequest("123");

console.log("\nGood Example - Create User Request:");
createUserRequest.execute();

console.log("\nGood Example - Get User Request:");
getUserRequest.execute();

// 빌더를 직접 사용하여 커스텀 요청 생성
const customRequest = builder
  .setUrl("https://api.example.com/products")
  .setMethod("PUT")
  .setHeader("Content-Type", "application/json")
  .setHeader("Authorization", "Bearer token123")
  .setBody({ id: 1, name: "Product 1", price: 100 })
  .setTimeout(10000)
  .setRetryCount(5)
  .setCache(false)
  .build();

console.log("\nGood Example - Custom Request:");
customRequest.execute();
