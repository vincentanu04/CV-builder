import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  IconX,
  IconClockHour4,
  IconRestore,
  IconLoader2,
  IconArrowLeft,
  IconEye,
  IconEyeOff,
  IconArrowsSort,
} from '@tabler/icons-react';
import { useVersionHistory } from '@/hooks/useVersionHistory';
import { usePostResumeVersionRestoreMutation } from '@/api/client';
import type { ResumeVersion } from '@/api/client';

interface VersionTimelineProps {
  resumeID: string;
  open: boolean;
  onClose: () => void;
  onRestored: () => void;
}

// ── Formatting ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, {
    month: 'short', day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function formatAbsoluteDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function getVersionLabel(v: ResumeVersion): string {
  if (v.label) return v.label;
  if (v.versionNumber === 1) return 'Initial save';
  return `Version ${v.versionNumber}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────

/** lineType: 'structural' renders as plain badge; 'content' renders as git diff */
interface DiffLine {
  label: string;
  before: string;
  after: string;
  lineType: 'structural' | 'content';
}

interface SectionDiff {
  id: string;
  name: string;
  status: 'same' | 'added' | 'removed' | 'changed';
  lines: DiffLine[];
}

// ── Normalization ─────────────────────────────────────────────────────────────

const norm = (v: any): string => (v == null ? '' : String(v).trim());

function isEmpty(v: any): boolean {
  if (v == null || v === '') return true;
  if (typeof v === 'string') return v.trim() === '';
  if (typeof v === 'number') return v === 0;
  if (Array.isArray(v)) return v.every(isEmpty);
  if (typeof v === 'object') return Object.values(v).every(isEmpty);
  return false;
}

function meaningfulEntries(arr: any[]): any[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter(e => e != null && typeof e === 'object' && !isEmpty(e));
}

function truncate(s: string, max = 120): string {
  if (!s) return '(empty)';
  return s.length > max ? s.slice(0, max) + '…' : s;
}

function cline(label: string, before: string, after: string): DiffLine {
  return { label, before: truncate(before || ''), after: truncate(after || ''), lineType: 'content' };
}

// ── Per-section comparators ───────────────────────────────────────────────────

function compareProfile(curr: any, ver: any): DiffLine[] {
  const lines: DiffLine[] = [];
  const fields: [string, string][] = [
    ['Full Name', 'name'], ['Email', 'email'], ['Phone Number', 'phoneNumber'],
    ['LinkedIn URL', 'linkedin'], ['GitHub URL', 'github'],
  ];
  for (const [label, key] of fields) {
    const a = norm(curr?.[key]), b = norm(ver?.[key]);
    if (a !== b) lines.push(cline(label, a, b));
  }
  return lines;
}

function compareEducation(curr: any, ver: any): DiffLine[] {
  const lines: DiffLine[] = [];
  const scalar: [string, string][] = [
    ['School', 'schoolName'], ['Degree / Title of Study', 'titleOfStudy'],
    ['GPA', 'gpa'], ['Start Date', 'fromDate'], ['End Date', 'toDate'],
  ];
  for (const [label, key] of scalar) {
    const a = norm(curr?.[key]), b = norm(ver?.[key]);
    if (a !== b) lines.push(cline(label, a, b));
  }
  const cwA = (curr?.relevantCoursework ?? []).filter(Boolean);
  const cwB = (ver?.relevantCoursework ?? []).filter(Boolean);
  if (JSON.stringify(cwA) !== JSON.stringify(cwB)) {
    lines.push(cline('Relevant Coursework', cwA.join(', '), cwB.join(', ')));
  }
  return lines;
}

function compareExperience(curr: any[], ver: any[]): DiffLine[] {
  const ca = meaningfulEntries(curr), va = meaningfulEntries(ver);
  const lines: DiffLine[] = [];
  if (ca.length !== va.length)
    lines.push(cline('Number of jobs', String(ca.length), String(va.length)));
  for (let i = 0; i < Math.max(ca.length, va.length); i++) {
    const ce = ca[i], ve = va[i];
    if (!ce) { lines.push(cline(`Job ${i + 1}`, '(not present)', norm(ve?.positionTitle) || norm(ve?.companyName) || '(new)')); continue; }
    if (!ve) { lines.push(cline(`Job ${i + 1}`, norm(ce?.positionTitle) || norm(ce?.companyName), '(removed)')); continue; }
    const lbl = (norm(ve.positionTitle) && norm(ve.companyName))
      ? `${norm(ve.positionTitle)} @ ${norm(ve.companyName)}`
      : `Job ${i + 1}`;
    for (const [l, k] of [[`${lbl} — position`, 'positionTitle'], [`${lbl} — company`, 'companyName'], [`${lbl} — start`, 'dateFrom'], [`${lbl} — end`, 'dateUntil']] as [string, string][]) {
      const a = norm(ce?.[k]), b = norm(ve?.[k]);
      if (a !== b) lines.push(cline(l, a, b));
    }
    const rA = (ce?.responsibilities ?? []).filter(Boolean);
    const rB = (ve?.responsibilities ?? []).filter(Boolean);
    if (JSON.stringify(rA) !== JSON.stringify(rB)) {
      lines.push(cline(`${lbl} — responsibilities`, rA.join('\n'), rB.join('\n')));
    }
  }
  return lines;
}

function compareProjects(curr: any[], ver: any[]): DiffLine[] {
  const ca = meaningfulEntries(curr), va = meaningfulEntries(ver);
  const lines: DiffLine[] = [];
  if (ca.length !== va.length)
    lines.push(cline('Number of projects', String(ca.length), String(va.length)));
  for (let i = 0; i < Math.max(ca.length, va.length); i++) {
    const ce = ca[i], ve = va[i];
    const lbl = norm(ve?.projectTitle) || norm(ce?.projectTitle) || `Project ${i + 1}`;
    if (!ce) { lines.push(cline(lbl, '(not present)', '(added)')); continue; }
    if (!ve) { lines.push(cline(lbl, '(present)', '(removed)')); continue; }
    if (norm(ce.projectTitle) !== norm(ve.projectTitle))
      lines.push(cline(`${lbl} — title`, norm(ce.projectTitle), norm(ve.projectTitle)));
    if (norm(ce.projectDescription) !== norm(ve.projectDescription))
      lines.push(cline(`${lbl} — description`, norm(ce.projectDescription), norm(ve.projectDescription)));
    const tsA = (ce.projectTechStack ?? []).filter(Boolean);
    const tsB = (ve.projectTechStack ?? []).filter(Boolean);
    if (JSON.stringify(tsA) !== JSON.stringify(tsB))
      lines.push(cline(`${lbl} — tech stack`, tsA.join(', '), tsB.join(', ')));
  }
  return lines;
}

function compareAwards(curr: any[], ver: any[]): DiffLine[] {
  const ca = meaningfulEntries(curr), va = meaningfulEntries(ver);
  const lines: DiffLine[] = [];
  if (ca.length !== va.length)
    lines.push(cline('Number of awards', String(ca.length), String(va.length)));
  for (let i = 0; i < Math.max(ca.length, va.length); i++) {
    const ce = ca[i], ve = va[i];
    const lbl = norm(ve?.awardTitle) || norm(ce?.awardTitle) || `Award ${i + 1}`;
    if (!ce) { lines.push(cline(lbl, '(not present)', '(added)')); continue; }
    if (!ve) { lines.push(cline(lbl, '(present)', '(removed)')); continue; }
    for (const [l, k] of [[`${lbl} — title`, 'awardTitle'], [`${lbl} — issuer`, 'awardIssuer'], [`${lbl} — date`, 'awardDate'], [`${lbl} — description`, 'awardDescription']] as [string, string][]) {
      const a = norm(ce?.[k]), b = norm(ve?.[k]);
      if (a !== b) lines.push(cline(l, a, b));
    }
  }
  return lines;
}

function compareAdditional(curr: any[], ver: any[]): DiffLine[] {
  const ca = meaningfulEntries(curr), va = meaningfulEntries(ver);
  const lines: DiffLine[] = [];
  if (ca.length !== va.length)
    lines.push(cline('Number of entries', String(ca.length), String(va.length)));
  for (let i = 0; i < Math.max(ca.length, va.length); i++) {
    const ce = ca[i], ve = va[i];
    const lbl = norm(ve?.additionalTitle) || norm(ce?.additionalTitle) || `Entry ${i + 1}`;
    if (!ce) { lines.push(cline(lbl, '(not present)', '(added)')); continue; }
    if (!ve) { lines.push(cline(lbl, '(present)', '(removed)')); continue; }
    for (const [l, k] of [[`${lbl} — title`, 'additionalTitle'], [`${lbl} — description`, 'additionalDescription'], [`${lbl} — date`, 'additionalDate']] as [string, string][]) {
      const a = norm(ce?.[k]), b = norm(ve?.[k]);
      if (a !== b) lines.push(cline(l, a, b));
    }
  }
  return lines;
}

function compareSkills(curr: any, ver: any): DiffLine[] {
  const lines: DiffLine[] = [];
  const cats: [string, string][] = [
    ['General Skills', 'general'], ['Programming Languages', 'languages'],
    ['Databases', 'databases'], ['Others', 'others'],
  ];
  for (const [label, key] of cats) {
    const a = (curr?.[key] ?? []).filter(Boolean);
    const b = (ver?.[key] ?? []).filter(Boolean);
    if (JSON.stringify(a) !== JSON.stringify(b))
      lines.push(cline(label, a.join(', '), b.join(', ')));
  }
  return lines;
}

function compareRemarks(curr: any, ver: any): DiffLine[] {
  const a = norm(curr?.remarks), b = norm(ver?.remarks);
  if (a !== b) return [cline('Remarks Text', a, b)];
  return [];
}

function getContentLines(sectionKey: string, prevData: any, verData: any): DiffLine[] {
  switch (sectionKey) {
    case 'profile':    return compareProfile(prevData, verData);
    case 'education':  return compareEducation(prevData, verData);
    case 'experience': return compareExperience(prevData, verData);
    case 'projects':   return compareProjects(prevData, verData);
    case 'awards':     return compareAwards(prevData, verData);
    case 'additional': return compareAdditional(prevData, verData);
    case 'skills':     return compareSkills(prevData, verData);
    case 'remarks':    return compareRemarks(prevData, verData);
    case 'custom': {
      const prev: string[] = prevData ?? [];
      const ver: string[] = verData ?? [];
      return prev.join('\n') !== ver.join('\n')
        ? [cline('Bullets', prev.filter(Boolean).join(', ') || '(empty)', ver.filter(Boolean).join(', ') || '(empty)')]
        : [];
    }
    default:
      return isEmpty(prevData) === isEmpty(verData) ? [] : [cline('Content', '(different)', '(changed)')];
  }
}

// ── Section-level diff ────────────────────────────────────────────────────────

interface SectionInfo {
  id: string; name: string; sectionKey: string; position: number; isVisible: boolean; data: any;
}

function parseSectionedData(dataStr: string): SectionInfo[] {
  try {
    const parsed = JSON.parse(dataStr);
    return (parsed?.sections ?? []).sort((a: SectionInfo, b: SectionInfo) => a.position - b.position);
  } catch { return []; }
}

/** Diff "what changed going from prevData to verData" */
function diffSections(prevData: string, verData: string): SectionDiff[] {
  const prev = parseSectionedData(prevData);
  const ver  = parseSectionedData(verData);

  const prevMap = new Map(prev.map(s => [s.id, s]));
  const verMap  = new Map(ver.map(s => [s.id, s]));
  const diffs: SectionDiff[] = [];

  ver.forEach((vs, vIdx) => {
    const ps = prevMap.get(vs.id);
    if (!ps) {
      const addedLines = getContentLines(vs.sectionKey, null, vs.data);
      diffs.push({ id: vs.id, name: vs.name, status: 'added', lines: addedLines });
      return;
    }

    const lines: DiffLine[] = [];

    // Structural changes — plain text rendering
    if (ps.isVisible !== vs.isVisible)
      lines.push({ label: 'Visibility', before: ps.isVisible ? 'visible' : 'hidden', after: vs.isVisible ? 'visible' : 'hidden', lineType: 'structural' });
    const prevPos = prev.findIndex(s => s.id === vs.id);
    if (prevPos !== vIdx)
      lines.push({ label: 'Position', before: String(prevPos + 1), after: String(vIdx + 1), lineType: 'structural' });
    if (ps.name !== vs.name)
      lines.push({ label: 'Section Name', before: ps.name, after: vs.name, lineType: 'structural' });

    // Content changes — git-style rendering
    lines.push(...getContentLines(vs.sectionKey, ps.data, vs.data));

    diffs.push({ id: vs.id, name: vs.name, status: lines.length > 0 ? 'changed' : 'same', lines });
  });

  prev.forEach(ps => {
    if (!verMap.has(ps.id)) {
      const removedLines = getContentLines(ps.sectionKey, ps.data, null);
      diffs.push({ id: ps.id, name: ps.name, status: 'removed', lines: removedLines });
    }
  });

  return diffs;
}

// ── Word-level LCS diff ───────────────────────────────────────────────────────

type Token = { text: string; type: 'same' | 'del' | 'ins' };

function tokenize(s: string): string[] {
  return s.split(/(\s+|[,;:.!?()[\]{}/\\|"'`\n])/).filter(t => t.length > 0);
}

