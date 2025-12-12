declare global {
  interface User {
    id: number;
    telegram_id: number;
    first_name: string;
    last_name: string;
    username: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
    role: UserRole;
    linked_parent_tg_id: number;
    linked_child_tg_id: number[];
    bonus_balance: number;
  }
  type UserRole = "child" | "parent";
  type GetProfileResponse = User;

  type PostUserRequest = Pick<User, "telegram_id" | "first_name" | "last_name" | "username" | "phone_number"> & {
    parent_telegram_id?: number;
    is_child: boolean;
  };
  type PostUserResponse = Pick<User, "phone_number">;
}

export {};
