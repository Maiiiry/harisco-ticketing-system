import { X } from 'lucide-react';
import React, { useState } from 'react';

import type { AppUser, InventoryCategory, InventoryEntity } from '../../types';

import { INVENTORY_CATEGORY_OPTIONS, INVENTORY_ENTITY_OPTIONS } from '../../constants';

interface RegisterInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AppUser[];
  onSubmit: (data: {
    company: string;
    entity: InventoryEntity;
    category: InventoryCategory;
    details: string;
    device_id: string;
    sn_mac_address: string;
    assigned_user_id: string | null;
    attachment: string | null;
  }) => void;
}

export const RegisterInventoryModal: React.FC<RegisterInventoryModalProps> = ({
  isOpen,
  onClose,
  users,
  onSubmit,
}) => {
  const [company, setCompany] = useState('');
  const [entity, setEntity] = useState<InventoryEntity | null>(null);
  const [category, setCategory] = useState<InventoryCategory | null>(null);
  const [details, setDetails] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [snMacAddress, setSnMacAddress] = useState('');
  const [assignedUserId, setAssignedUserId] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<string | null>(null);
  const [attachmentFileName, setAttachmentFileName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeUsers = users.filter((u) => u.is_active !== 0);

  if (!isOpen) return null;

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`Attachment size must be less than ${maxSizeMB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment(reader.result as string);
      setAttachmentFileName(file.name);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const finalCompany = company.trim();
    const finalDetails = details.trim();
    const finalDeviceId = deviceId.trim();
    const finalSnMacAddress = snMacAddress.trim();

    if (!category) {
      setErrorMsg('Category is required.');
      return;
    }
    if (!entity) {
      setErrorMsg('Entity is required.');
      return;
    }
    if (!finalCompany) {
      setErrorMsg('Company is required.');
      return;
    }
    if (!finalDetails) {
      setErrorMsg('Details is required.');
      return;
    }
    if (!finalDeviceId) {
      setErrorMsg('Device ID is required.');
      return;
    }
    if (!finalSnMacAddress) {
      setErrorMsg('SN/MAC Address is required.');
      return;
    }

    setErrorMsg(null);
    onSubmit({
      company: finalCompany,
      entity,
      category,
      details: finalDetails,
      device_id: finalDeviceId,
      sn_mac_address: finalSnMacAddress,
      assigned_user_id: assignedUserId,
      attachment,
    });

    setCompany('');
    setEntity(null);
    setCategory(null);
    setDetails('');
    setDeviceId('');
    setSnMacAddress('');
    setAssignedUserId(null);
    setAttachment(null);
    setAttachmentFileName(null);
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
            Register New Inventory
          </h2>
          <button
            id="btn-register-inventory-modal-close"
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
              <label htmlFor="inventory-category-select" className="form-label">
                Category
              </label>
              <select
                id="inventory-category-select"
                className="form-input"
                style={{ backgroundColor: 'var(--bg-primary)' }}
                value={category ?? ''}
                onChange={(e) => setCategory(e.target.value as InventoryCategory)}
                required
              >
                <option value="" selected disabled>
                  -- Select Category --
                </option>
                {INVENTORY_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="inventory-entity-select" className="form-label">
                Entity
              </label>
              <select
                id="inventory-entity-select"
                className="form-input"
                style={{ backgroundColor: 'var(--bg-primary)' }}
                value={entity ?? ''}
                onChange={(e) => setEntity(e.target.value as InventoryEntity)}
                required
              >
                <option value="" selected disabled>
                  -- Select Entity --
                </option>
                {INVENTORY_ENTITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="inventory-company-input" className="form-label">
                Company
              </label>
              <input
                id="inventory-company-input"
                type="text"
                className="form-input"
                placeholder="e.g. Headquarters Branch"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="inventory-assignee-select" className="form-label">
                Assignee (Optional)
              </label>
              <select
                id="inventory-assignee-select"
                className="form-input"
                style={{ backgroundColor: 'var(--bg-primary)' }}
                value={assignedUserId ?? ''}
                onChange={(e) => setAssignedUserId(e.target.value || null)}
              >
                <option value="">
                  -- Select User (Optional) --
                </option>
                {activeUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({formatEmployeeCode(u.username || u.id)})
                  </option>
                ))}
              </select>
              {activeUsers.length === 0 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No active users available.
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="inventory-details-input" className="form-label">
                Details
              </label>
              <textarea
                id="inventory-details-input"
                className="form-input"
                style={{ minHeight: '5.3125rem', resize: 'vertical' }}
                placeholder="e.g. Dell Latitude 5430, 16GB RAM, 512GB SSD, Windows 11, good condition"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="inventory-device-id-input" className="form-label">
                  Device ID
                </label>
                <input
                  id="inventory-device-id-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g. HC-INV-00123"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="inventory-sn-mac-input" className="form-label">
                  SN / MAC Address
                </label>
                <input
                  id="inventory-sn-mac-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g. ABC123456789 or AA:BB:CC:DD:EE:FF"
                  value={snMacAddress}
                  onChange={(e) => setSnMacAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="inventory-attachment-input" className="form-label">
                Attachment (Optional)
              </label>
              <input
                id="inventory-attachment-input"
                type="file"
                className="form-input"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                onChange={handleAttachmentChange}
              />
              {attachmentFileName && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.425rem', display: 'block' }}>
                  {attachmentFileName}
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
            <button id="btn-register-inventory-cancel" type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button id="btn-register-inventory-submit" type="submit" className="btn btn-primary">
              Register Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function formatEmployeeCode(code: string): string {
  return code.replace(/^(\d{1,5})$/, (_, num) => `HC-${num.padStart(5, '0')}`);
}
