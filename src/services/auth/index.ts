export interface AuthUser { id: string; email: string; name?: string }
export interface AuthService {
  getUser(): Promise<AuthUser | null>;
  signIn(email: string, password: string): Promise<AuthUser>;
  signOut(): Promise<void>;
}
// MVP: ยังไม่มีระบบล็อกอินจริง เปลี่ยนตัวนี้เป็นตัวที่ต่อ backend ภายหลัง
export const authService: AuthService = {
  async getUser() { return null; },
  async signIn() { throw new Error('AUTH_NOT_AVAILABLE'); },
  async signOut() {},
};
