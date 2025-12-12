declare global {
  interface InvitedUser {
    first_name: string | null;
    last_name: string | null;
    tg_id: number;
  }
  type ReferralsResponse = {
    referral_link: string;
    invited_count: number;
    bonus_earned: number;
    invited_users: InvitedUser[];
  };
}

export {};
