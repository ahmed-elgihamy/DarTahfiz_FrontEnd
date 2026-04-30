// ============================================================
// utils.js — Helpers + Excel + Layout (Teacher-aware)
// ============================================================

// ── Toast ─────────────────────────────────────────────────────
var Toast = {
  _wrap: null,
  _getWrap: function() {
    if (!this._wrap) {
      this._wrap = document.createElement('div');
      this._wrap.className = 'toast-wrap';
      document.body.appendChild(this._wrap);
    }
    return this._wrap;
  },
  show: function(message, type, duration) {
    if (!type)     type     = 'success';
    if (!duration) duration = type === 'error' ? 4000 : 3000;
    var wrap  = this._getWrap();
    var icons = { success:'fa-circle-check', error:'fa-circle-xmark', info:'fa-circle-info', warning:'fa-triangle-exclamation' };
    var t     = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = '<i class="fa-solid ' + (icons[type] || 'fa-circle-info') + '"></i><span>' + message + '</span>';
    wrap.appendChild(t);
    setTimeout(function() {
      t.style.opacity   = '0';
      t.style.transform = 'translateX(40px)';
      t.style.transition = '.3s';
      setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
    }, duration);
  },
  success: function(msg) { Toast.show(msg, 'success'); },
  error:   function(msg) { Toast.show(msg, 'error'); },
  info:    function(msg) { Toast.show(msg, 'info'); },
  warning: function(msg) { Toast.show(msg, 'warning'); },
};

// ── Loading ───────────────────────────────────────────────────
var Loading = {
  show: function() {
    var el = document.getElementById('loading-bar');
    if (el) el.classList.add('active');
  },
  hide: function() {
    var el = document.getElementById('loading-bar');
    if (el) el.classList.remove('active');
  },
};

// ── Modal ─────────────────────────────────────────────────────
var Modal = {
  open:     function(id) { var el = document.getElementById(id); if (el) el.classList.add('open'); },
  close:    function(id) { var el = document.getElementById(id); if (el) el.classList.remove('open'); },
  closeAll: function()   { document.querySelectorAll('.modal-overlay').forEach(function(m) { m.classList.remove('open'); }); },
};

// ── Drawer ────────────────────────────────────────────────────
var Drawer = {
  open: function(id) {
    var ov = document.getElementById(id + '-overlay');
    var dr = document.getElementById(id + '-drawer');
    if (ov) ov.classList.add('open');
    if (dr) dr.classList.add('open');
    document.body.style.overflow = 'hidden';
  },
  close: function(id) {
    var ov = document.getElementById(id + '-overlay');
    var dr = document.getElementById(id + '-drawer');
    if (ov) ov.classList.remove('open');
    if (dr) dr.classList.remove('open');
    document.body.style.overflow = '';
  },
};

// ── Confirm ───────────────────────────────────────────────────
var Confirm = {
  _cb: null,
  show: function(title, msg, cb, btnLabel, btnClass) {
    if (!btnLabel) btnLabel = 'تأكيد';
    if (!btnClass) btnClass = 'btn-danger';
    document.getElementById('confirm-icon').textContent  = '⚠️';
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-msg').textContent   = msg;
    var btn = document.getElementById('confirm-ok');
    btn.textContent = btnLabel;
    btn.className   = 'btn ' + btnClass;
    this._cb = cb;
    Modal.open('confirm-modal');
  },
  confirm: function() {
    if (this._cb) this._cb();
    Modal.close('confirm-modal');
    this._cb = null;
  },
  cancel: function() {
    Modal.close('confirm-modal');
    this._cb = null;
  },
};

// ── Sidebar ───────────────────────────────────────────────────
var Sidebar = {
  open: function() {
    var sb = document.querySelector('.sidebar');
    var ov = document.querySelector('.sidebar-overlay');
    if (sb) sb.classList.add('open');
    if (ov) ov.classList.add('open');
    document.body.style.overflow = 'hidden';
  },
  close: function() {
    var sb = document.querySelector('.sidebar');
    var ov = document.querySelector('.sidebar-overlay');
    if (sb) sb.classList.remove('open');
    if (ov) ov.classList.remove('open');
    document.body.style.overflow = '';
  },
  toggle: function() {
    var sb = document.querySelector('.sidebar');
    if (sb && sb.classList.contains('open')) this.close();
    else this.open();
  },
};

