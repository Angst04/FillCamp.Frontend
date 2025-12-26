declare global {
  interface LinkedParentInfo {
    telegram_id: number;
    first_name: string | null;
    last_name: string | null;
  }

  interface LinkedChildInfo {
    telegram_id: number;
    first_name: string | null;
    last_name: string | null;
    bonus_balance: number;
  }

  interface User {
    id: number;
    telegram_id: number;
    first_name: string;
    last_name: string;
    username: string;
    phone: string;
    created_at: string;
    updated_at: string;
    role: UserRole;
    linked_parent_info: LinkedParentInfo | null;
    linked_children_info: LinkedChildInfo[];
    bonus_balance: number;
  }
  type UserRole = "child" | "parent";
  type GetProfileResponse = User;

  type PostUserRequest = {
    first_name: string;
    last_name?: string;
    username?: string;
    phone?: string;
    is_child: boolean;
    parent_telegram_id?: number;
  };

  type PostUserResponse = {
    telegram_id: number;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    role: UserRole;
    parent_telegram_id: number | null;
    created_at: string;
    updated_at: string;
  };

  type GetUserResponse = {
    telegram_id: number;
    first_name: string;
    last_name: string;
    username: string;
    role: UserRole;
    parent_telegram_id: number | null;
    created_at: string;
    updated_at: string;
  };
}

export {};
