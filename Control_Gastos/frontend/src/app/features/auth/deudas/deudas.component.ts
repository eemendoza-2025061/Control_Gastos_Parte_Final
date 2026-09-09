import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DeudaService } from '../../../core/services/deuda.service';
import { Deuda, PagoDeuda } from '../../../core/models/deuda.model';

@Component({
  selector: 'app-deudas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-container">

      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-brand">
          <img src="img/Logo.png" alt="Lúmina" class="logo-img">
        </div>

        <nav class="sidebar-menu">
          <span class="menu-title">MENÚ</span>
          <ul>
            <li (click)="navigate('dashboard')"><span class="menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </span> Dashboards</li>
            <li (click)="navigate('incomes')"><span class="menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </span> Ingresos</li>
            <li (click)="navigate('egresos')"><span class="menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </span> Egresos</li>
            <li class="active"><span class="menu-icon">
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
            <h1>Deudas</h1>
            <p>Bienvenido, {{ userName }}</p>
          </div>

          <div class="topbar-actions">
            <div class="search-bar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Buscar deudas..." [(ngModel)]="searchTerm">
            </div>
            <button class="icon-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </button>
            <div class="user-profile">
              <span class="user-badge" [class.admin]="isAdmin">{{ isAdmin ? 'Admin' : 'Usuario' }}</span>
            </div>
            <button (click)="logout()" class="btn-logout-top">Salir</button>
          </div>
        </header>

        <!-- KPIs DE DEUDAS -->
        <section class="summary-cards">
          <div class="card stat-card">
            <div class="card-header">
              <div class="icon red">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <h3>Deuda Total Activa</h3>
            </div>
            <h2>{{ money(deudaTotalActiva) }}</h2>
            <p class="trend">Actualizado hoy</p>
          </div>

          <div class="card stat-card">
            <div class="card-header">
              <div class="icon green">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3>Deudas Pagadas</h3>
            </div>
            <h2>{{ money(deudasPagadas) }}</h2>
            <p class="trend">Actualizado hoy</p>
          </div>
        </section>

        <!-- PANELES DE DEUDAS -->
        <section class="panels">

          <!-- REGISTRAR DEUDA -->
          <div class="card form-card">
            <div class="panel-header">
              <div class="icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </div>
              <h3>Registrar Deuda</h3>
            </div>

            <form class="deuda-form" (ngSubmit)="addOrUpdateDeuda()">
              <label for="acreedor">Acreedor</label>
              <input id="acreedor" type="text" name="acreedor" placeholder="Ej: Banco Central" [(ngModel)]="deudaForm.acreedor" required>

              <label for="monto-total">Monto Total ($)</label>
              <input id="monto-total" type="number" min="0" step="0.01" name="montoTotal" placeholder="0.00" [(ngModel)]="deudaForm.monto_total" required>

              <label for="cuota-mensual">Cuota Mensual ($)</label>
              <input id="cuota-mensual" type="number" min="0" step="0.01" name="cuotaMensual" placeholder="0.00" [(ngModel)]="deudaForm.cuota_mensual" required>

              <label for="tasa-interes">Tasa de Interés (%)</label>
              <input id="tasa-interes" type="number" min="0" step="0.01" name="tasaInteres" placeholder="0.00" [(ngModel)]="deudaForm.tasa_interes">

              <label for="estado">Estado</label>
              <select id="estado" name="estado" [(ngModel)]="deudaForm.estado">
                <option value="Activa">Activa</option>
                <option value="Pagada">Pagada</option>
              </select>

              <label for="fecha-inicio">Fecha de Inicio</label>
              <input id="fecha-inicio" type="text" name="fechaInicio" placeholder="DD/MM/AAAA" [(ngModel)]="deudaForm.fecha_inicio" required>

              <label for="vencimiento">Vencimiento</label>
              <input id="vencimiento" type="text" name="vencimiento" placeholder="DD/MM/AAAA" [(ngModel)]="deudaForm.vencimiento" required>

              <button type="submit" class="btn-add btn-add-purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                {{ deudaEditingId ? 'Actualizar Deuda' : 'Agregar Deuda' }}
              </button>
              <button *ngIf="deudaEditingId" type="button" class="btn-cancel" (click)="cancelEditDeuda()">Cancelar edición</button>
            </form>
          </div>

          <!-- HISTORIAL DE DEUDAS -->
          <div class="card history-card">
            <div class="panel-header">
              <h3>Historial de Deudas</h3>
              <span class="count-badge">{{ deudas.length }}</span>
            </div>

            <table class="income-table">
              <thead>
                <tr>
                  <th>Acreedor</th>
                  <th>Monto</th>
                  <th>Cuota</th>
                  <th>Estado</th>
                  <th>Vencimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (deuda of deudasFiltradas; track deuda.id) {
                  <tr>
                    <td>{{ deuda.acreedor }}</td>
                    <td class="amount">{{ money(deuda.monto_total) }}</td>
                    <td>{{ money(deuda.cuota_mensual) }}</td>
                    <td><span class="chip" [class.activa]="estadoBadge(deuda).cls === 'activa'" [class.mora]="estadoBadge(deuda).cls === 'mora'" [class.pagada]="estadoBadge(deuda).cls === 'pagada'">{{ estadoBadge(deuda).text }}</span></td>
                    <td>{{ fromBackendDate(deuda.vencimiento) }}</td>
                    <td class="actions">
                      <button class="action-btn edit" title="Editar" (click)="editDeuda(deuda)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                      </button>
                      <button class="action-btn delete" title="Eliminar" (click)="deleteDeuda(deuda.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="empty-cell">{{ loading ? 'Cargando...' : 'Sin deudas registradas' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

        </section>

        <!-- SEGUNDA SECCIÓN DE DEUDAS -->
        <section class="section-ahorros">

          <div class="section-title">
            <h3>Resumen de Deudas</h3>
          </div>

          <section class="summary-cards">
            <div class="card stat-card">
              <div class="card-header">
                <div class="icon blue">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
<h3>Pagos del Mes</h3>
              </div>
              <h2>{{ money(pagosDelMes) }}</h2>
              <p class="trend">Actualizado hoy</p>
            </div>

            <div class="card stat-card">
              <div class="card-header">
                <div class="icon orange">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <h3>Próximo Vencimiento</h3>
              </div>
              <h2>{{ proximoVencimientoFecha }}</h2>
              <p class="trend">{{ proximoVencimientoAcreedor }}</p>
            </div>
          </section>

          <section class="panels">

            <!-- REGISTRAR PAGO -->
            <div class="card form-card">
              <div class="panel-header">
                <div class="icon green">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                </div>
                <h3>Registrar Pago</h3>
              </div>

              <form class="pago-form" (ngSubmit)="addOrUpdatePago()">
                <label for="deuda-select">Deuda</label>
                <select id="deuda-select" name="deudaSelect" [(ngModel)]="pagoForm.deuda_id" required>
                  <option value="">Seleccionar deuda</option>
                  @for (deuda of deudas; track deuda.id) {
                    <option [value]="deuda.id">{{ deuda.acreedor }}</option>
                  }
                </select>

                <label for="pago-monto">Monto del Pago ($)</label>
                <input id="pago-monto" type="number" min="0" step="0.01" name="pagoMonto" placeholder="0.00" [(ngModel)]="pagoForm.monto" required>

                <label for="pago-fecha">Fecha de Pago</label>
                <input id="pago-fecha" type="text" name="pagoFecha" placeholder="DD/MM/AAAA" [(ngModel)]="pagoForm.fecha" required>

                <label for="pago-nota">Nota</label>
                <input id="pago-nota" type="text" name="pagoNota" placeholder="Ej: Pago cuota 3/12" [(ngModel)]="pagoForm.nota">

                <button type="submit" class="btn-add btn-add-teal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  {{ pagoEditingId ? 'Actualizar Pago' : 'Registrar Pago' }}
                </button>
                <button *ngIf="pagoEditingId" type="button" class="btn-cancel" (click)="cancelEditPago()">Cancelar edición</button>
              </form>
            </div>

            <!-- HISTORIAL DE PAGOS -->
            <div class="card history-card">
              <div class="panel-header">
                <h3>Historial de Pagos</h3>
                <span class="count-badge">{{ pagos.length }}</span>
              </div>

              <table class="income-table">
                <thead>
                  <tr>
                    <th>Deuda</th>
                    <th>Monto Pagado</th>
                    <th>Fecha</th>
                    <th>Nota</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (pago of pagosFiltrados; track pago.id) {
                    <tr>
                      <td>{{ acreedorDeDeuda(pago.deuda_id) }}</td>
                      <td class="amount">{{ money(pago.monto) }}</td>
                      <td>{{ fromBackendDate(pago.fecha) }}</td>
                      <td>{{ pago.nota || '—' }}</td>
                      <td class="actions">
                        <button class="action-btn edit" title="Editar" (click)="editPago(pago)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </button>
                        <button class="action-btn delete" title="Eliminar" (click)="deletePago(pago.id)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5" class="empty-cell">{{ loading ? 'Cargando...' : 'Sin pagos registrados' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

          </section>

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
      --brand-green: #10b981;
      --brand-blue: #3b82f6;
      --brand-amber: #f59e0b;
      --brand-red: #ef4444;
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
      border-left: 4px solid var(--brand-lavender);
      border-radius: 10px 0 0 10px;
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
      color: var(--brand-red);
      font-size: 0.85rem;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.1);
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

    .search-bar {
      background-color: var(--bg-input);
      border-radius: 20px;
      padding: 9px 18px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-muted);
    }

    .search-bar input {
      background: transparent;
      border: none;
      color: var(--text-main);
      outline: none;
      width: 190px;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
    }

    .search-bar input::placeholder {
      color: var(--text-muted);
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

    .user-badge {
      padding: 7px 16px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .btn-logout-top {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.25);
      padding: 9px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
      transition: all 0.2s ease;
    }

    .btn-logout-top:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
    }

    /* SUMMARY CARDS */
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
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
    .icon.green { background-color: rgba(16, 185, 129, 0.15); color: var(--brand-green); }
    .icon.blue { background-color: rgba(59, 130, 246, 0.15); color: #60a5fa; }
    .icon.orange { background-color: rgba(245, 158, 11, 0.15); color: var(--brand-amber); }
    .icon.red { background-color: rgba(239, 68, 68, 0.15); color: #f87171; }

    .stat-card h3 {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .stat-card h2 {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.4rem;
    }

    .trend {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 6px;
    }

    /* SECTION TITLE */
    .section-ahorros {
      margin-top: 2rem;
    }

    .section-title {
      display: flex;
      align-items: center;
      margin-bottom: 1.2rem;
    }

    .section-title h3 {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border-color);
      margin-left: 1rem;
    }

    /* PANELS */
    .panels {
      display: grid;
      grid-template-columns: 1fr 1.6fr;
      gap: 1.2rem;
      align-items: start;
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 1.2rem;
    }

    .panel-header h3 {
      font-size: 1rem;
      font-weight: 600;
      flex: 1;
    }

    .count-badge {
      background-color: var(--bg-input);
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 12px;
    }

    /* FORM */
    .deuda-form,
    .pago-form {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .deuda-form label,
    .pago-form label {
      font-size: 0.78rem;
      color: var(--text-muted);
      font-weight: 500;
      margin-top: 8px;
    }

    .deuda-form input,
    .deuda-form select,
    .pago-form input,
    .pago-form select {
      background-color: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 10px 14px;
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      outline: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
    }

    .deuda-form input::placeholder,
    .pago-form input::placeholder {
      color: #6b7280;
    }

    .deuda-form input:focus,
    .deuda-form select:focus {
      border-color: var(--brand-purple);
    }

    .pago-form input:focus,
    .pago-form select:focus {
      border-color: var(--brand-green);
    }

    .btn-add {
      margin-top: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 10px;
      color: #ffffff;
      font-size: 0.9rem;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-add-purple {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }

    .btn-add-purple:hover {
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.35);
      transform: translateY(-1px);
    }

    .btn-add-teal {
      background: linear-gradient(135deg, #14b8a6, #0d9488);
    }

    .btn-add-teal:hover {
      box-shadow: 0 0 20px rgba(20, 184, 166, 0.35);
      transform: translateY(-1px);
    }

    .btn-cancel {
      margin-top: 10px;
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      background: transparent;
      color: var(--text-muted);
      font-size: 0.82rem;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-cancel:hover {
      color: var(--text-main);
      border-color: var(--text-muted);
    }

    .empty-cell {
      text-align: center;
      color: var(--text-muted);
      padding: 1.5rem !important;
    }

    /* TABLE */
    .history-card {
      overflow: hidden;
      padding: 1.4rem 0.5rem 1.4rem 1.4rem;
    }

    .income-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }

    .income-table th {
      text-align: left;
      color: var(--text-muted);
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 10px 12px;
      border-bottom: 1px solid var(--border-color);
    }

    .income-table td {
      padding: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: var(--text-main);
    }

    .income-table tr:last-child td {
      border-bottom: none;
    }

    .income-table tbody tr:hover {
      background-color: rgba(255, 255, 255, 0.02);
    }

    .income-table .amount {
      font-weight: 600;
    }

    .chip {
      display: inline-block;
      padding: 3px 12px;
      border-radius: 12px;
      font-size: 0.72rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .chip.activa {
      background-color: rgba(239, 68, 68, 0.15);
      color: #f87171;
    }

    .chip.mora {
      background-color: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
    }

    .chip.pagada {
      background-color: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }

    .actions {
      display: flex;
      gap: 6px;
    }

    .action-btn {
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 8px;
      background-color: var(--bg-input);
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .action-btn.edit:hover {
      color: var(--brand-lavender);
      background-color: rgba(139, 92, 246, 0.15);
    }

    .action-btn.delete:hover {
      color: #f87171;
      background-color: rgba(239, 68, 68, 0.15);
    }
  `]
})
export class DeudasComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  deudaService = inject(DeudaService);

  deudas: Deuda[] = [];
  pagos: PagoDeuda[] = [];
  loading = true;
  errorMsg = '';

  searchTerm = '';

  deudaForm = {
    acreedor: '',
    monto_total: null as number | null,
    cuota_mensual: null as number | null,
    tasa_interes: 0,
    estado: 'Activa',
    fecha_inicio: '',
    vencimiento: ''
  };
  deudaEditingId: string | null = null;

  pagoForm = { deuda_id: '', monto: null as number | null, fecha: '', nota: '' };
  pagoEditingId: string | null = null;

  ngOnInit(): void {
    this.deudaForm.fecha_inicio = this.getToday();
    this.deudaForm.vencimiento = this.getToday();
    this.pagoForm.fecha = this.getToday();
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.errorMsg = '';
    this.deudaService.getData().subscribe({
      next: (res) => {
        this.deudas = res.data?.deudas ?? [];
        this.pagos = res.data?.pagos ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.message || 'Error al cargar los datos';
        this.loading = false;
      }
    });
  }

  get deudaTotalActiva(): number {
    return this.deudas.filter(d => d.estado !== 'Pagada').reduce((sum, d) => sum + Number(d.monto_total), 0);
  }

  get deudasPagadas(): number {
    return this.deudas.filter(d => d.estado === 'Pagada').reduce((sum, d) => sum + Number(d.monto_total), 0);
  }

  get pagosDelMes(): number {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${this.pad(now.getMonth() + 1)}`;
    return this.pagos.filter(p => p.fecha.slice(0, 7) === prefix).reduce((sum, p) => sum + Number(p.monto), 0);
  }

  get proximoVencimientoFecha(): string {
    const activas = this.deudas.filter(d => d.estado !== 'Pagada' && d.vencimiento);
    if (activas.length === 0) return '—';
    const proxima = activas.reduce((min, d) => (d.vencimiento < min.vencimiento ? d : min), activas[0]);
    return this.fromBackendDate(proxima.vencimiento);
  }

  get proximoVencimientoAcreedor(): string {
    const activas = this.deudas.filter(d => d.estado !== 'Pagada' && d.vencimiento);
    if (activas.length === 0) return 'Sin deudas activas';
    const proxima = activas.reduce((min, d) => (d.vencimiento < min.vencimiento ? d : min), activas[0]);
    return proxima.acreedor;
  }

  get deudasFiltradas(): Deuda[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.deudas;
    return this.deudas.filter(d =>
      d.acreedor.toLowerCase().includes(term) ||
      d.estado.toLowerCase().includes(term)
    );
  }

  get pagosFiltrados(): PagoDeuda[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.pagos;
    return this.pagos.filter(p => this.acreedorDeDeuda(p.deuda_id).toLowerCase().includes(term));
  }

  estadoBadge(deuda: Deuda): { text: string; cls: string } {
    if (deuda.estado === 'Pagada') {
      return { text: 'Pagada', cls: 'pagada' };
    }
    const hoy = new Date();
    const hoyISO = `${hoy.getFullYear()}-${this.pad(hoy.getMonth() + 1)}-${this.pad(hoy.getDate())}`;
    if (deuda.vencimiento < hoyISO) {
      return { text: 'En mora', cls: 'mora' };
    }
    return { text: 'Activa', cls: 'activa' };
  }

  acreedorDeDeuda(deudaId: string): string {
    const deuda = this.deudas.find(d => d.id === deudaId);
    return deuda?.acreedor || 'Deuda eliminada';
  }

  addOrUpdateDeuda(): void {
    const payload = {
      acreedor: this.deudaForm.acreedor.trim(),
      monto_total: Number(this.deudaForm.monto_total),
      cuota_mensual: Number(this.deudaForm.cuota_mensual),
      tasa_interes: Number(this.deudaForm.tasa_interes) || 0,
      estado: this.deudaForm.estado,
      fecha_inicio: this.toBackendDate(this.deudaForm.fecha_inicio),
      vencimiento: this.toBackendDate(this.deudaForm.vencimiento)
    };
    if (!payload.acreedor || !payload.monto_total || !payload.cuota_mensual || !payload.fecha_inicio || !payload.vencimiento) {
      return;
    }
    if (this.deudaEditingId) {
      this.deudaService.updateDeuda(this.deudaEditingId, payload).subscribe({
        next: () => {
          this.resetDeudaForm();
          this.loadData();
        },
        error: (err) => this.errorMsg = err.message || 'Error al actualizar'
      });
    } else {
      this.deudaService.createDeuda(payload).subscribe({
        next: () => {
          this.resetDeudaForm();
          this.loadData();
        },
        error: (err) => this.errorMsg = err.message || 'Error al registrar'
      });
    }
  }

  editDeuda(deuda: Deuda): void {
    this.deudaEditingId = deuda.id;
    this.deudaForm.acreedor = deuda.acreedor;
    this.deudaForm.monto_total = Number(deuda.monto_total);
    this.deudaForm.cuota_mensual = Number(deuda.cuota_mensual);
    this.deudaForm.tasa_interes = Number(deuda.tasa_interes);
    this.deudaForm.estado = deuda.estado;
    this.deudaForm.fecha_inicio = this.fromBackendDate(deuda.fecha_inicio);
    this.deudaForm.vencimiento = this.fromBackendDate(deuda.vencimiento);
  }

  cancelEditDeuda(): void {
    this.resetDeudaForm();
  }

  private resetDeudaForm(): void {
    this.deudaEditingId = null;
    this.deudaForm = {
      acreedor: '',
      monto_total: null,
      cuota_mensual: null,
      tasa_interes: 0,
      estado: 'Activa',
      fecha_inicio: this.getToday(),
      vencimiento: this.getToday()
    };
  }

  deleteDeuda(id: string): void {
    if (!confirm('¿Eliminar esta deuda? Se eliminarán sus pagos asociados.')) {
      return;
    }
    this.deudaService.deleteDeuda(id).subscribe({
      next: () => this.loadData(),
      error: (err) => this.errorMsg = err.message || 'Error al eliminar'
    });
  }

  addOrUpdatePago(): void {
    const payload = {
      deuda_id: this.pagoForm.deuda_id,
      monto: Number(this.pagoForm.monto),
      fecha: this.toBackendDate(this.pagoForm.fecha),
      nota: this.pagoForm.nota.trim()
    };
    if (!payload.deuda_id || !payload.monto || !payload.fecha) {
      return;
    }
    if (this.pagoEditingId) {
      this.deudaService.updatePago(this.pagoEditingId, payload).subscribe({
        next: () => {
          this.resetPagoForm();
          this.loadData();
        },
        error: (err) => this.errorMsg = err.message || 'Error al actualizar'
      });
    } else {
      this.deudaService.createPago(payload).subscribe({
        next: () => {
          this.resetPagoForm();
          this.loadData();
        },
        error: (err) => this.errorMsg = err.message || 'Error al registrar'
      });
    }
  }

  editPago(pago: PagoDeuda): void {
    this.pagoEditingId = pago.id;
    this.pagoForm.deuda_id = pago.deuda_id;
    this.pagoForm.monto = Number(pago.monto);
    this.pagoForm.fecha = this.fromBackendDate(pago.fecha);
    this.pagoForm.nota = pago.nota || '';
  }

  cancelEditPago(): void {
    this.resetPagoForm();
  }

  private resetPagoForm(): void {
    this.pagoEditingId = null;
    this.pagoForm = { deuda_id: '', monto: null, fecha: this.getToday(), nota: '' };
  }

  deletePago(id: string): void {
    if (!confirm('¿Eliminar este pago?')) {
      return;
    }
    this.deudaService.deletePago(id).subscribe({
      next: () => this.loadData(),
      error: (err) => this.errorMsg = err.message || 'Error al eliminar'
    });
  }

  money(value: number): string {
    const n = Number(value) || 0;
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  toBackendDate(fecha: string): string {
    const m = fecha.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return fecha;
    return `${m[3]}-${m[2]}-${m[1]}`;
  }

  fromBackendDate(fecha: string): string {
    if (!fecha) return '';
    const m = fecha.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return fecha;
    return `${m[3]}/${m[2]}/${m[1]}`;
  }

  private pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

  private getToday(): string {
    const d = new Date();
    return `${this.pad(d.getDate())}/${this.pad(d.getMonth() + 1)}/${d.getFullYear()}`;
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

  logout(): void {
    this.authService.logout();
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}