// ── Format ────────────────────────────────────────────────────
var Format = {
  attColor: function(pct) {
    if (pct >= 80) return 'var(--green)';
    if (pct >= 60) return 'var(--gold2)';
    return 'var(--red)';
  },
  monthName: function(m) {
    var months = ['','يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    return months[m] || '';
  },
  paidBadge: function(paid) {
    if (paid) return '<span class="badge badge-green"><i class="fa-solid fa-circle-check"></i> مدفوع</span>';
    return '<span class="badge badge-gold"><i class="fa-solid fa-clock"></i> متأخر</span>';
  },
  statusBadge: function(status) {
    if (status === 'Present') return '<span class="badge badge-green"><i class="fa-solid fa-circle-check"></i> حاضر</span>';
    if (status === 'Absent')  return '<span class="badge badge-red"><i class="fa-solid fa-circle-xmark"></i> غائب</span>';
    if (status === 'Late')    return '<span class="badge badge-gold"><i class="fa-solid fa-clock"></i> متأخر</span>';
    return status;
  },
  initials: function(name) {
    if (!name) return '؟';
    var parts = name.split(' ').slice(0, 2);
    return parts.map(function(w) { return w[0]; }).join('');
  },
  date: function(d) {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('ar-EG'); } catch(e) { return d; }
  },
  number: function(n) {
    return Number(n || 0).toLocaleString('ar-EG');
  },
};