function lcs(a: string[], b: string[]): number[][] {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
  return dp;
}

function wordDiff(before: string, after: string): { before: Token[]; after: Token[] } {
  if (!before && !after) return { before: [], after: [] };
  if (!before) return { before: [], after: [{ text: after, type: 'ins' }] };
  if (!after)  return { before: [{ text: before, type: 'del' }], after: [] };

  const a = tokenize(before), b = tokenize(after);
  if (a.length > 300 || b.length > 300) {
    // Too long — show as full block diff
    return { before: [{ text: before, type: 'del' }], after: [{ text: after, type: 'ins' }] };
  }

  const dp = lcs(a, b);
  const bToks: Token[] = [], aToks: Token[] = [];
  let i = a.length, j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i-1] === b[j-1]) {
      bToks.unshift({ text: a[i-1], type: 'same' });
      aToks.unshift({ text: b[j-1], type: 'same' });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      aToks.unshift({ text: b[j-1], type: 'ins' }); j--;
    } else {
      bToks.unshift({ text: a[i-1], type: 'del' }); i--;
    }
  }
  return { before: bToks, after: aToks };
}

function InlineTokens({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((tok, i) =>
        tok.type === 'same' ? <span key={i}>{tok.text}</span>
        : tok.type === 'del' ? <span key={i} className="diff-tok-del">{tok.text}</span>
        : <span key={i} className="diff-tok-ins">{tok.text}</span>
      )}
    </>
  );
}

