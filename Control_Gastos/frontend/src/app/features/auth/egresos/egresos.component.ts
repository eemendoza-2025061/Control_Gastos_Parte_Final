import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EgresoService } from '../../../core/services/egreso.service';
import { Egreso, EgresoCategoria } from '../../../core/models/egreso.model';

@Component({
  selector: 'app-egresos',
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
            <li class="active"><span class="menu-icon">
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
            <h1>Egresos</h1>
            <p>Bienvenido, {{ userName }}</p>
          </div>

          <div class="topbar-actions">
            <div class="search-bar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Buscar transacción..." [(ngModel)]="searchTerm">
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

        <!-- KPIs DE EGRESOS -->
        <section class="summary-cards">
          <div class="card stat-card">
            <div class="card-header">
              <div class="icon green">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
              <h3>Egresos Fijos Totales</h3>
            </div>
            <h2>{{ money(fijosTotal) }}</h2>
            <p class="trend">Actualizado hoy</p>
          </div>

          <div class="card stat-card">
            <div class="card-header">
              <div class="icon purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
              <h3>Egresos Variables Totales</h3>
            </div>
            <h2>{{ money(variablesTotal) }}</h2>
            <p class="trend">Actualizado hoy</p>
          </div>
        </section>

        <!-- PANELES DE EGRESOS -->
        <section class="panels">

          <!-- REGISTRAR EGRESO -->
          <div class="card form-card">
            <div class="panel-header">
              <div class="icon red">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </div>
              <h3>Registrar Egreso</h3>
            </div>

            <form class="egreso-form" (ngSubmit)="addOrUpdateEgreso()">
              <label for="descripcion">Descripción</label>
              <input id="descripcion" type="text" name="descripcion" placeholder="Ej: Arriendo mensual" [(ngModel)]="egresoForm.descripcion" required>

              <label for="monto">Monto ($)</label>
              <input id="monto" type="number" min="0" step="0.01" name="monto" placeholder="0.00" [(ngModel)]="egresoForm.monto" required>

              <label for="tipo">Tipo de Egreso</label>
              <select id="tipo" name="tipo" [(ngModel)]="egresoForm.tipo">
                <option value="Fijo">Fijo</option>
                <option value="Variable">Variable</option>
              </select>

              <label for="fecha">Fecha</label>
              <input id="fecha" type="text" name="fecha" placeholder="DD/MM/AAAA" [(ngModel)]="egresoForm.fecha" required>

              <button type="submit" class="btn-add btn-add-red">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                {{ egresoEditingId ? 'Actualizar Egreso' : 'Agregar Egreso' }}
              </button>
              <button *ngIf="egresoEditingId" type="button" class="btn-cancel" (click)="cancelEditEgreso()">Cancelar edición</button>
            </form>
          </div>

          <!-- HISTORIAL DE EGRESOS -->
          <div class="card history-card">
            <div class="panel-header">
              <h3>Historial de Egresos</h3>
              <span class="count-badge">{{ egresos.length }}</span>
            </div>

            <table class="income-table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (egreso of egresosFiltrados; track egreso.id) {
                  <tr>
                    <td>{{ egreso.descripcion }}</td>
                    <td class="amount">{{ money(egreso.monto) }}</td>
                    <td><span class="chip" [class.fijo]="egreso.tipo === 'Fijo'" [class.variable]="egreso.tipo === 'Variable'">{{ egreso.tipo }}</span></td>
                    <td>{{ fromBackendDate(egreso.fecha) }}</td>
                    <td class="actions">
                      <button class="action-btn edit" title="Editar" (click)="editEgreso(egreso)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                      </button>
                      <button class="action-btn delete" title="Eliminar" (click)="deleteEgreso(egreso.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="empty-cell">{{ loading ? 'Cargando...' : 'Sin egresos registrados' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

        </section>

        <!-- SEGUNDA SECCIÓN DE EGRESOS -->
        <section class="section-ahorros">

          <div class="section-title">
            <h3>Resumen del Mes</h3>
          </div>

          <section class="summary-cards">
            <div class="card stat-card">
              <div class="card-header">
                <div class="icon orange">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
                <h3>Total Gastos Mes</h3>
              </div>
              <h2>{{ money(totalGastosMes) }}</h2>
              <p class="trend">Actualizado hoy</p>
            </div>

            <div class="card stat-card">
              <div class="card-header">
                <div class="icon blue">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                </div>
                <h3>Presupuesto Mensual</h3>
              </div>
              <h2>{{ money(presupuestoMensual) }}</h2>
              <p class="trend">{{ pctPresupuesto }}% utilizado</p>
            </div>
          </section>

          <section class="panels">

            <!-- REGISTRAR GASTO POR CATEGORÍA -->
            <div class="card form-card">
              <div class="panel-header">
                <div class="icon orange">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                </div>
                <h3>Registrar Gasto por Categoría</h3>
              </div>

              <form class="gasto-form" (ngSubmit)="addOrUpdateGasto()">
                <label for="gasto-descripcion">Descripción</label>
                <input id="gasto-descripcion" type="text" name="gastoDescripcion" placeholder="Ej: Servicio de internet" [(ngModel)]="gastoForm.descripcion" required>

                <label for="gasto-monto">Monto ($)</label>
                <input id="gasto-monto" type="number" min="0" step="0.01" name="gastoMonto" placeholder="0.00" [(ngModel)]="gastoForm.monto" required>

                <label for="gasto-categoria">Seleccionar categoría</label>
                <select id="gasto-categoria" name="gastoCategoria" [(ngModel)]="gastoForm.categoria" required>
                  <option value="">Seleccionar categoría</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Alimentación">Alimentación</option>
                </select>

                <label for="gasto-fecha">Fecha</label>
                <input id="gasto-fecha" type="text" name="gastoFecha" placeholder="DD/MM/AAAA" [(ngModel)]="gastoForm.fecha" required>

                <button type="submit" class="btn-add btn-add-orange">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  {{ gastoEditingId ? 'Actualizar Gasto' : 'Agregar Gasto' }}
                </button>
                <button *ngIf="gastoEditingId" type="button" class="btn-cancel" (click)="cancelEditGasto()">Cancelar edición</button>
              </form>
            </div>

            <!-- GASTOS POR CATEGORÍA -->
            <div class="card history-card">
              <div class="panel-header">
                <h3>Gastos por Categoría</h3>
                <span class="count-badge">{{ categorias.length }}</span>
              </div>

              <table class="income-table">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Monto</th>
                    <th>Categoría</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (categoria of categoriasFiltradas; track categoria.id) {
                    <tr>
                      <td>{{ categoria.descripcion }}</td>
                      <td class="amount">{{ money(categoria.monto) }}</td>
                      <td><span class="chip" [class.servicios]="categoria.categoria === 'Servicios'" [class.transporte]="categoria.categoria === 'Transporte'" [class.alimentacion]="categoria.categoria === 'Alimentación'">{{ categoria.categoria }}</span></td>
                      <td>{{ fromBackendDate(categoria.fecha) }}</td>
                      <td class="actions">
                        <button class="action-btn edit" title="Editar" (click)="editGasto(categoria)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </button>
                        <button class="action-btn delete" title="Eliminar" (click)="deleteGasto(categoria.id)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5" class="empty-cell">{{ loading ? 'Cargando...' : 'Sin gastos por categoría registrados' }}</td>
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
    .egreso-form,
    .gasto-form {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .egreso-form label,
    .gasto-form label {
      font-size: 0.78rem;
      color: var(--text-muted);
      font-weight: 500;
      margin-top: 8px;
    }

    .egreso-form input,
    .egreso-form select,
    .gasto-form input,
    .gasto-form select {
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

    .egreso-form input::placeholder,
    .gasto-form input::placeholder {
      color: #6b7280;
    }

    .egreso-form input:focus,
    .egreso-form select:focus {
      border-color: var(--brand-red);
    }

    .gasto-form input:focus,
    .gasto-form select:focus {
      border-color: var(--brand-amber);
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

    .btn-add-red {
      background: linear-gradient(135deg, #ef4444, #dc2626);
    }

    .btn-add-red:hover {
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.35);
      transform: translateY(-1px);
    }

    .btn-add-orange {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    .btn-add-orange:hover {
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.35);
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
    }

    .chip.fijo {
      background-color: rgba(16, 185, 129, 0.15);
      color: var(--brand-green);
    }

    .chip.variable {
      background-color: rgba(139, 92, 246, 0.15);
      color: var(--brand-lavender);
    }

    .chip.servicios {
      background-color: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
    }

    .chip.transporte {
      background-color: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
    }

    .chip.alimentacion {
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
export class EgresosComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  egresoService = inject(EgresoService);

  egresos: Egreso[] = [];
  categorias: EgresoCategoria[] = [];
  loading = true;
  errorMsg = '';

  searchTerm = '';

  egresoForm = { descripcion: '', monto: null as number | null, tipo: 'Fijo', fecha: '' };
  egresoEditingId: string | null = null;

  gastoForm = { descripcion: '', monto: null as number | null, categoria: '', fecha: '' };
  gastoEditingId: string | null = null;

  presupuestoMensual = 5000;

  ngOnInit(): void {
    this.egresoForm.fecha = this.getToday();
    this.gastoForm.fecha = this.getToday();
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.errorMsg = '';
    this.egresoService.getData().subscribe({
      next: (res) => {
        this.egresos = res.data?.egresos ?? [];
        this.categorias = res.data?.categorias ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.message || 'Error al cargar los datos';
        this.loading = false;
      }
    });
  }

  get fijosTotal(): number {
    return this.egresos.filter(e => e.tipo === 'Fijo').reduce((sum, e) => sum + Number(e.monto), 0);
  }

  get variablesTotal(): number {
    return this.egresos.filter(e => e.tipo === 'Variable').reduce((sum, e) => sum + Number(e.monto), 0);
  }

  get totalGastosMes(): number {
    return this.fijosTotal + this.variablesTotal;
  }

  get pctPresupuesto(): number {
    if (this.presupuestoMensual <= 0) return 0;
    return Math.round((this.totalGastosMes / this.presupuestoMensual) * 100);
  }

  get egresosFiltrados(): Egreso[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.egresos;
    return this.egresos.filter(e =>
      e.descripcion.toLowerCase().includes(term) || e.tipo.toLowerCase().includes(term)
    );
  }

  get categoriasFiltradas(): EgresoCategoria[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.categorias;
    return this.categorias.filter(c =>
      c.descripcion.toLowerCase().includes(term) || c.categoria.toLowerCase().includes(term)
    );
  }

  addOrUpdateEgreso(): void {
    const payload = {
      descripcion: this.egresoForm.descripcion.trim(),
      monto: Number(this.egresoForm.monto),
      tipo: this.egresoForm.tipo,
      fecha: this.toBackendDate(this.egresoForm.fecha)
    };
    if (!payload.descripcion || !payload.monto || !payload.fecha) {
      return;
    }
    if (this.egresoEditingId) {
      this.egresoService.updateEgreso(this.egresoEditingId, payload).subscribe({
        next: () => {
          this.resetEgresoForm();
          this.loadData();
        },
        error: (err) => this.errorMsg = err.message || 'Error al actualizar'
      });
    } else {
      this.egresoService.createEgreso(payload).subscribe({
        next: () => {
          this.resetEgresoForm();
          this.loadData();
        },
        error: (err) => this.errorMsg = err.message || 'Error al registrar'
      });
    }
  }

  editEgreso(egreso: Egreso): void {
    this.egresoEditingId = egreso.id;
    this.egresoForm.descripcion = egreso.descripcion;
    this.egresoForm.monto = Number(egreso.monto);
    this.egresoForm.tipo = egreso.tipo;
    this.egresoForm.fecha = this.fromBackendDate(egreso.fecha);
  }

  cancelEditEgreso(): void {
    this.resetEgresoForm();
  }

  private resetEgresoForm(): void {
    this.egresoEditingId = null;
    this.egresoForm = { descripcion: '', monto: null, tipo: 'Fijo', fecha: this.getToday() };
  }

  deleteEgreso(id: string): void {
    if (!confirm('¿Eliminar este egreso?')) {
      return;
    }
    this.egresoService.deleteEgreso(id).subscribe({
      next: () => this.loadData(),
      error: (err) => this.errorMsg = err.message || 'Error al eliminar'
    });
  }

  addOrUpdateGasto(): void {
    const payload = {
      descripcion: this.gastoForm.descripcion.trim(),
      monto: Number(this.gastoForm.monto),
      categoria: this.gastoForm.categoria,
      fecha: this.toBackendDate(this.gastoForm.fecha)
    };
    if (!payload.descripcion || !payload.monto || !payload.categoria || !payload.fecha) {
      return;
    }
    if (this.gastoEditingId) {
      this.egresoService.updateCategoria(this.gastoEditingId, payload).subscribe({
        next: () => {
          this.resetGastoForm();
          this.loadData();
        },
        error: (err) => this.errorMsg = err.message || 'Error al actualizar'
      });
    } else {
      this.egresoService.createCategoria(payload).subscribe({
        next: () => {
          this.resetGastoForm();
          this.loadData();
        },
        error: (err) => this.errorMsg = err.message || 'Error al registrar'
      });
    }
  }

  editGasto(categoria: EgresoCategoria): void {
    this.gastoEditingId = categoria.id;
    this.gastoForm.descripcion = categoria.descripcion;
    this.gastoForm.monto = Number(categoria.monto);
    this.gastoForm.categoria = categoria.categoria;
    this.gastoForm.fecha = this.fromBackendDate(categoria.fecha);
  }

  cancelEditGasto(): void {
    this.resetGastoForm();
  }

  private resetGastoForm(): void {
    this.gastoEditingId = null;
    this.gastoForm = { descripcion: '', monto: null, categoria: '', fecha: this.getToday() };
  }

  deleteGasto(id: string): void {
    if (!confirm('¿Eliminar este gasto por categoría?')) {
      return;
    }
    this.egresoService.deleteCategoria(id).subscribe({
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

  private getToday(): string {
    const d = new Date();
    const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
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