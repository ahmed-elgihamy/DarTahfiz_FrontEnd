// ============================================================
// api.js — Final Clean Version
// No arrow functions, no optional chaining, no spread
// Works on all browsers + mobile
// ============================================================

var API_URL = 'https://insightful-reprieve-production-39ee.up.railway.app/api';

// ── HTTP Helper ───────────────────────────────────────────────

async function request(method, endpoint, body) {
    var token = localStorage.getItem('token');
    var headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;

    var options = { method: method, headers: headers };
    if (body !== undefined && body !== null) {
        options.body = JSON.stringify(body);
    }

    try {
        var res = await fetch(API_URL + endpoint, options);

        if (res.status === 401) {
            localStorage.clear();
            window.location.href = 'index.html';
            return null;
        }

        var data = await res.json();
        return data;

    } catch (err) {
        console.error('API Error:', err);
        if (typeof Toast !== 'undefined') Toast.error('حدث خطأ في الاتصال بالسيرفر');
        return null;
    }
}
async function toUtcDate(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr + 'T00:00:00Z').toISOString();
}
function cleanScore(v) {
    if (v === null || v === undefined) return 0;
    var n = Number(v);
    if (isNaN(n)) return 0;
    return n;
}
// ── API ───────────────────────────────────────────────────────
var API = {

    // ── Auth ──────────────────────────────────────────────────
    auth: {
        login: function (email, password) {
            return request('POST', '/auth/login', { email: email, password: password });
        },
        me: function () {
            return request('GET', '/auth/me');
        },
    },

    evaluations: {
        get: function (groupId, date) {
            return request('GET', '/evaluations?groupId=' + groupId + '&date=' + date);
        },
        save: function (body) {
            return request('POST', '/evaluations', body);
        },
        getByStudent: function (id) {
            return request('GET', '/evaluations/student/' + id);
        },
    },

    // ── Dashboard ─────────────────────────────────────────────
    dashboard: {
        admin: function () {
            return request('GET', '/dashboard/admin');
        },
    },

    // ── Groups ────────────────────────────────────────────────
    groups: {
        getAll: function () {
            return request('GET', '/groups');
        },
        getById: function (id) {
            return request('GET', '/groups/' + id);
        },
        create: function (body) {
            return request('POST', '/groups', body);
        },
        update: function (id, body) {
            return request('PUT', '/groups/' + id, body);
        },
        delete: function (id) {
            return request('DELETE', '/groups/' + id);
        },
    },

    // ── Students ──────────────────────────────────────────────
    students: {
        getAll: function (groupId) {
            var url = '/students';
            if (groupId) url = url + '?groupId=' + groupId;
            return request('GET', url);
        },
        getById: function (id) {
            return request('GET', '/students/' + id);
        },
        create: function (body) {
            return request('POST', '/students', body);
        },
        update: function (id, body) {
            return request('PUT', '/students/' + id, body);
        },
        delete: function (id) {
            return request('DELETE', '/students/' + id);
        },
        addToGroup: function (id, gid) {
            return request('POST', '/students/' + id + '/groups', gid);
        },
        removeFromGroup: function (id, gid) {
            return request('DELETE', '/students/' + id + '/groups/' + gid);
        },
    },

    // ── Teachers ──────────────────────────────────────────────
    teachers: {
        getAll: function () {
            return request('GET', '/teachers');
        },
        getById: function (id) {
            return request('GET', '/teachers/' + id);
        },
        create: function (body) {
            return request('POST', '/teachers', body);
        },
        update: function (id, body) {
            return request('PUT', '/teachers/' + id, body);
        },
        delete: function (id) {
            return request('DELETE', '/teachers/' + id);
        },
        toggleSalary: function (id) {
            return request('POST', '/teachers/' + id + '/salary/toggle', {});
        },
    },

    // ── Attendance ────────────────────────────────────────────
    attendance: {

        get: function (groupId, date) {
            return request(
                'GET',
                '/attendance?groupId=' + groupId + '&date=' + encodeURIComponent(date)
            );
        },
        bulk: function (body) {
            return request('POST', '/attendance/bulk', body);
        },
        report: function (groupId, from, to) {
            var url = '/attendance/report?from=' + from + '&to=' + to;
            if (groupId) url = url + '&groupId=' + groupId;
            return request('GET', url);
        },
    },

    // ── Payments ──────────────────────────────────────────────
    payments: {
        getAll: function (params) {
            var url = '/payments';
            var parts = [];
            if (params) {
                if (params.month) parts.push('month=' + params.month);
                if (params.year) parts.push('year=' + params.year);
                if (params.groupId) parts.push('groupId=' + params.groupId);
                if (params.isPaid !== undefined && params.isPaid !== null) {
                    parts.push('isPaid=' + params.isPaid);
                }
            }
            if (parts.length > 0) url = url + '?' + parts.join('&');
            return request('GET', url);
        },
        create: function (body) {
            return request('POST', '/payments', body);
        },
        markPaid: function (body) {
            return request('POST', '/payments/mark-paid', body);
        },
        summary: function (month, year) {
            return request('GET', '/payments/summary?month=' + month + '&year=' + year);
        },
        generate: function (month, year) {
            return request('POST', '/payments/generate/' + month + '/' + year, {});
        },
        update: function (id, body) {
            return request('PUT', '/payments/' + id, body);
        },
    },

    // ── Sessions ──────────────────────────────────────────────
    sessions: {
        create: function (body) {
            return request('POST', '/sessions', body);
        },
        verify: function (code) {
            return request('POST', '/sessions/verify', { code: code });
        },
    },
};