// ── Renderers ─────────────────────────────────────────────────────────────────

/** Plain badge row for structural changes (visibility, position, name) */
function StructuralLine({ line }: { line: DiffLine }) {
  const icon =
    line.label === 'Visibility' ? (line.after === 'visible' ? <IconEye size={12} /> : <IconEyeOff size={12} />) :
    line.label === 'Position'   ? <IconArrowsSort size={12} /> : null;

  return (
    <div className="diff-structural-line">
      {icon}
      <span className="diff-structural-label">{line.label}:</span>
      <span className="diff-structural-before">{line.before}</span>
      <span className="diff-structural-arrow">→</span>
      <span className="diff-structural-after">{line.after}</span>
    </div>
  );
}

/** Git-style two-line row for content changes */
function ContentLine({ line }: { line: DiffLine }) {
  const { before: bToks, after: aToks } = wordDiff(line.before, line.after);
  const hasBoth = !!line.before && !!line.after;

  return (
    <div className="diff-line">
      <div className="diff-line-label-row">{line.label}</div>
      <div className="diff-line-values">
        {line.before && line.before !== '(empty)' && (
          <div className="diff-line-before">
            <span className="diff-gutter diff-gutter--del">−</span>
            <span className="diff-line-text">
              {hasBoth ? <InlineTokens tokens={bToks} /> : line.before}
            </span>
          </div>
        )}
        {line.after && line.after !== '(empty)' && (
          <div className="diff-line-after">
            <span className="diff-gutter diff-gutter--ins">+</span>
            <span className="diff-line-text">
              {hasBoth ? <InlineTokens tokens={aToks} /> : line.after}
            </span>
          </div>
        )}
        {/* Only-deletion case */}
        {line.before && !line.after && (
          <div className="diff-line-before">
            <span className="diff-gutter diff-gutter--del">−</span>
            <span className="diff-line-text">{line.before}</span>
          </div>
        )}
        {/* Only-addition case */}
        {!line.before && line.after && (
          <div className="diff-line-after">
            <span className="diff-gutter diff-gutter--ins">+</span>
            <span className="diff-line-text">{line.after}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Error banner ──────────────────────────────────────────────────────────────

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="error-banner">
      <span>{message}</span>
      <button className="error-banner-close" onClick={onDismiss} aria-label="Dismiss">
        <IconX size={14} />
      </button>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function VersionTimeline({ resumeID, open, onClose, onRestored }: VersionTimelineProps) {
  const { versions, isLoading } = useVersionHistory(resumeID);
  const [restoreVersion] = usePostResumeVersionRestoreMutation();
  const [restoringId, setRestoringId]       = useState<string | null>(null);
  const [previewIdx, setPreviewIdx]         = useState<number | null>(null);
  const [errorMsg, setErrorMsg]             = useState<string | null>(null);

  const previewVersion = previewIdx !== null ? versions[previewIdx] : null;
  // The version just before the selected one in the list (older = higher index)
  const prevVersion    = previewIdx !== null ? versions[previewIdx + 1] : null;

  const handleRestore = async (versionId: string) => {
    setRestoringId(versionId);
    setErrorMsg(null);
    try {
      await restoreVersion({ id: resumeID, vid: versionId }).unwrap();
      setPreviewIdx(null);
      onRestored();
      onClose();
    } catch {
      setErrorMsg('Failed to restore version. Please try again.');
    } finally {
      setRestoringId(null);
    }
  };

  // Diff: what changed going from prevVersion → selectedVersion
  const diffs = previewVersion
    ? diffSections(prevVersion?.data ?? '{}', previewVersion.data ?? '{}')
    : [];
  const changedDiffs = diffs.filter(d => d.status !== 'same');
  const hasChanges   = changedDiffs.length > 0;

  const handleClose = () => { setPreviewIdx(null); onClose(); };

  return (
    <Dialog.Root open={open} onOpenChange={o => !o && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="version-dialog-overlay" />
        <Dialog.Content className="version-dialog">
          <div className="version-dialog-header">
            <div className="version-dialog-title">
              {previewVersion ? (
                <button className="version-back-btn" onClick={() => setPreviewIdx(null)} aria-label="Back">
                  <IconArrowLeft size={18} />
                </button>
              ) : (
                <IconClockHour4 size={18} />
              )}
              <Dialog.Title>
                {previewVersion ? getVersionLabel(previewVersion) : 'Version History'}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="version-dialog-close" aria-label="Close">
                <IconX size={18} />
              </button>
            </Dialog.Close>
          </div>

          {errorMsg && <ErrorBanner message={errorMsg} onDismiss={() => setErrorMsg(null)} />}

          {previewVersion ? (
            <div className="version-preview">
              <p className="version-preview-meta">
                Saved {formatAbsoluteDate(previewVersion.createdAt)}
                {prevVersion
                  ? ` — changes since ${formatAbsoluteDate(prevVersion.createdAt)}`
                  : ' — initial save'
                }
              </p>

              <div className="version-diff-list">
                {!hasChanges ? (
                  <p className="version-diff-unchanged">No changes detected in this version.</p>
                ) : (
                  changedDiffs.map(d => (
                    <div key={d.id} className={`version-diff-item version-diff--${d.status}`}>
                      <div className="version-diff-name">
                        {d.name}
                        <span className="version-diff-tag">
                          {d.status === 'added'   && 'added'}
                          {d.status === 'removed' && 'removed'}
                          {d.status === 'changed' && 'changed'}
                        </span>
                      </div>
                      {d.lines.length > 0 && (
                        <div className="diff-lines-container">
                          {/* Structural changes: plain badges */}
                          {d.lines.filter(l => l.lineType === 'structural').map((l, i) => (
                            <StructuralLine key={i} line={l} />
                          ))}
                          {/* Content changes: git-style diff */}
                          {d.lines.filter(l => l.lineType === 'content').length > 0 && (
                            <div className="diff-lines">
                              {d.lines.filter(l => l.lineType === 'content').map((l, i) => (
                                <ContentLine key={i} line={l} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="version-preview-actions">
                <button className="confirm-btn cancel" onClick={() => setPreviewIdx(null)}>Cancel</button>
                <button
                  className="confirm-btn confirm"
                  disabled={restoringId !== null}
                  onClick={() => handleRestore(previewVersion.id)}
                >
                  {restoringId !== null
                    ? <IconLoader2 size={14} className="spin" />
                    : <><IconRestore size={14} />Restore this version</>
                  }
                </button>
              </div>
            </div>
          ) : (
            <div className="version-list">
              {isLoading && (
                <div className="version-empty">
                  <IconLoader2 size={18} className="spin" /> Loading…
                </div>
              )}
              {!isLoading && versions.length === 0 && (
                <div className="version-empty">
                  No versions yet. Versions are saved automatically as you edit.
                </div>
              )}
              {versions.map((v, idx) => (
                <button key={v.id} className="version-item" onClick={() => setPreviewIdx(idx)}>
                  <div className="version-item-meta">
                    <span className="version-label">{getVersionLabel(v)}</span>
                    <span className="version-time" title={formatAbsoluteDate(v.createdAt)}>
                      {formatDate(v.createdAt)}
                      {idx === 0 && <span className="version-badge">Latest</span>}
                    </span>
                  </div>
                  <IconArrowLeft size={14} className="version-chevron" />
                </button>
              ))}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
