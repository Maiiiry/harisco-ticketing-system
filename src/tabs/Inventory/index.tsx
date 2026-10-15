import { Filter, HardDrive, Search, Trash2, UserCheck, UserPlus } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import type { AppUser, Inventory, InventoryStatus } from '../../types';

import { LoadingSpinner } from '../../components/LoadingSpinner';
import { INVENTORY_STATUS_LABELS, INVENTORY_STATUS_OPTIONS } from '../../constants';
import './Inventory.css';

interface InventoryTabProps {
  inventory: Inventory[];
  users: AppUser[];
  currentUser: AppUser;
  onRegisterClick: () => void;
  onAssignOpen: (inventoryId: string) => void;
  onUpdateInventory: (id: string, patch: { status?: InventoryStatus; assigned_user_id?: string | null }) => void;
  onDeleteInventory: (id: string) => void;
  loading?: boolean;
}

const inputFieldStyle: React.CSSProperties = {
  flex: '1',
  width: '100%',
  height: '38px',
  padding: '6px 12px',
  backgroundColor: 'var(--bg-primary)',
  boxSizing: 'border-box',
};

export const InventoryTab: React.FC<InventoryTabProps> = ({
  inventory,
  users,
  currentUser,
  onRegisterClick,
  onAssignOpen,
  onUpdateInventory,
  onDeleteInventory,
  loading = false,
}) => {
  const [subTab, setSubTab] = useState<'stocked' | 'assigned'>('stocked');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  const companies = useMemo(
    () => [...new Set(inventory.map((i) => i.company))].sort(),
    [inventory]
  );
  const entities = useMemo(
    () => [...new Set(inventory.map((i) => i.entity))].sort(),
    [inventory]
  );

  const filteredInventory = useMemo(() => {
    const base = subTab === 'stocked' ? inventory.filter((i) => i.status === 'Stocked') : inventory.filter((i) => i.status === 'Assigned');

    return base
      .filter((item) => {
        const matchesSearch =
          item.device_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sn_mac_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.specs.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCompany = companyFilter === 'all' || item.company === companyFilter;
        const matchesEntity = entityFilter === 'all' || item.entity === entityFilter;
        return matchesSearch && matchesCompany && matchesEntity;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [inventory, subTab, searchQuery, companyFilter, entityFilter]);

  const isIT = currentUser.role === 'it';

  const getStatusBadge = (status: InventoryStatus) => {
    const opt = INVENTORY_STATUS_OPTIONS.find((o) => o.value === status);
    return (
      <span
        className="badge"
        style={{
          backgroundColor: opt?.bg || 'rgba(100, 116, 139, 0.12)',
          color: opt?.color || '#64748b',
        }}
      >
        {INVENTORY_STATUS_LABELS[status] || status}
      </span>
    );
  };

  const getAssignedUserName = (assignedUserId: string | null) => {
    if (!assignedUserId) return null;
    const user = users.find((u) => u.id === assignedUserId);
    return user ? user.name : assignedUserId;
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.275rem',
        }}
      >
        <div>
          <h1 className="page-title">Inventory Tracking</h1>
          <p className="page-subtitle">
            Manage company devices and hardware inventory across stocked and assigned states.
          </p>
        </div>
        {isIT && (
          <button id="btn-register-inventory" className="btn btn-primary" onClick={onRegisterClick}>
            <UserPlus size={16} />
            Register Inventory
          </button>
        )}
      </div>

      {/* Sub-tab bar */}
      <div className="inventory-tab-bar">
        <button
          className={`btn ${subTab === 'stocked' ? 'btn-primary' : 'btn-secondary'} inventory-tab-btn`}
          onClick={() => setSubTab('stocked')}
        >
          <HardDrive size={14} /> Stocked Inventory ({filteredInventory.filter((i) => i.status === 'Stocked').length})
        </button>
        <button
          className={`btn ${subTab === 'assigned' ? 'btn-primary' : 'btn-secondary'} inventory-tab-btn`}
          onClick={() => setSubTab('assigned')}
        >
          <UserCheck size={14} /> Assigned Inventory ({filteredInventory.filter((i) => i.status === 'Assigned').length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="panel" style={{ padding: '0.85rem 1.0625rem', marginBottom: '1.275rem' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 16px',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '220px' }}>
            <input
              id="search-inventory-input"
              type="text"
              placeholder="Search device ID, SN/MAC, company..."
              className="form-input"
              style={{
                width: '100%',
                paddingLeft: '36px',
                height: '38px',
                backgroundColor: 'var(--bg-primary)',
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.6375rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 0 auto' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Company:</span>
            <select
              id="filter-company-select"
              className="form-input"
              style={{ ...inputFieldStyle, height: '38px' }}
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option value="all">All Companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 0 auto' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Entity:</span>
            <select
              id="filter-entity-select"
              className="form-input"
              style={{ ...inputFieldStyle, height: '38px' }}
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
            >
              <option value="all">All Entities</option>
              {entities.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* showing inventory count */}
      <span className="stat-desc" style={{ textAlign: 'right' }}>
        Showing {filteredInventory.length} of {inventory.length} inventory
      </span>

      {/* Inventory List Table */}
      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>SN / MAC</th>
                <th>Company</th>
                <th>Entity</th>
                <th>Specs</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <LoadingSpinner type="table" rows={6} />
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 'bold', width: '9rem' }}>{item.device_id}</td>
                    <td style={{ fontSize: '0.85rem' }}>{item.sn_mac_address}</td>
                    <td style={{ fontSize: '0.85rem' }}>{item.company}</td>
                    <td style={{ fontSize: '0.85rem' }}>{item.entity}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.specs}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {item.assigned_user_id ? (
                        <span style={{ color: 'var(--text-primary)' }}>{getAssignedUserName(item.assigned_user_id)}</span>
                      ) : (
                        <span
                          style={{
                            color: 'var(--text-muted)',
                            fontStyle: 'italic',
                          }}
                        >
                          —
                        </span>
                      )}
                    </td>
                    <td style={{ display: 'flex', flexDirection: 'column', gap: '0.425rem' }}>
                      {item.status === 'Stocked' && isIT && (
                        <button
                          className="btn btn-secondary"
                          style={{ width: '100%', padding: '0.3188rem 0.5313rem', fontSize: '0.75rem' }}
                          onClick={() => onAssignOpen(item.id)}
                        >
                          Assign
                        </button>
                      )}
                      {item.status === 'Assigned' && isIT && (
                        <button
                          className="btn btn-secondary"
                          style={{ width: '100%', padding: '0.3188rem 0.5313rem', fontSize: '0.75rem' }}
                          onClick={() => onUpdateInventory(item.id, { status: 'Stocked', assigned_user_id: null })}
                        >
                          Un-assign
                        </button>
                      )}
                      {isIT && (
                        <button
                          className="btn btn-danger"
                          style={{ width: '100%', padding: '0.3188rem 0.5313rem', fontSize: '0.75rem' }}
                          onClick={() => onDeleteInventory(item.id)}
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
              {filteredInventory.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: 'center',
                      padding: '2.55rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {subTab === 'stocked'
                      ? 'No stocked inventory available.'
                      : 'No assigned inventory.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
