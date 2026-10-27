import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Declaration of Service of Notice (Washington only).
// The original firm form (public/forms/wa-declaration-of-service.pdf) is never redrawn or edited:
// values are written on top of it, so the layout stays exactly as the firm issued it.
// Coordinates are PDF points measured from the TOP-left of the page.
const TEMPLATE_URL = '/forms/wa-declaration-of-service.pdf';
const PAGE_H = 792;

const BOXES = {
  personal:      { x: 106, top: 319 },
  suitable:      { x: 106, top: 345 },
  mailed:        { x: 106, top: 381 },
  mailProperty:  { x: 156, top: 429 },
  mailOther:     { x: 156, top: 453 },
  posted:        { x: 106, top: 477 },
  emailed:       { x: 108, top: 539 },
};

export async function buildDeclarationPdf(v) {
  const bytes = await fetch(TEMPLATE_URL).then(r => {
    if (!r.ok) throw new Error('Could not load the declaration form');
    return r.arrayBuffer();
  });
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const [p1, p2] = doc.getPages();
  const ink = rgb(0, 0, 0);
  const text = (page, s, x, top, size = 11, f = font) => {
    if (s) page.drawText(String(s), { x, y: PAGE_H - top, size, font: f, color: ink });
  };

  // Page 1
  text(p1, v.serviceDate, 258, 207);
  text(p1, v.propertyAddress, 82, 229, 10);
  text(p1, v.tenantNames, 82, 277, 10);
  [['personal', v.personal], ['suitable', v.suitable], ['mailed', v.mailed],
   ['mailProperty', v.mailed && v.mailTo === 'property'],
   ['mailOther', v.mailed && v.mailTo === 'other'],
   ['posted', v.posted], ['emailed', v.emailed]].forEach(([k, on]) => {
    if (on) text(p1, 'X', BOXES[k].x + 1.5, BOXES[k].top + 9.5, 11, bold);
  });
  if (v.mailed && v.mailTo === 'other') text(p1, v.mailOtherAddress, 175, 460, 10);

  // Page 2
  text(p2, v.signDate, 155, 125);
  text(p2, v.signCity, 342, 125);

  return doc.save();
}

