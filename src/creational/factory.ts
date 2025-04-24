// ❌ Bad: 직접 사용자 객체 생성 방식
class BadUser {
  constructor(
    public username: string,
    public email: string,
    public role: string,
    public permissions: string[]
  ) {}

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  getInfo(): string {
    return `${this.username} (${this.email}) - ${this.role}`;
  }
}

// 직접 사용자 객체 생성
const badAdmin = new BadUser("admin", "admin@example.com", "admin", [
  "create",
  "read",
  "update",
  "delete",
  "manage_users",
]);

const badEditor = new BadUser("editor", "editor@example.com", "editor", [
  "create",
  "read",
  "update",
]);

const badViewer = new BadUser("viewer", "viewer@example.com", "viewer", [
  "read",
]);

console.log("Bad Example - Admin:", badAdmin.getInfo());
console.log("Bad Example - Editor:", badEditor.getInfo());
console.log("Bad Example - Viewer:", badViewer.getInfo());

// ✅ Good: Factory 패턴 사용
interface User {
  username: string;
  email: string;
  role: string;
  permissions: string[];
  hasPermission(permission: string): boolean;
  getInfo(): string;
}

class Admin implements User {
  constructor(public username: string, public email: string) {}

  get role(): string {
    return "admin";
  }

  get permissions(): string[] {
    return ["create", "read", "update", "delete", "manage_users"];
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  getInfo(): string {
    return `${this.username} (${this.email}) - ${this.role}`;
  }
}

class Editor implements User {
  constructor(public username: string, public email: string) {}

  get role(): string {
    return "editor";
  }

  get permissions(): string[] {
    return ["create", "read", "update"];
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  getInfo(): string {
    return `${this.username} (${this.email}) - ${this.role}`;
  }
}

class Viewer implements User {
  constructor(public username: string, public email: string) {}

  get role(): string {
    return "viewer";
  }

  get permissions(): string[] {
    return ["read"];
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  getInfo(): string {
    return `${this.username} (${this.email}) - ${this.role}`;
  }
}

// 팩토리 클래스
class UserFactory {
  static createUser(
    type: "admin" | "editor" | "viewer",
    username: string,
    email: string
  ): User {
    switch (type) {
      case "admin":
        return new Admin(username, email);
      case "editor":
        return new Editor(username, email);
      case "viewer":
        return new Viewer(username, email);
      default:
        throw new Error("Invalid user type");
    }
  }
}

// 팩토리를 통한 사용자 생성
const admin = UserFactory.createUser("admin", "admin", "admin@example.com");
const editor = UserFactory.createUser("editor", "editor", "editor@example.com");
const viewer = UserFactory.createUser("viewer", "viewer", "viewer@example.com");

console.log("\nGood Example - Admin:", admin.getInfo());
console.log("Good Example - Editor:", editor.getInfo());
console.log("Good Example - Viewer:", viewer.getInfo());

// 권한 체크 예시
console.log("\nPermission Checks:");
console.log("Admin can delete:", admin.hasPermission("delete")); // true
console.log("Editor can delete:", editor.hasPermission("delete")); // false
console.log("Viewer can read:", viewer.hasPermission("read")); // true
console.log("Viewer can create:", viewer.hasPermission("create")); // false
