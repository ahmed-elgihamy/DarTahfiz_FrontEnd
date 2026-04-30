// ============================================================
// auth.js — Authentication + Role-based Redirect
// ============================================================

const Auth = {

  async login(email, password) {
    const res = await API.auth.login(email, password);

    if (res && res.success) {
      const d = res.data;
      localStorage.setItem('token', d.accessToken);
      localStorage.setItem('userId', d.userId);
      localStorage.setItem('fullName', d.fullName);
      localStorage.setItem('email', d.email);
      localStorage.setItem('role', d.role);
      localStorage.setItem('teacherId', d.teacherId || '');

      // Role-based redirect
      if (d.role === 'Teacher') {
        window.location.href = 'attendance.html';
      } else {
        window.location.href = 'dashboard.html';
      }
      return { success: true };
    }

    return { success: false, message: (res && res.message) || 'بيانات غير صحيحة' };
  },

  logout() {
    localStorage.clear();
    window.location.href = 'index.html';
  },

  check() {
    if (!this.token) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  },

  get token() { return localStorage.getItem('token'); },
  get userId() { return localStorage.getItem('userId'); },
  get fullName() { return localStorage.getItem('fullName'); },
  get email() { return localStorage.getItem('email'); },
  get role() { return localStorage.getItem('role'); },
  get teacherId() { return localStorage.getItem('teacherId'); },
  get isAdmin() { return this.role === 'Admin'; },
  get isTeacher() { return this.role === 'Teacher'; },
};