// ── Excel Export ──────────────────────────────────────────────
var Excel = {
  export: function(data, filename) {
    if (!data || !data.length) { Toast.error('لا توجد بيانات للتصدير'); return; }
    if (!filename) filename = 'export';

    var headers = Object.keys(data[0]);
    var rows    = data.map(function(row) {
      return headers.map(function(h) {
        var val = row[h];
        if (val === null || val === undefined) val = '';
        return '"' + String(val).replace(/"/g, '""') + '"';
      }).join(',');
    });

    var csv  = headers.map(function(h) { return '"' + h + '"'; }).join(',') + '\n' + rows.join('\n');
    var bom  = '\uFEFF';
    var blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href   = url;

    var today = new Date().toLocaleDateString('ar-EG').replace(/\//g, '-');
    a.download = filename + '_' + today + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    Toast.success('تم تصدير ' + data.length + ' سجل بنجاح');
  },

  exportStudents: function(students) {
    var data = students.map(function(s) {
      return {
        'الاسم الأول':    s.firstName,
        'اسم الأب':       s.lastName,
        'الاسم الكامل':   s.fullName,
        'العمر':          s.age,
        'الجنس':          s.gender === 'Male' ? 'ذكر' : 'أنثى',
        'الهاتف':         s.phone,
        'العنوان':        s.address || '',
        'الحلقات':        (s.groups || []).map(function(g) { return g.name; }).join(' - '),
        'نسبة الحضور':    Math.round(s.attendancePercent) + '%',
        'حالة الدفع':     s.currentMonthPaid ? 'دفع' : 'لم يدفع',
        'تاريخ التسجيل':  s.joinDate ? new Date(s.joinDate).toLocaleDateString('ar-EG') : '',
      };
    });
    this.export(data, 'الطلاب');
  },

  exportAttendance: function(records, groupName, date) {
    var data = records.map(function(r) {
      var statusMap = { Present: 'حاضر', Absent: 'غائب', Late: 'متأخر' };
      return {
        'الطالب':  r.studentName,
        'الحلقة':  r.groupName || groupName || '',
        'التاريخ': date || '',
        'الحالة':  statusMap[r.status] || r.status,
        'ملاحظات': r.notes || '',
      };
    });
    this.export(data, 'كشف_الحضور_' + (date || ''));
  },

  exportPayments: function(payments) {
    var data = payments.map(function(p) {
      return {
        'الطالب':       p.studentName,
        'الحلقة':       p.groupName,
        'الشهر':        Format.monthName(p.month),
        'السنة':        p.year,
        'المبلغ':       p.amount,
        'حالة الدفع':   p.isPaid ? 'مدفوع' : 'غير مدفوع',
        'تاريخ الدفع':  p.paidAt ? new Date(p.paidAt).toLocaleDateString('ar-EG') : '',
        'ملاحظات':      p.notes || '',
      };
    });
    this.export(data, 'المدفوعات');
  },

  exportAttendanceReport: function(report) {
    var data = report.map(function(r) {
      return {
        'الطالب':      r.studentName,
        'أيام حضور':   r.presentDays,
        'أيام غياب':   r.absentDays,
        'تأخر':        r.lateDays,
        'إجمالي':      r.totalDays,
        'نسبة الحضور': Math.round(r.percent) + '%',
        'الحالة':      r.percent >= 80 ? 'منتظم' : r.percent >= 60 ? 'متذبذب' : 'خطر',
      };
    });
    this.export(data, 'تقرير_الحضور');
  },
};

// ── Page Init ─────────────────────────────────────────────────
function initPage(requireAdmin) {
  if (!Auth.check()) return;
  if (requireAdmin && !Auth.isAdmin) {
    window.location.href = 'attendance.html';
    return;
  }
  if (!Auth.isAdmin) {
    document.querySelectorAll('.admin-only').forEach(function(el) {
      el.style.display = 'none';
    });
  }
}

// ── Layout ────────────────────────────────────────────────────
function renderLayout(activePage) {
  var isAdmin   = Auth.isAdmin;
  var initials  = Format.initials(Auth.fullName);
  var roleLabel = isAdmin ? 'مدير النظام' : 'معلم';

  // Sidebar nav — Admin sees all, Teacher sees only attendance + groups
  var adminLinks = isAdmin ? (
    '<a class="sb-link ' + (activePage==='dashboard'?'active':'') + '" href="dashboard.html">' +
      '<i class="fa-solid fa-chart-pie"></i><span class="sb-link-label">لوحة التحكم</span></a>'
  ) : '';

  var teachersLink = isAdmin ? (
    '<a class="sb-link ' + (activePage==='teachers'?'active':'') + '" href="teachers.html">' +
      '<i class="fa-solid fa-chalkboard-user"></i><span class="sb-link-label">المعلمون</span></a>'
  ) : '';

  var paymentsLink = isAdmin ? (
    '<a class="sb-link ' + (activePage==='payments'?'active':'') + '" href="payments.html">' +
      '<i class="fa-solid fa-money-bill-wave"></i><span class="sb-link-label">المدفوعات</span></a>'
  ) : '';

  document.getElementById('sidebar-wrap').innerHTML =
    '<div class="sidebar-overlay" onclick="Sidebar.close()"></div>' +
    '<aside class="sidebar">' +
      '<div class="sb-logo">' +
        '<div class="sb-logo-icon"><i class="fa-solid fa-mosque"></i></div>' +
        '<div class="sb-logo-text">' +
          '<div class="sb-logo-name">دار التحفيظ</div>' +
          '<div class="sb-logo-sub">نظام الإدارة</div>' +
        '</div>' +
      '</div>' +
      '<nav class="sb-nav">' +
        (isAdmin ? '<div class="sb-section">الرئيسية</div>' : '') +
        adminLinks +
        '<div class="sb-section">الإدارة</div>' +
        '<a class="sb-link ' + (activePage==='groups'?'active':'') + '" href="groups.html">' +
          '<i class="fa-solid fa-layer-group"></i><span class="sb-link-label">الحلقات</span></a>' +
        (isAdmin ?
          '<a class="sb-link ' + (activePage==='students'?'active':'') + '" href="students.html">' +
            '<i class="fa-solid fa-user-graduate"></i><span class="sb-link-label">الطلاب</span></a>'
          : '') +
        teachersLink +
        '<a class="sb-link ' + (activePage==='attendance'?'active':'') + '" href="attendance.html">' +
          '<i class="fa-solid fa-clipboard-list"></i><span class="sb-link-label">الحضور</span></a>' +
        paymentsLink +
      '</nav>' +
      '<div class="sb-footer">' +
        '<div class="sb-user-av">' + initials + '</div>' +
        '<div class="sb-user-info">' +
          '<div class="sb-user-name">' + Auth.fullName + '</div>' +
          '<div class="sb-user-role">' + roleLabel + '</div>' +
        '</div>' +
        '<button class="sb-logout-btn" onclick="Auth.logout()" title="خروج">' +
          '<i class="fa-solid fa-right-from-bracket"></i>' +
        '</button>' +
      '</div>' +
    '</aside>';

  document.getElementById('topbar-wrap').innerHTML =
    '<header class="topbar">' +
      '<button class="topbar-menu-btn" onclick="Sidebar.toggle()">' +
        '<i class="fa-solid fa-bars"></i>' +
      '</button>' +
      '<div class="topbar-brand">🕌 دار التحفيظ</div>' +
      '<div class="topbar-right">' +
        '<div class="topbar-user">' +
          '<div class="topbar-av">' + initials + '</div>' +
          '<span class="topbar-name hide-mobile">' + Auth.fullName + '</span>' +
        '</div>' +
      '</div>' +
    '</header>';

  document.getElementById('confirm-wrap').innerHTML =
    '<div class="modal-overlay" id="confirm-modal">' +
      '<div class="modal-box">' +
        '<div class="modal-icon" id="confirm-icon">⚠️</div>' +
        '<div class="modal-title" id="confirm-title">تأكيد</div>' +
        '<div class="modal-msg" id="confirm-msg"></div>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-outline" onclick="Confirm.cancel()">' +
            '<i class="fa-solid fa-xmark"></i> إلغاء</button>' +
          '<button class="btn btn-danger" id="confirm-ok" onclick="Confirm.confirm()">تأكيد</button>' +
        '</div>' +
      '</div>' +
    '</div>';
}

// ── Keyboard ──────────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    Modal.closeAll();
    Sidebar.close();
  }
});
