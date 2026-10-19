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
  const [showFullscreenImage, setShowFullscreenImage] = React.useState(false);

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

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content"
          style={{
            maxWidth: '34rem',
            width: '92%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 className="panel-title modal-title-sm">Inventory Details</h2>
            </div>
            <button className="btn btn-secondary modal-close-btn-sm" onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div
            className="modal-body"
            style={{
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* Metadata Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.85rem',
                background: 'var(--bg-tertiary)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Device ID</span>
                <strong style={{ fontSize: '0.85rem' }}>{inventory.device_id || '—'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>SN/MAC Address</span>
                <strong style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{inventory.sn_mac_address || '—'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Company</span>
                <strong style={{ fontSize: '0.85rem' }}>{inventory.company || '—'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Entity</span>
                <strong style={{ fontSize: '0.85rem' }}>{inventory.entity || '—'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Category</span>
                <strong style={{ fontSize: '0.85rem' }}>{inventory.category || '—'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Status</span>
                <strong style={{ fontSize: '0.85rem' }}>{inventory.status || '—'}</strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Assigned User</span>
                <strong style={{ fontSize: '0.85rem' }}>
                  {assignedUser ? `${assignedUser.name} (${assignedUser.username})` : 'Unassigned'}
                </strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Details</span>
                <div
                  style={{
                    background: 'var(--bg-primary)',
                    padding: '0.75rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    color: 'var(--text-primary)',
                    marginTop: '0.2rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {inventory.details || '—'}
                </div>
              </div>
              {attachmentUrl && (
                <div style={{ gridColumn: 'span 2' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <label className="form-label" style={{ margin: 0 }}>
                      Attachment
                    </label>
                    <a
                      href={attachmentUrl}
                      download={`${attachmentName}-${inventory.id}.jpg`}
                      className="btn btn-secondary leave-btn-xs"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        textDecoration: 'none',
                      }}
                    >
                      <Download size={13} /> Download
                    </a>
                  </div>

                  <div
                    style={{
                      background: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    {canPreview ? (
                      <>
                        <img
                          src={attachmentUrl}
                          alt="Inventory Attachment"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '16rem',
                            objectFit: 'contain',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            border: '1px solid var(--border-color)',
                          }}
                          onClick={() => setShowFullscreenImage(true)}
                          title="Click to view full size on screen"
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Click image to open in full size
                        </span>
                      </>
                    ) : (
                      <>
                        <button type="button" className="btn btn-secondary leave-btn-xs" onClick={handleDownload} style={{ padding: '0.4rem 0.85rem' }}>
                          <Download size={13} style={{ marginRight: '0.2rem' }} /> Download Attachment
                        </button>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {attachmentUrl.startsWith('data:image/') ? 'Image preview not available' : 'Attachment preview not available'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Created At</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{formatDate(inventory.created_at)}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.5rem' }}>Updated At</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{formatDate(inventory.updated_at)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div />
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Lightbox Overlay */}
      {showFullscreenImage && attachmentUrl && (
        <div
          className="modal-overlay"
          style={{
            zIndex: 1100,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowFullscreenImage(false)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn btn-secondary modal-close-btn-sm"
              style={{
                position: 'absolute',
                top: '-2.5rem',
                right: 0,
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => setShowFullscreenImage(false)}
              aria-label="Close full size view"
            >
              <X size={18} />
            </button>
            <img
              src={attachmentUrl}
              alt="Inventory Attachment Full View"
              style={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-sm)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
