import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { EgresoService } from '../../../core/services/egreso.service';
import { DeudaService } from '../../../core/services/deuda.service';
import { Egreso } from '../../../core/models/egreso.model';
import { Deuda } from '../../../core/models/deuda.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-container">

      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-brand">
          <img src="img/Logo.png" alt="Lúmina" class="logo-img">
        </div>

        <nav class="sidebar-menu">
          <span class="menu-title">MENU</span>
          <ul>
            <li (click)="navigate('dashboard')" class="active"><span class="menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </span> Dashboard</li>
            <li (click)="navigate('incomes')"><span class="menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </span> Ingresos</li>
            <li (click)="navigate('egresos')"><span class="menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </span> Egresos</li>
            <li (click)="navigate('deudas')"><span class="menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </span> Deudas</li>
            <li *ngIf="isAdmin"><span class="menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </span> Usuarios</li>
          </ul>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div class="user-details">
              <span class="user-name">{{ userName }}</span>
              <span class="user-role">Rol: {{ roleLabel }}</span>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <!-- CONTENIDO PRINCIPAL -->
      <main class="main-content">

        <p *ngIf="errorMsg" class="error-banner">{{ errorMsg }}</p>

        <!-- HEADER -->
        <header class="topbar">
          <div class="topbar-title">
            <h1>Dashboard</h1>
            <p>Bienvenido, {{ userName }}</p>
          </div>

          <div class="topbar-actions">
            <button class="icon-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </button>
            <div class="user-chip">
              <span class="chip-name">{{ userName }}</span>
            </div>
          </div>
        </header>

        <!-- TARJETAS DE MÉTRICAS -->
        <section class="summary-cards">
          <div class="card stat-card">
            <div class="card-header">
              <div class="icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <h3>Total de ingresos</h3>
            </div>
            <h2>{{ money(totalIngresos) }}</h2>
            <p class="trend"><span>0%</span> from last week</p>
          </div>

          <div class="card stat-card">
            <div class="card-header">
              <div class="icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
              <h3>Total de egresos</h3>
            </div>
            <h2>{{ money(totalEgresos) }}</h2>
            <p class="trend"><span>{{ nroEgresos }}</span> egresos registrados</p>
          </div>

          <div class="card stat-card">
            <div class="card-header">
              <div class="icon orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <h3>Total deuda</h3>
            </div>
            <h2>{{ money(totalDeuda) }}</h2>
            <p class="trend"><span>{{ nroDeudasActivas }}</span> deudas activas</p>
          </div>
        </section>

        <!-- GRÁFICOS -->
        <section class="charts-section">
          <div class="card chart-large">
            <h3>Gastos de la semana</h3>
            <div class="bar-chart">
              <div class="bar-group" *ngFor="let day of weekDays">
                <div class="bar-wrapper">
                  <div class="bar" [style.height.%]="day.height" [style.background]="day.color" [title]="day.label + ': ' + money(day.value)"></div>
                </div>
                <span class="bar-label">{{ day.label }}</span>
              </div>
            </div>
          </div>

          <div class="card chart-small">
            <h3>Efficiency</h3>
            <div class="efficiency-chart">
              <div class="donut">
                <svg viewBox="0 0 120 120" class="donut-svg">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#2a2c31" stroke-width="10"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#8b5cf6" stroke-width="10"
                    stroke-dasharray="226.2" [attr.stroke-dashoffset]="donutOffset"
                    stroke-linecap="round" transform="rotate(-90 60 60)"/>
                </svg>
                <div class="donut-text">
                  <span class="donut-value">{{ donutValue }}%</span>
                </div>
              </div>
              <span class="efficiency-label">presupuesto mensual</span>
              <div class="efficiency-meta">
                <span class="meta-dot"></span>
                <span class="meta-text">Meta mensual</span>
              </div>
            </div>
          </div>
        </section>

        <!-- META DE AHORROS -->
        <section class="savings-section">
          <div class="card savings-card">
            <div class="savings-header">
              <h3>Meta de ahorros</h3>
              <span class="savings-percent">{{ savingsPercent }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="savingsPercent"></div>
            </div>
            <p class="savings-desc">{{ money(ahorrosTotal) }} ahorrados de una meta de {{ money(ahorrosMeta) }}</p>
          </div>
        </section>

      </main>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :host {
      --bg-app: #0d0d0f;
      --bg-sidebar: #141416;
      --bg-card: #1a1a1e;
      --bg-input: #2a2c31;
      --text-main: #ffffff;
      --text-muted: #8b8d93;
      --brand-purple: #8b5cf6;
      --brand-lavender: #a78bfa;
      --brand-orange: #d97706;
      --border-color: #2a2c31;

      display: block;
      height: 100vh;
      width: 100vw;
      background-color: var(--bg-app);
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
      overflow: hidden;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    .app-container {
      display: flex;
      height: 100vh;
    }

    /* SIDEBAR */
    .sidebar {
      width: 260px;
      min-width: 260px;
      background-color: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2.5rem;
    }

    .logo-img {
      height: 60px;
      width: auto;
      border-radius: 10px;
      filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.6));
    }

    .menu-title {
      color: var(--text-muted);
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 10px;
      display: block;
      margin-top: 1rem;
    }

    .sidebar-menu { flex: 1; }
    .sidebar-menu ul { list-style: none; }

    .sidebar-menu li {
      padding: 11px 14px;
      margin-bottom: 4px;
      border-radius: 10px;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.2s ease;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .menu-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
    }

    .sidebar-menu li:hover {
      color: var(--text-main);
      background-color: rgba(255, 255, 255, 0.05);
    }

    .sidebar-menu li.active {
      background-color: rgba(139, 92, 246, 0.15);
      color: var(--brand-lavender);
    }

    /* SIDEBAR FOOTER */
    .sidebar-footer {
      border-top: 1px solid var(--border-color);
      padding-top: 1.2rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 1rem;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--bg-input);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .user-role {
      font-size: 0.72rem;
      color: var(--text-muted);
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 10px;
      border: none;
      background: transparent;
      color: var(--brand-orange);
      font-size: 0.85rem;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .logout-btn:hover {
      background: rgba(217, 119, 6, 0.1);
    }

    /* MAIN CONTENT */
    .main-content {
      flex: 1;
      padding: 2rem 2.5rem;
      overflow-y: auto;
    }

    /* TOPBAR */
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .topbar-title h1 {
      font-size: 1.6rem;
      font-weight: 700;
    }

    .topbar-title p {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin-top: 4px;
    }

    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .icon-btn {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 50%;
      width: 38px;
      height: 38px;
      color: var(--text-main);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-chip {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 6px 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1.2;
    }

    .chip-name {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .chip-role {
      font-size: 0.65rem;
      color: var(--text-muted);
    }

    /* SUMMARY CARDS */
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.2rem;
      margin-bottom: 1.5rem;
    }

    .error-banner {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #f87171;
      padding: 10px 16px;
      border-radius: 10px;
      font-size: 0.85rem;
      margin-bottom: 1.2rem;
    }

    .card {
      background-color: var(--bg-card);
      border-radius: 14px;
      padding: 1.4rem;
      border: 1px solid var(--border-color);
    }

    .stat-card .card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 1.2rem;
    }

    .icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon.purple { background-color: rgba(139, 92, 246, 0.15); color: var(--brand-lavender); }
    .icon.orange { background-color: rgba(217, 119, 6, 0.15); color: var(--brand-orange); }

    .stat-card h3 {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .stat-card h2 {
      font-size: 1.8rem;
      margin-bottom: 0.4rem;
      font-weight: 700;
    }

    .trend {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .trend span {
      font-weight: 600;
    }

    /* CHARTS SECTION */
    .charts-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.2rem;
      margin-bottom: 1.5rem;
    }

    .chart-large h3, .chart-small h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    /* BAR CHART */
    .bar-chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 180px;
      padding: 0 10px;
    }

    .bar-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .bar-wrapper {
      height: 150px;
      width: 32px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .bar {
      width: 100%;
      border-radius: 6px 6px 4px 4px;
      transition: height 0.3s ease;
      min-height: 8px;
    }

    .bar-label {
      font-size: 0.72rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* EFFICIENCY CHART */
    .efficiency-chart {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 0;
    }

    .donut {
      position: relative;
      width: 120px;
      height: 120px;
    }

    .donut-svg {
      width: 100%;
      height: 100%;
    }

    .donut-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .donut-value {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .efficiency-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 6px;
    }

    .efficiency-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 14px;
    }

    .meta-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--brand-purple);
    }

    .meta-text {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* SAVINGS SECTION */
    .savings-section {
      margin-bottom: 1rem;
    }

    .savings-card {
      padding: 1.4rem 1.6rem;
    }

    .savings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.8rem;
    }

    .savings-header h3 {
      font-size: 1rem;
      font-weight: 600;
    }

    .savings-percent {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--brand-lavender);
    }

    .progress-bar {
      width: 100%;
      height: 10px;
      background-color: var(--bg-input);
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 0.6rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--brand-purple), var(--brand-lavender));
      border-radius: 10px;
      transition: width 0.5s ease;
    }

    .savings-desc {
      font-size: 0.82rem;
      color: var(--text-muted);
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  egresoService = inject(EgresoService);
  deudaService = inject(DeudaService);

  egresos: Egreso[] = [];
  deudas: Deuda[] = [];
  loading = true;
  errorMsg = '';

  presupuestoMensual = 5000;

  weekDays = [
    { label: 'Lun', value: 0, height: 0, color: '#8b5cf6' },
    { label: 'Mar', value: 0, height: 0, color: '#8b5cf6' },
    { label: 'Mié', value: 0, height: 0, color: '#8b5cf6' },
    { label: 'Jue', value: 0, height: 0, color: '#8b5cf6' },
    { label: 'Vie', value: 0, height: 0, color: '#8b5cf6' },
    { label: 'Sáb', value: 0, height: 0, color: '#a78bfa' },
    { label: 'Dom', value: 0, height: 0, color: '#a78bfa' }
  ];

  ngOnInit(): void {
    forkJoin({
      egresos: this.egresoService.getData(),
      deudas: this.deudaService.getData()
    }).subscribe({
      next: (res) => {
        this.egresos = res.egresos.data?.egresos ?? [];
        this.deudas = res.deudas.data?.deudas ?? [];
        this.buildWeekChart();
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.message || 'Error al cargar el dashboard';
        this.loading = false;
      }
    });
  }

  private buildWeekChart(): void {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Dom, 1 = Lun ...
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - ((currentDay + 6) % 7));

    const totals = [0, 0, 0, 0, 0, 0, 0];

    for (const e of this.egresos) {
      const d = new Date(e.fecha + 'T00:00:00');
      if (isNaN(d.getTime())) continue;
      const diffDays = Math.round((d.getTime() - weekStart.getTime()) / 86400000);
      if (diffDays >= 0 && diffDays < 7) {
        totals[diffDays] += Number(e.monto);
      }
    }

    const max = Math.max(...totals, 1);
    this.weekDays = this.weekDays.map((day, i) => ({
      ...day,
      value: totals[i],
      height: Math.max(8, Math.round((totals[i] / max) * 100))
    }));
  }

  get isAdmin(): boolean {
    return this.authService.currentUserSubject.value?.role === 'admin';
  }

  get userName(): string {
    return this.authService.currentUserSubject.value?.name || 'Usuario';
  }

  get roleLabel(): string {
    return this.isAdmin ? 'Administrador' : 'Usuario';
  }

  get totalIngresos(): number {
    try {
      const raw = localStorage.getItem('lumina_ingresos');
      if (!raw) {
        return 0;
      }
      const incomes: { monto: number }[] = JSON.parse(raw);
      return incomes.reduce((sum, i) => sum + Number(i.monto), 0);
    } catch {
      return 0;
    }
  }

  get totalEgresos(): number {
    return this.egresos.reduce((sum, e) => sum + Number(e.monto), 0);
  }

  get nroEgresos(): number {
    return this.egresos.length;
  }

  get totalDeuda(): number {
    return this.deudas.filter(d => d.estado !== 'Pagada').reduce((sum, d) => sum + Number(d.monto_total), 0);
  }

  get nroDeudasActivas(): number {
    return this.deudas.filter(d => d.estado !== 'Pagada').length;
  }

  get donutValue(): number {
    if (this.presupuestoMensual <= 0) return 0;
    return Math.min(100, Math.round((this.totalEgresos / this.presupuestoMensual) * 100));
  }

  get donutOffset(): number {
    const circumference = 226.2;
    return circumference - (circumference * this.donutValue) / 100;
  }

  get ahorrosTotal(): number {
    try {
      const raw = localStorage.getItem('lumina_ahorros');
      if (!raw) {
        return 0;
      }
      const ahorros: { monto: number }[] = JSON.parse(raw);
      return ahorros.reduce((sum, a) => sum + Number(a.monto), 0);
    } catch {
      return 0;
    }
  }

  get ahorrosMeta(): number {
    return 10000;
  }

  get savingsPercent(): number {
    if (this.ahorrosMeta <= 0) {
      return 0;
    }
    return Math.min(100, Math.round((this.ahorrosTotal / this.ahorrosMeta) * 100));
  }

  money(value: number): string {
    return 'Q' + (Number(value) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  logout(): void {
    this.authService.logout();
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
