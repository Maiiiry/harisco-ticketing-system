import { X } from 'lucide-react';
import React, { useState } from 'react';

interface RegisterInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    company: string;
    entity: string;
    specs: string;
    device_id: string;
    sn_mac_address: string;
  }) => void;
}

export const RegisterInventoryModal: React.FC<RegisterInventoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [company, setCompany] = useState('');
  const [entity, setEntity] = useState('');
  const [specs, setSpecs] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [snMacAddress, setSnMacAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const finalCompany = company.trim();
    const finalEntity = entity.trim();
    const finalSpecs = specs.trim();
    const finalDeviceId = deviceId.trim();
    const finalSnMacAddress = snMacAddress.trim();

    if (!finalCompany) {
      setErrorMsg('Company is required.');
      return;
    }
    if (!finalEntity) {
      setErrorMsg('Entity is required.');
      return;
    }
    if (!finalSpecs) {
      setErrorMsg('Specs is required.');
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
      entity: finalEntity,
      specs: finalSpecs,
      device_id: finalDeviceId,
      sn_mac_address: finalSnMacAddress,
    });

    setCompany('');
    setEntity('');
    setSpecs('');
    setDeviceId('');
    setSnMacAddress('');
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
              <label htmlFor="inventory-entity-input" className="form-label">
                Entity
              </label>
              <input
                id="inventory-entity-input"
                type="text"
                className="form-input"
                placeholder="e.g. IT Department"
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="inventory-specs-input" className="form-label">
                Specs (Hardware / Software Details)
              </label>
              <textarea
                id="inventory-specs-input"
                className="form-input"
                style={{ minHeight: '5.3125rem', resize: 'vertical' }}
                placeholder="e.g. Dell Latitude 5430, 16GB RAM, 512GB SSD, Windows 11"
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
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
