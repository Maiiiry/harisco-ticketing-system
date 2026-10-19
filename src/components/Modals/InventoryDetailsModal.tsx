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
    <div className="inv-readonly-box" style={extra}>
      {children}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ width: '36rem', maxWidth: '95vw' }} onClick={(e) => e.stopPropagation()}>
        <div className="panel-header inv-modal-header">
          <h2 className="panel-title inv-modal-title">
            Inventory Details
          </h2>
          <button
            id="btn-inventory-details-modal-close"
            className="btn btn-secondary inv-modal-close-btn"
            onClick={onClose}
            aria-label="Close inventory details"
          >
            <X size={16} />
          </button>
        </div>

        <div className="inv-modal-body">
          <div className="inv-form-grid">
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

            <div className="form-group inv-span-2">
              <label className="form-label">Assigned User</label>
              {readonlyBox(assignedUser ? `${assignedUser.name} (${assignedUser.username})` : 'Unassigned')}
            </div>

            <div className="form-group inv-span-2">
              <label className="form-label">Details</label>
              <div className="inv-details-textarea">
                {inventory.details || '—'}
              </div>
            </div>

            {attachmentUrl && (
              <div className="form-group inv-span-2">
                <label className="form-label">Attachment</label>
                {canPreview ? (
                  <div className="inv-attachment-preview">
                    <img
                      src={attachmentUrl}
                      alt={attachmentName}
                      className="inv-attachment-img"
                    />
                    <button type="button" className="btn btn-secondary btn-sm inv-download-btn" onClick={handleDownload}>
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

          <div className="inv-date-row">
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

        <div className="inv-modal-footer">
          <button id="btn-inventory-details-close" type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
