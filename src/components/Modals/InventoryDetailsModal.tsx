import { Download, X } from 'lucide-react';
import React from 'react';

import type { AppUser, Inventory } from '../../types';

interface InventoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Inventory | null;
  users: AppUser[];
}

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
};

export const InventoryDetailsModal: React.FC<InventoryDetailsModalProps> = ({ isOpen, onClose, inventory, users }) => {
  if (!isOpen || !inventory) return null;

  const assignedUser = inventory.assigned_user_id ? users.find(u => u.id === inventory.assigned_user_id) : null;

  const isDataUrl = (val?: string | null) => !!val && val.startsWith('data:');

  const attachmentName = 'attachment';
  const attachmentUrl = inventory.attachment;

  const canPreview = attachmentUrl && isDataUrl(attachmentUrl) && attachmentUrl.startsWith('data:image/');

  const handleDownload = () => {
    if (!attachmentUrl) return;
    try {
      const a = document.createElement('a');
      if (isDataUrl(attachmentUrl)) {
        a.href = attachmentUrl;
        a.download = attachmentName;
      } else {
        a.href = attachmentUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // ignore
    }
  };

  const readonlyBox = (children: React.ReactNode, extra?: React.CSSProperties) => (
    <div
      className="form-input readonly"
      style={{
        background: 'var(--bg-tertiary)',
        padding: '0.5rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        border: '0.0531rem solid var(--border-color)',
        ...extra,
      }}
    >
      {children}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ width: '36rem', maxWidth: '95vw' }} onClick={(e) => e.stopPropagation()}>
        <div
          className="panel-header"
          style={{ padding: '1.0625rem 1.275rem', borderBottom: '0.0531rem solid var(--border-color)', margin: 0 }}
        >
          <h2 className="panel-title" style={{ fontSize: '1.15rem' }}>
            Inventory Details
          </h2>
          <button
            id="btn-inventory-details-modal-close"
            className="btn btn-secondary"
            style={{ width: '1.7rem', height: '1.7rem', padding: 0, borderRadius: '50%' }}
            onClick={onClose}
            aria-label="Close inventory details"
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '1.275rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Device ID</label>
              {readonlyBox(inventory.device_id || '—', { fontFamily: 'monospace', fontSize: '0.875rem' })}
            </div>
            <div className="form-group">
              <label className="form-label">SN/MAC Address</label>
              {readonlyBox(inventory.sn_mac_address || '—', { fontSize: '0.875rem', wordBreak: 'break-all' })}
            </div>

            <div className="form-group">
              <label className="form-label">Company</label>
              {readonlyBox(inventory.company || '—')}
            </div>
            <div className="form-group">
              <label className="form-label">Entity</label>
              {readonlyBox(inventory.entity || '—')}
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              {readonlyBox(inventory.category || '—')}
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              {readonlyBox(inventory.status || '—')}
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Assigned User</label>
              {readonlyBox(assignedUser ? `${assignedUser.name} (${assignedUser.username})` : 'Unassigned')}
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Details</label>
              <div
                className="form-textarea readonly"
                style={{
                  background: 'var(--bg-tertiary)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '0.0531rem solid var(--border-color)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  minHeight: '5.3125rem',
                }}
              >
                {inventory.details || '—'}
              </div>
            </div>

            {attachmentUrl && (
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Attachment</label>
                {canPreview ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <img
                      src={attachmentUrl}
                      alt={attachmentName}
                      style={{ maxWidth: '100%', maxHeight: '16rem', borderRadius: 'var(--radius-md)', border: '0.0531rem solid var(--border-color)', objectFit: 'contain', background: 'var(--bg-primary)' }}
                    />
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleDownload} style={{ alignSelf: 'flex-start' }}>
                      <Download size={14} style={{ marginRight: '0.25rem' }} />
                      Download ({attachmentName})
                    </button>
                  </div>
                ) : (
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleDownload}>
                    <Download size={14} style={{ marginRight: '0.25rem' }} />
                    Download Attachment ({attachmentName})
                  </button>
                )}
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: '1rem',
              borderTop: '0.0531rem solid var(--border-color)',
              paddingTop: '0.85rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
            }}
          >
            <div className="form-group">
              <label className="form-label">Created At</label>
              {readonlyBox(formatDate(inventory.created_at), { fontSize: '0.875rem' })}
            </div>
            <div className="form-group">
              <label className="form-label">Updated At</label>
              {readonlyBox(formatDate(inventory.updated_at), { fontSize: '0.875rem' })}
            </div>
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
          <button id="btn-inventory-details-close" type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
