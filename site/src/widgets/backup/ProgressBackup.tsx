import { useState } from 'react';
import { loadProgress, replaceAll } from '../roadmap/storage';

interface BackupShape {
  version: 1;
  progress: Record<string, true>;
}

export function validateBackup(data: unknown): data is BackupShape {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  if (d.version !== 1) return false;
  if (typeof d.progress !== 'object' || d.progress === null || Array.isArray(d.progress)) return false;
  return Object.values(d.progress).every((v) => v === true);
}

export default function ProgressBackup() {
  const [message, setMessage] = useState('');

  function exportProgress() {
    const blob = new Blob(
      [JSON.stringify({ version: 1, progress: loadProgress() }, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playbook-progress.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Progress exported.');
  }

  async function importProgress(file: File | undefined) {
    if (!file) return;
    try {
      const data: unknown = JSON.parse(await file.text());
      if (!validateBackup(data)) {
        setMessage('That file is not a valid progress backup.');
        return;
      }
      replaceAll({ ...loadProgress(), ...data.progress });
      setMessage('Progress imported — checklists and roadmap updated.');
    } catch {
      setMessage('Could not read that file.');
    }
  }

  return (
    <div className="backup-row">
      <button onClick={exportProgress}>⬇ Export progress</button>
      <label className="import-btn">
        ⬆ Import progress
        <input
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            importProgress(file);
          }}
        />
      </label>
      <span className="backup-note" role="status">{message || 'Back up your progress or move it to another device.'}</span>
    </div>
  );
}
