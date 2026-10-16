import { Search, X } from 'lucide-react';
import React, { useState } from 'react';

import type { AppUser } from '../../types';

import { formatEmployeeCode } from '../../utils';

interface AssignInventoryModalProps {
  inventoryId: string;
  users: AppUser[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inventoryId: string, userId: string) => void;
}

export const AssignInventoryModal: React.FC<AssignInventoryModalProps> = ({
  inventoryId,
  users,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeUsers = users.filter((u) => u.is_active !== 0);

  const filteredUsers = activeUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedUserId) {
      setErrorMsg('Please select a user to assign this inventory to.');
      return;
    }

    const user = activeUsers.find((u) => u.id === selectedUserId);
    if (!user) {
      setErrorMsg('Selected user not found.');
      return;
    }

    setErrorMsg(null);
    onSubmit(inventoryId, selectedUserId);
    setSelectedUserId('');
    setSearchQuery('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          className="panel-header"
          style={{ padding: '1.0625rem 1.275rem', borderBottom: '0.0531rem solid var(--border-color)', margin: 0 }}
        >
          <h2 className="panel-title" style={{ fontSize: '1.15rem' }}>
            Assign Inventory to User
          </h2>
          <button
            id="btn-assign-inventory-modal-close"
            className="btn btn-secondary"
            style={{ width: '1.7rem', height: '1.7rem', padding: 0, borderRadius: '50%' }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.275rem' }}>
            {errorMsg && (
              <div
                style={{
                  backgroundColor: 'rgba(244, 63, 94, 0.15)',
                  border: '0.0531rem solid rgba(244, 63, 94, 0.3)',
                  color: '#f43f5e',
                  padding: '0.5313rem 0.7438rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.85rem',
                  fontSize: '0.85rem',
                }}
              >
                {errorMsg}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="assign-inventory-user-search" className="form-label">
                Search IT User
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
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
                <input
                  id="assign-inventory-user-search"
                  type="text"
                  className="form-input"
                  placeholder="Search by name or employee code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', paddingLeft: '36px', height: '38px', backgroundColor: 'var(--bg-primary)' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="assign-inventory-user-select" className="form-label">
                Select User
              </label>
              <select
                id="assign-inventory-user-select"
                className="form-input"
                style={{ backgroundColor: 'var(--bg-primary)' }}
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="" selected disabled>
                  -- Select a User --
                </option>
                {filteredUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({formatEmployeeCode(u.username || u.id)})
                  </option>
                ))}
              </select>
              {filteredUsers.length === 0 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No matching IT users found.
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              padding: '0.85rem 1.275rem',
              borderTop: '0.0531rem solid var(--border-color)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.6375rem',
            }}
          >
            <button id="btn-assign-inventory-cancel" type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              id="btn-assign-inventory-submit"
              type="submit"
              className="btn btn-primary"
              disabled={!selectedUserId}
            >
              Assign Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