export default function WADeclarationOfService({ token, properties = [] }) {
  const API_URL = 'https://servfixy-production.up.railway.app';
  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #C8E4F8', borderRadius: '7px', color: '#0C447C', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#fff' };
  const labelStyle = { fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const card = { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #e2e8f0' };

  const waProps = properties.filter(p => (p.state || '').toUpperCase() === 'WA' || (p.notice_jurisdiction || '').toUpperCase() === 'WA');

  const blank = {
    serviceDate: '', propertyAddress: '', tenantNames: '',
    personal: false, suitable: false, mailed: false, mailTo: '', mailOtherAddress: '',
    posted: false, emailed: false, signDate: '', signCity: '',
  };
  const [propId, setPropId] = useState('');
  const [residents, setResidents] = useState([]);
  const [v, setV] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k, val) => setV(prev => ({ ...prev, [k]: val }));

  const choosePropertyHandler = async (id) => {
    setPropId(id); setResidents([]);
    const prop = waProps.find(p => String(p.id) === String(id));
    setV(prev => ({ ...prev, propertyAddress: prop?.address || '' }));
    if (!id) return;
    try {
      const res = await fetch(`${API_URL}/api/collections/cases/eligible-balance-due?property_id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await res.json();
      if (res.ok) setResidents(d.cases || []);
    } catch (e) { /* resident list is a convenience; fields can be typed in */ }
  };

  const chooseResident = (caseId) => {
    const c = residents.find(r => String(r.id) === String(caseId));
    if (!c) return;
    const prop = waProps.find(p => String(p.id) === String(propId));
    const base = prop?.address || v.propertyAddress;
    setV(prev => ({ ...prev, tenantNames: c.resident_name || '', propertyAddress: base ? `${base}${c.unit_number ? `, Unit ${c.unit_number}` : ''}` : prev.propertyAddress }));
  };

  const generate = async () => {
    setBusy(true); setError('');
    try {
      const out = await buildDeclarationPdf(v);
      const url = URL.createObjectURL(new Blob([out], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `Declaration of Service - ${(v.tenantNames || 'Tenant').replace(/[^\w\- ]/g, '')}.pdf`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) { setError(e.message || 'Could not create the declaration'); }
    finally { setBusy(false); }
  };

  const Check = ({ k, label, indent }) => (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0', marginLeft: indent ? '28px' : 0, fontSize: '13px', color: '#0C447C', cursor: 'pointer' }}>
      <input type='checkbox' checked={!!v[k]} onChange={e => set(k, e.target.checked)} style={{ marginTop: '2px' }} />
      <span>{label}</span>
    </label>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '700', color: '#0C447C' }}>Declaration of Service of Notice</h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Washington only. Fill the fields, tick how the notice was served, and download the firm's form. Nothing is ticked until you tick it; signature lines stay blank.</p>
      </div>

      <div style={card}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Washington Property</label>
            <select value={propId} onChange={e => choosePropertyHandler(e.target.value)} style={inputStyle}>
              <option value=''>Choose a property...</option>
              {waProps.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Resident (optional, fills name and unit)</label>
            <select defaultValue='' onChange={e => chooseResident(e.target.value)} disabled={!residents.length} style={inputStyle}>
              <option value=''>{residents.length ? 'Choose a resident...' : 'Type the name below'}</option>
              {residents.map(r => <option key={r.id} value={r.id}>{r.resident_name} — Unit {r.unit_number}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date Served (month and day, e.g. October 30)</label>
            <input value={v.serviceDate} onChange={e => set('serviceDate', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Tenant Name(s)</label>
            <input value={v.tenantNames} onChange={e => set('tenantNames', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Property Address (with unit)</label>
            <input value={v.propertyAddress} onChange={e => set('propertyAddress', e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={{ ...labelStyle, marginBottom: '8px' }}>How the notice was served</div>
        <Check k='personal' label='Delivered the notice personally to the defendants' />
        <Check k='suitable' label='Delivered to other residents or persons of suitable age and discretion in charge of the Property' />
        <Check k='mailed' label='Mailed copies the same day by certified mail, from within Washington' />
        {v.mailed && (
          <>
            <label style={{ display: 'flex', gap: '10px', padding: '6px 0', marginLeft: '28px', fontSize: '13px', color: '#0C447C', cursor: 'pointer' }}>
              <input type='radio' name='mailTo' checked={v.mailTo === 'property'} onChange={() => set('mailTo', 'property')} /> Mailed to the Property
            </label>
            <label style={{ display: 'flex', gap: '10px', padding: '6px 0', marginLeft: '28px', fontSize: '13px', color: '#0C447C', cursor: 'pointer' }}>
              <input type='radio' name='mailTo' checked={v.mailTo === 'other'} onChange={() => set('mailTo', 'other')} /> Mailed to another address
            </label>
            {v.mailTo === 'other' && (
              <div style={{ marginLeft: '28px', marginTop: '6px', maxWidth: '420px' }}>
                <input value={v.mailOtherAddress} onChange={e => set('mailOtherAddress', e.target.value)} placeholder='Last known address' style={inputStyle} />
              </div>
            )}
          </>
        )}
        <Check k='posted' label='Posted copies on a conspicuous place on the Property' />
        <Check k='emailed' label='Emailed the notice to the last known email address on file' />
      </div>

      <div style={card}>
        <div style={{ ...labelStyle, marginBottom: '8px' }}>Signing (page 2)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Date Signed (month and day)</label>
            <input value={v.signDate} onChange={e => set('signDate', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>City Signed In</label>
            <input value={v.signCity} onChange={e => set('signCity', e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      {error && <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>❌ {error}</div>}
      <button onClick={generate} disabled={busy}
        style={{ padding: '10px 22px', backgroundColor: busy ? '#94a3b8' : '#185FA5', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: busy ? 'not-allowed' : 'pointer' }}>
        {busy ? 'Creating…' : '⬇ Download Declaration (PDF)'}
      </button>
    </div>
  );
}
