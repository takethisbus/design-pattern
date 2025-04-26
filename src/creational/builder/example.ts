// 권한 관련 타입 정의
type Action = "create" | "read" | "update" | "delete";
type Subject = "Post" | "Comment" | "User";
type Condition = (context: any) => boolean;

interface Permission {
  action: Action;
  subject: Subject;
  fields?: string[]; // 특정 필드에 대한 권한 제한
  conditions?: Condition[];
}

// 빌더 인터페이스
interface PermissionBuilder {
  can: (action: Action) => PermissionBuilder;
  on: (subject: Subject) => PermissionBuilder;
  withFields: (fields: string[]) => PermissionBuilder; // 필드 제한 추가
  when: (condition: Condition) => PermissionBuilder;
  build: () => Permission;
}

// 빌더 생성 함수
const createPermissionBuilder = (): PermissionBuilder => {
  const permission: Partial<Permission> = {};

  return {
    can: (action) => {
      permission.action = action;
      return createPermissionBuilder();
    },

    on: (subject) => {
      permission.subject = subject;
      return createPermissionBuilder();
    },

    withFields: (fields) => {
      permission.fields = fields;
      return createPermissionBuilder();
    },

    when: (condition) => {
      if (!permission.conditions) {
        permission.conditions = [];
      }
      permission.conditions.push(condition);
      return createPermissionBuilder();
    },

    build: () => {
      if (!permission.action || !permission.subject) {
        throw new Error("Action and subject are required");
      }
      return permission as Permission;
    },
  };
};

// 권한 체크 함수
const checkPermission = (permission: Permission, context: any): boolean => {
  // 필드 수준 권한 체크
  if (permission.fields && context.field) {
    // 요청된 필드가 허용된 필드 목록에 있는지 확인
    return permission.fields.includes(context.field);
  }

  // 조건 체크
  if (permission.conditions) {
    return permission.conditions.every((condition) => condition(context));
  }

  return true;
};

// 사용 예시
// 1. 사용자 프로필 필드별 권한
const canUpdateUserProfile = createPermissionBuilder()
  .can("update")
  .on("User")
  .withFields(["name", "email", "profileImage"]) // 이 필드들만 수정 가능
  .build();

// 2. 게시물 필드별 권한
const canUpdatePostFields = createPermissionBuilder()
  .can("update")
  .on("Post")
  .withFields(["title", "content", "tags"]) // 이 필드들만 수정 가능
  .when((context) => context.post.authorId === context.user.id)
  .build();

// 사용 예시
const context = {
  userId: "123",
  user: {
    id: "123",
    role: "author",
  },
  field: "email", // 수정하려는 필드
};

// 권한 체크
console.log(checkPermission(canUpdateUserProfile, context)); // true (email은 허용된 필드)
console.log(
  checkPermission(canUpdateUserProfile, { ...context, field: "password" })
); // false (password는 허용되지 않은 필드)
console.log(
  checkPermission(canUpdatePostFields, { ...context, field: "title" })
); // true (title은 허용된 필드)
