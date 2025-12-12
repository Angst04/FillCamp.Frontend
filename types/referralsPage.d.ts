declare global {
  interface InvitedUser {
    full_name: string;
    tg_id: string;
    date: string;
  }
  type ReferralsResponse = {
    referral_link: string;
    invited_count: number;
    bonus_earned: number;
    invited_users: InvitedUser[];
  };
}

export {};
