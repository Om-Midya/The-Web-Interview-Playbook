import { useEffect, useRef, useState } from 'react';
import Stepper from '../engine/Stepper';
import { AUTH_FLOW_TRACE, type FlowState } from './flow';
import {
  DEFAULT_PAYLOAD, DEFAULT_SECRET, JWT_HEADER, b64urlEncode, hasWebCrypto,
  signToken, tamperToken, verifyToken,
} from './jwt';

type Verdict = 'valid' | 'invalid' | 'na' | 'checking';

const BANNER: Record<Verdict, string> = {
  valid: '✓ signature valid',
  invalid: '✗ INVALID SIGNATURE — content changed after signing',
  na: 'WebCrypto needs a secure context — showing token structure only',
  checking: '… verifying',
};

function FlowDiagram(state: FlowState) {
  return (
    <div>
      <div className="pipeline">
        <span className={`pipe-node${state.active === 'client' ? ' at' : ''}`}>
          client{state.clientHas ? ' 🎟' : ''}
        </span>
        <span className="pl-arrow">{state.wire}</span>
        <span className={`pipe-node${state.active === 'server' ? ' at' : ''}`}>
          server{state.serverAction ? ` · ${state.serverAction}` : ''}
        </span>
      </div>
    </div>
  );
}

export default function JwtDecoder() {
  const webCrypto = hasWebCrypto();
  const [payloadJson, setPayloadJson] = useState(DEFAULT_PAYLOAD);
  const [secret, setSecret] = useState(DEFAULT_SECRET);
  const [token, setToken] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<Verdict>(webCrypto ? 'checking' : 'na');
  const [editingToken, setEditingToken] = useState(false);
  const signReq = useRef(0);
  const verifyReq = useRef(0);

  // Re-sign (debounced) when payload or secret changes.
  useEffect(() => {
    try {
      JSON.parse(payloadJson);
      setJsonError(null);
    } catch {
      setJsonError('invalid JSON — the token keeps the last good payload');
      return;
    }
    if (!webCrypto) {
      setToken(`${b64urlEncode(JWT_HEADER)}.${b64urlEncode(payloadJson)}.unsigned`);
      return;
    }
    const req = ++signReq.current;
    const t = setTimeout(() => {
      signToken(payloadJson, secret).then((tok) => {
        if (signReq.current === req) setToken(tok);
      });
    }, 150);
    return () => clearTimeout(t);
  }, [payloadJson, secret, webCrypto]);

  // Verify whenever the token or secret changes.
  useEffect(() => {
    if (!webCrypto) {
      setVerdict('na');
      return;
    }
    if (!token) return;
    setVerdict('checking');
    const req = ++verifyReq.current;
    verifyToken(token, secret).then((ok) => {
      if (verifyReq.current === req) setVerdict(ok ? 'valid' : 'invalid');
    });
  }, [token, secret, webCrypto]);

  const parts = token.split('.');

  return (
    <div className="jwt-grid">
      <div className="jwt-panes">
        <div className="jwt-pane is-header">
          <span className="label">header (fixed)</span>
          <pre className="jwt-input" aria-label="JWT header">{JWT_HEADER}</pre>
        </div>
        <div className="jwt-pane is-payload">
          <span className="label">payload — edit me</span>
          <textarea
            className="jwt-textarea"
            aria-label="JWT payload JSON"
            value={payloadJson}
            onChange={(e) => setPayloadJson(e.target.value)}
          />
          {jsonError && <p className="jwt-error">{jsonError}</p>}
        </div>
        <div className="jwt-pane is-secret">
          <span className="label">secret — the server's, never the client's</span>
          <input
            className="jwt-input"
            aria-label="Signing secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          />
        </div>
      </div>
      {editingToken ? (
        <textarea
          className="jwt-textarea"
          aria-label="Token (editing — changes are NOT re-signed)"
          autoFocus
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onBlur={() => setEditingToken(false)}
        />
      ) : (
        <div
          className="jwt-token"
          role="button"
          tabIndex={0}
          aria-label="Assembled token — click to edit (edits are not re-signed)"
          onClick={() => setEditingToken(true)}
          onKeyDown={(e) => e.key === 'Enter' && setEditingToken(true)}
        >
          <span className="jwt-h">{parts[0]}</span>.<span className="jwt-p">{parts[1]}</span>.
          <span className="jwt-s">{parts[2] ?? ''}</span>
        </div>
      )}
      <div className="sim-actions">
        <span className={`jwt-banner is-${verdict}`} aria-live="polite">{BANNER[verdict]}</span>
        {webCrypto && (
          <button onClick={() => setToken((t) => tamperToken(t))}>
            Tamper (role → admin, no re-sign)
          </button>
        )}
      </div>
      <p className="sim-note">
        The signature covers <em>exactly</em> the bytes of header.payload. Change one character —
        by hand or with Tamper — and verification fails. Fix it by editing the payload pane
        instead: that re-signs with the secret, which an attacker doesn't have.
      </p>
      <Stepper samples={AUTH_FLOW_TRACE} renderState={FlowDiagram} />
    </div>
  );
}
