import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { ManagedUser, ManagedUserPayload, ManagedUserRole } from '../../../core/models/managed-user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-container">
      <aside class="sidebar">
        <div class="sidebar-brand"><img src="img/Logo.png" alt="Lúmina" class="logo-img"></div>
        <nav class="sidebar-menu">
          <span class="menu-title">MENÚ</span>
          <ul>
            <li (click)="navigate('dashboard')"><span class="menu-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span> Dashboards</li>
            <li (click)="navigate('incomes')"><span class="menu-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span> Ingresos</li>
            <li (click)="navigate('egresos')"><span class="menu-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></span> Egresos</li>
            <li (click)="navigate('deudas')"><span class="menu-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span> Deudas</li>
            <li class="active"><span class="menu-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 0 0 7.75"/></svg></span> Usuarios</li>
          </ul>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">
              <img *ngIf="profilePicture" [src]="profilePicture" [alt]="userName">
              <span *ngIf="!profilePicture">◯</span>
            </div>
            <div class="user-details"><span class="user-name">{{ userName }}</span><span class="user-role">Rol: {{ roleLabel }}</span></div>
          </div>
          <button class="logout-btn" (click)="logout()">Cerrar sesión</button>
        </div>
      </aside>

      <main class="main-content">
        <p *ngIf="errorMsg" class="error-banner">{{ errorMsg }}</p>
        <header class="topbar">
          <div class="topbar-title"><h1>Usuarios</h1><p>Bienvenido, {{ userName }}</p></div>
          <div class="topbar-actions">
            <div class="search-bar"><span>⌕</span><input type="search" name="searchTerm" placeholder="Buscar usuario..." [(ngModel)]="searchTerm" [ngModelOptions]="{standalone: true}"></div>
            <button class="icon-btn" title="Notificaciones">♧</button>
            <span class="user-badge admin">Admin</span>
            <button (click)="logout()" class="btn-logout-top">Salir</button>
          </div>
        </header>

        <section class="summary-cards">
          <div class="card stat-card"><div class="stat-icon purple">♙</div><h3>Total Usuarios</h3><h2>{{ users.length }}</h2><p>Registrados en la plataforma</p></div>
          <div class="card stat-card"><div class="stat-icon green">✓</div><h3>Usuarios Activos</h3><h2>{{ activeUsers }}</h2><p>Conectados en las últimas 48h</p></div>
          <div class="card stat-card"><div class="stat-icon lavender">＋</div><h3>Nuevos este Mes</h3><h2>{{ newUsersThisMonth }}</h2><p>Incremento mensual del {{ monthlyIncrease }}%</p></div>
        </section>

        <section class="panels">
          <div class="card form-card">
            <div class="panel-header"><div class="icon red">＋</div><h3>{{ editingId ? 'Editar Usuario' : 'Registrar Usuario' }}</h3></div>
            <form (ngSubmit)="saveUser()">
              <label for="user-name">Nombre completo</label>
              <input id="user-name" type="text" name="name" placeholder="Ej: Alejandro Torres" [(ngModel)]="form.name" required>
              <label for="user-email">Email</label>
              <input id="user-email" type="email" name="email" placeholder="Ej: alejandro@lumina.com" [(ngModel)]="form.email" required>
              <label for="user-role">Rol de Usuario</label>
              <select id="user-role" name="role" [(ngModel)]="form.role">
                <option value="admin">Admin</option><option value="editor">Editor</option><option value="viewer">Viewer</option>
              </select>
              <label for="user-password">Contraseña {{ editingId ? '(opcional)' : '' }}</label>
              <input id="user-password" type="password" name="password" placeholder="••••••••" [(ngModel)]="form.password" [required]="!editingId">
              <button type="submit" class="btn-add" [disabled]="saving">{{ saving ? 'Guardando...' : (editingId ? 'Guardar cambios' : 'Agregar Usuario') }}</button>
              <button *ngIf="editingId" type="button" class="btn-cancel" (click)="resetForm()">Cancelar edición</button>
            </form>
          </div>

          <div class="card history-card">
            <div class="panel-header"><h3>Lista de Usuarios</h3><span class="count-badge">{{ filteredUsers.length }}</span></div>
            <table>
              <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Fecha Registro</th><th>Acciones</th></tr></thead>
              <tbody>
                @for (user of filteredUsers; track user.id) {
                  <tr>
                    <td><div class="person"><img *ngIf="user.picture" [src]="user.picture" [alt]="user.name"><span>{{ user.name }}</span></div></td>
                    <td>{{ user.email }}</td>
                    <td><span class="badge" [class.admin-role]="user.role === 'admin'" [class.editor-role]="user.role === 'editor'" [class.viewer-role]="user.role === 'viewer'">{{ roleLabelFor(user.role) }}</span></td>
                    <td><span class="status" [class.active-status]="isActive(user)" [class.inactive-status]="!isActive(user)">{{ isActive(user) ? 'Activo' : 'Inactivo' }}</span></td>
                    <td>{{ formatDate(user.created_at) }}</td>
                    <td class="actions"><button class="action-btn" title="Editar" (click)="editUser(user)">✎</button><button class="action-btn delete" title="Eliminar" (click)="removeUser(user)">⌫</button></td>
                  </tr>
                } @empty { <tr><td colspan="6" class="empty">{{ loading ? 'Cargando...' : 'No hay usuarios registrados' }}</td></tr> }
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    :host { --bg-app:#0d0d0f;--bg-sidebar:#141416;--bg-card:#1a1a1e;--bg-input:#2a2c31;--text-main:#fff;--text-muted:#8b8d93;--purple:#8b5cf6;--lavender:#a78bfa;--green:#10b981;--red:#ef4444;--border:#2a2c31;display:block;height:100vh;width:100vw;background:var(--bg-app);color:var(--text-main);font-family:'Inter',sans-serif;overflow:hidden }
    *{margin:0;padding:0;box-sizing:border-box}.app-container{display:flex;height:100vh}.sidebar{width:260px;min-width:260px;background:var(--bg-sidebar);border-right:1px solid var(--border);padding:1.5rem;display:flex;flex-direction:column}.sidebar-brand{display:flex;justify-content:center;margin-bottom:2.5rem}.logo-img{height:60px;width:auto;border-radius:10px;filter:drop-shadow(0 0 12px rgba(139,92,246,.6))}.sidebar-menu{flex:1}.menu-title{color:var(--text-muted);font-size:.7rem;letter-spacing:1.5px;margin:1rem 0 10px;display:block}.sidebar-menu ul{list-style:none}.sidebar-menu li{padding:11px 14px;margin-bottom:4px;border-radius:10px;color:var(--text-muted);cursor:pointer;display:flex;align-items:center;gap:12px;font-size:.9rem}.sidebar-menu li:hover{color:var(--text-main);background:rgba(255,255,255,.05)}.sidebar-menu li.active{background:rgba(139,92,246,.15);color:var(--lavender);border-left:4px solid var(--lavender);border-radius:10px 0 0 10px}.menu-icon{width:20px;height:20px;display:flex;align-items:center;justify-content:center}.menu-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.sidebar-footer{border-top:1px solid var(--border);padding-top:1.2rem}.user-info{display:flex;align-items:center;gap:10px;margin-bottom:1rem}.user-avatar{width:36px;height:36px;border-radius:50%;background:var(--bg-input);display:flex;align-items:center;justify-content:center;color:var(--text-muted);overflow:hidden}.user-avatar img{width:100%;height:100%;object-fit:cover}.user-details{display:flex;flex-direction:column}.user-name{font-size:.85rem;font-weight:600}.user-role{font-size:.72rem;color:var(--text-muted)}.logout-btn{width:100%;padding:10px 14px;border:0;border-radius:10px;background:transparent;color:var(--red);text-align:left;cursor:pointer}.main-content{flex:1;padding:2rem 2.5rem;overflow-y:auto}.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}.topbar-title h1{font-size:1.6rem}.topbar-title p{color:var(--text-muted);font-size:.85rem;margin-top:4px}.topbar-actions{display:flex;align-items:center;gap:12px}.search-bar{background:var(--bg-input);border-radius:20px;padding:9px 18px;display:flex;align-items:center;gap:10px;color:var(--text-muted)}.search-bar input{background:transparent;border:0;color:var(--text-main);outline:0;width:190px;font-family:inherit}.icon-btn{background:var(--bg-card);border:1px solid var(--border);border-radius:50%;width:38px;height:38px;color:var(--text-main)}.user-badge{padding:7px 16px;border-radius:20px;background:rgba(59,130,246,.15);color:#60a5fa;border:1px solid rgba(59,130,246,.3);font-size:.8rem;font-weight:600}.btn-logout-top{background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.25);padding:9px 18px;border-radius:8px;cursor:pointer}.summary-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem;margin-bottom:1.5rem}.card{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:1.4rem}.stat-card{position:relative}.stat-icon{position:absolute;right:1.4rem;top:1.4rem;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.2rem}.stat-icon.purple{background:rgba(139,92,246,.15);color:var(--purple)}.stat-icon.green{background:rgba(16,185,129,.15);color:var(--green)}.stat-icon.lavender{background:rgba(167,139,250,.15);color:var(--lavender)}.stat-card h3{font-size:.85rem;color:var(--text-muted);font-weight:500;margin-bottom:1.2rem}.stat-card h2{font-size:1.8rem;margin-bottom:.4rem}.stat-card p{font-size:.8rem;color:var(--text-muted)}.panels{display:grid;grid-template-columns:1fr 1.8fr;gap:1.2rem;align-items:start}form{display:flex;flex-direction:column;gap:7px}label{font-size:.78rem;color:var(--text-muted);font-weight:500;margin-top:8px}form input,form select{background:var(--bg-input);border:1px solid var(--border);border-radius:10px;padding:10px 14px;color:var(--text-main);font:inherit;font-size:.85rem;outline:0}form input:focus,form select:focus{border-color:var(--red)}.btn-add{margin-top:18px;padding:12px;border:0;border-radius:10px;background:var(--red);color:#fff;font-weight:600;cursor:pointer}.btn-add:disabled{opacity:.6;cursor:not-allowed}.btn-cancel{padding:10px;border:1px solid var(--border);border-radius:10px;background:transparent;color:var(--text-muted);cursor:pointer}.panel-header{display:flex;align-items:center;gap:10px;margin-bottom:1.2rem}.panel-header h3{font-size:1rem;flex:1}.icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center}.icon.red{background:rgba(239,68,68,.15);color:#f87171}.history-card{overflow:auto}.history-card table{width:100%;border-collapse:collapse;font-size:.82rem}.history-card th{text-align:left;color:var(--text-muted);font-size:.7rem;text-transform:uppercase;padding:10px;border-bottom:1px solid var(--border)}.history-card td{padding:12px 10px;border-bottom:1px solid rgba(255,255,255,.04)}.person{display:flex;align-items:center;gap:8px;font-weight:600;white-space:nowrap}.person img{width:30px;height:30px;border-radius:50%;object-fit:cover}.badge,.status{display:inline-block;padding:4px 9px;border-radius:12px;font-size:.7rem;font-weight:600}.admin-role{background:rgba(139,92,246,.15);color:var(--lavender)}.editor-role{background:rgba(59,130,246,.15);color:#60a5fa}.viewer-role{background:rgba(167,139,250,.15);color:var(--lavender)}.active-status{background:rgba(16,185,129,.15);color:#34d399}.inactive-status{background:rgba(107,114,128,.18);color:#9ca3af}.actions{display:flex;justify-content:flex-end;gap:6px}.action-btn{width:30px;height:30px;border:0;border-radius:8px;background:var(--bg-input);color:var(--text-muted);cursor:pointer}.action-btn.delete:hover{color:#f87171}.empty{text-align:center;color:var(--text-muted);padding:2rem!important}.error-banner{background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.35);color:#f87171;padding:10px 16px;border-radius:10px;margin-bottom:1.2rem}
    @media (max-width: 1000px){.panels{grid-template-columns:1fr}.summary-cards{grid-template-columns:1fr}.topbar{align-items:flex-start;gap:1rem;flex-direction:column}}
  `]
})
export class UsersComponent implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  changeDetector = inject(ChangeDetectorRef);

  users: ManagedUser[] = [];
  searchTerm = '';
  loading = true;
  saving = false;
  errorMsg = '';
  editingId: string | null = null;
  form: { name: string; email: string; role: ManagedUserRole; password: string } = { name: '', email: '', role: 'viewer', password: '' };

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (res) => { this.users = (res.data ?? []).map(user => ({ ...user, id: String(user.id) })); this.loading = false; this.changeDetector.detectChanges(); },
      error: (err: Error) => { this.errorMsg = err.message; this.loading = false; }
    });
  }

  get filteredUsers(): ManagedUser[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.users.filter(user => !term || `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(term));
  }

  get activeUsers(): number { return this.users.filter(user => this.isActive(user)).length; }
  get newUsersThisMonth(): number {
    const now = new Date();
    return this.users.filter(user => { const date = new Date(user.created_at || ''); return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth(); }).length;
  }
  get monthlyIncrease(): number { return this.users.length ? Math.round((this.newUsersThisMonth / this.users.length) * 100) : 0; }

  isActive(user: ManagedUser): boolean { return !!user.last_login_at && Date.now() - new Date(user.last_login_at).getTime() <= 48 * 60 * 60 * 1000; }
  roleLabelFor(role: ManagedUserRole): string { return role.charAt(0).toUpperCase() + role.slice(1); }
  formatDate(value?: string): string { return value ? new Date(value).toLocaleDateString('es-GT') : '—'; }

  saveUser(): void {
    if (!this.form.name.trim() || !this.form.email.trim() || (!this.editingId && !this.form.password.trim())) return;
    this.saving = true;
    const payload: ManagedUserPayload = { name: this.form.name, email: this.form.email, role: this.form.role, password: this.form.password || undefined };
    const request = this.editingId ? this.userService.updateUser(this.editingId, payload) : this.userService.createUser(payload);
    request.subscribe({ next: () => { this.resetForm(); this.loadUsers(); }, error: (err: Error) => { this.errorMsg = err.message; this.saving = false; } });
  }

  editUser(user: ManagedUser): void { this.editingId = user.id; this.form = { name: user.name, email: user.email, role: user.role, password: '' }; }
  removeUser(user: ManagedUser): void { if (!confirm(`¿Eliminar a ${user.name}?`)) return; this.userService.deleteUser(user.id).subscribe({ next: () => this.loadUsers(), error: (err: Error) => this.errorMsg = err.message }); }
  resetForm(): void { this.editingId = null; this.saving = false; this.form = { name: '', email: '', role: 'viewer', password: '' }; }
  navigate(route: string): void { this.router.navigate([route]); }
  logout(): void { this.authService.logout(); }
  get isAdmin(): boolean { return this.authService.currentUserSubject.value?.role === 'admin'; }
  get userName(): string { return this.authService.currentUserSubject.value?.name || 'Usuario'; }
  get profilePicture(): string | null { return this.authService.currentUserSubject.value?.picture || null; }
  get roleLabel(): string { return this.isAdmin ? 'Administrador' : 'Usuario'; }
}
