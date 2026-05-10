import './ResumeForm.css';
import { useEffect, useRef, useState } from 'react';
import Buttons from '@/components/Buttons/Buttons';
import { Button } from '@/components/ui/button';
import AutosaveIndicator from '@/components/AutosaveIndicator';
import {
  ProfileForm,
  EducationForm,
  ExperienceForm,
  ProjectsForm,
  AdditionalForm,
  SkillsForm,
  RemarkForm,
  AwardsForm,
} from '@/components/Form/Form';
import CV from '@/components/CV/CV';
import { PDFDownloadLink, PDFViewer, StyleSheet } from '@react-pdf/renderer';
import { makeInitialSectionedData, makeExampleSectionedData } from '@/formData';
import type { SectionedFormData, Section, SectionKey, Profile } from '@/components/CV/types';
import { createResume, getResume, updateResume } from '@/api/resume';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FORBIDDEN_MESSAGE } from '@/api/errors';
import { ConfirmBack } from '@/components/confirm-back';
import { useAuth } from '@/contexts/AuthContext';
import { parseResumeData, serializeResumeData } from '@/utils/json';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { VersionTimeline } from '@/components/VersionHistory/VersionTimeline';
import * as Dialog from '@radix-ui/react-dialog';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  IconGripVertical,
  IconEye,
  IconEyeOff,
  IconTrash,
  IconCheck,
  IconX,
  IconPlus,
  IconHistory,
  IconDownload,
  IconFileDownload,
  IconFileUpload,
  IconLayoutGrid,
  IconChevronDown,
  IconAlertCircle,
} from '@tabler/icons-react';
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';

interface ResumeFormProps {
  isEdit: boolean;
}

const SECTION_FORM_MAP: Record<SectionKey, React.FC<any>> = {
  profile: ProfileForm,
  education: EducationForm,
  experience: ExperienceForm,
  projects: ProjectsForm,
  awards: AwardsForm,
  additional: AdditionalForm,
  skills: SkillsForm,
  remarks: RemarkForm,
};

const DEFAULT_SECTION_OPTIONS: { key: SectionKey; label: string }[] = [
  { key: 'education', label: 'Education' },
  { key: 'experience', label: 'Experience' },
  { key: 'projects', label: 'Projects' },
  { key: 'awards', label: 'Awards' },
  { key: 'additional', label: 'Additional experience' },
  { key: 'skills', label: 'Skills' },
  { key: 'remarks', label: 'Remarks' },
];

function makeSectionDefaults(key: SectionKey): Section['data'] {
  const initial = makeInitialSectionedData();
  return initial.sections.find((s) => s.sectionKey === key)?.data ?? { remarks: '' };
}

// ── Toast / error notification ──────────────────────────────────────────────

function ErrorToast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="error-toast">
      <IconAlertCircle size={16} />
      <span>{message}</span>
      <button className="error-toast-close" onClick={onDismiss} aria-label="Dismiss">
        <IconX size={14} />
      </button>
    </div>
  );
}

// ── Draggable section nav item ──────────────────────────────────────────────

interface SectionNavItemProps {
  section: Section;
  isSelected: boolean;
  isEditingTitle: boolean;
  editingTitleValue: string;
  onSelect: () => void;
  onStartEditTitle: () => void;
  onEditTitleChange: (v: string) => void;
  onCommitTitle: () => void;
  onCancelTitle: () => void;
  onToggleVisibility: () => void;
  onRequestDelete: () => void;
}

function SectionNavItem({
  section,
  isSelected,
  isEditingTitle,
  editingTitleValue,
  onSelect,
  onStartEditTitle,
  onEditTitleChange,
  onCommitTitle,
  onCancelTitle,
  onToggleVisibility,
  onRequestDelete,
}: SectionNavItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLSpanElement>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const handle = dragHandleRef.current;
    if (!el || !handle) return;

    const cleanupDraggable = draggable({
      element: el,
      dragHandle: handle,
      getInitialData: () => ({ sectionId: section.id }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });

    const cleanupDropTarget = dropTargetForElements({
      element: el,
      getData: ({ input, element }) =>
        attachClosestEdge({ sectionId: section.id }, {
          input,
          element,
          allowedEdges: ['top', 'bottom'],
        }),
      onDrag: ({ self }) => setClosestEdge(extractClosestEdge(self.data)),
      onDragLeave: () => setClosestEdge(null),
      onDrop: () => setClosestEdge(null),
    });

    return () => { cleanupDraggable(); cleanupDropTarget(); };
  }, [section.id]);

  return (
    <div
      ref={ref}
      className={['section-nav-item', isSelected ? 'selected' : '', isDragging ? 'dragging' : ''].join(' ')}
      onClick={isEditingTitle ? undefined : onSelect}
      onDoubleClick={isEditingTitle ? undefined : onStartEditTitle}
      role="button"
      tabIndex={isEditingTitle ? -1 : 0}
      onKeyDown={(e) => { if (!isEditingTitle && (e.key === 'Enter' || e.key === ' ')) onSelect(); }}
    >
      {closestEdge && (
        <div className={`drop-indicator drop-indicator--${closestEdge}`} />
      )}

      <span
        ref={dragHandleRef}
        className="drag-handle"
        title="Drag to reorder"
        onClick={(e) => e.stopPropagation()}
      >
        <IconGripVertical size={16} />
      </span>

      {isEditingTitle ? (
        <input
          className="section-title-input"
          value={editingTitleValue}
          autoFocus
          onChange={(e) => onEditTitleChange(e.target.value)}
          onBlur={onCommitTitle}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onCommitTitle();
            if (e.key === 'Escape') onCancelTitle();
          }}
        />
      ) : (
        <span className={'section-nav-label' + (isSelected ? ' selected' : '')}>
          {section.name}
        </span>
      )}

      <div className="section-controls" onClick={(e) => e.stopPropagation()}>
        <button
          className="section-ctrl-btn"
          title={section.isVisible ? 'Hide from PDF' : 'Show in PDF'}
          onClick={onToggleVisibility}
        >
          {section.isVisible ? <IconEye size={15} /> : <IconEyeOff size={15} />}
        </button>

        {section.sectionKey !== 'profile' && (
          <button
            className="section-ctrl-btn delete-btn"
            title="Delete section"
            onClick={onRequestDelete}
          >
            <IconTrash size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Custom preset dropdown ──────────────────────────────────────────────────

interface PresetDropdownProps {
  value: SectionKey | '';
  onChange: (v: SectionKey | '') => void;
}

function PresetDropdown({ value, onChange }: PresetDropdownProps) {
  const label = value
    ? DEFAULT_SECTION_OPTIONS.find((o) => o.key === value)?.label + ' layout'
    : 'Blank (no layout)';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="preset-dropdown-trigger">
          <span>{label}</span>
          <IconChevronDown size={14} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="preset-dropdown-content" sideOffset={4}>
          <DropdownMenu.Item className="preset-dropdown-item" onSelect={() => onChange('')}>
            Blank (no layout)
          </DropdownMenu.Item>
          {DEFAULT_SECTION_OPTIONS.map((opt) => (
            <DropdownMenu.Item
              key={opt.key}
              className="preset-dropdown-item"
              onSelect={() => onChange(opt.key)}
            >
              {opt.label} layout
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// ── Add section modal ───────────────────────────────────────────────────────

interface AddSectionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, preset: SectionKey | '') => void;
}

function AddSectionModal({ open, onClose, onAdd }: AddSectionModalProps) {
  const [name, setName] = useState('');
  const [preset, setPreset] = useState<SectionKey | ''>('');

  const handleClose = () => {
    setName('');
    setPreset('');
    onClose();
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), preset);
    setName('');
    setPreset('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="version-dialog-overlay" />
        <Dialog.Content className="add-section-dialog">
          <div className="version-dialog-header">
            <Dialog.Title className="version-dialog-title">
              <IconPlus size={18} />
              Add section
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="version-dialog-close" aria-label="Close">
                <IconX size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="add-section-dialog-body">
            <label className="add-section-field-label">Section name</label>
            <input
              className="section-title-input add-section-dialog-input"
              placeholder="e.g. Certifications"
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
                if (e.key === 'Escape') handleClose();
              }}
            />

            <label className="add-section-field-label">
              Layout preset <span className="add-section-field-hint">(optional)</span>
            </label>
            <PresetDropdown value={preset} onChange={setPreset} />

            <p className="add-section-field-hint" style={{ marginTop: 4 }}>
              Choosing a preset copies the field structure of an existing section type.
            </p>
          </div>

          <div className="confirm-dialog-actions">
            <Dialog.Close asChild>
              <button className="confirm-btn cancel" onClick={handleClose}>Cancel</button>
            </Dialog.Close>
            <button
              className="confirm-btn confirm"
              disabled={!name.trim()}
              onClick={handleAdd}
            >
              <IconCheck size={15} /> Add section
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

const ResumeForm = ({ isEdit }: ResumeFormProps) => {
  const AUTOSAVE_DEBOUNCE_MS = 1200;

  const [sectionedData, setSectionedData] = useState<SectionedFormData>(makeInitialSectionedData);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('s_profile');
  const [isFileVisibleMobile, setIsFileVisibleMobile] = useState(false);
  const [isExample, setIsExample] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<SectionedFormData | null>(null);
  const [autoSaveState, setAutoSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);
  const [pendingDeleteSection, setPendingDeleteSection] = useState<Section | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const pendingPayloadRef = useRef<string | null>(null);
  const lastSavedPayloadRef = useRef<string>('');
  // Guards against autosave firing before the resume data has been loaded
  // into sectionedData — prevents overwriting real content with the empty
  // initial state that exists before the first fetch completes.
  const isLoadedRef = useRef(false);
  const originalResumeRef = useRef<typeof originalResume>(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isGuest = !user;
  const queryClient = useQueryClient();

  if (isEdit && (!id || isNaN(Number(id)))) {
    navigate('/home');
    return null;
  }

  const { data: originalResume, error } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => getResume(Number(id)),
    enabled: isEdit,
    retry: false,
  });

  const isResumeChanged = JSON.stringify(sectionedData) !== JSON.stringify(lastSavedData);

  useEffect(() => {
    if (error) {
      switch (error.message) {
        case FORBIDDEN_MESSAGE: navigate('/'); break;
        default: navigate('/home');
      }
    }
    if (originalResume) {
      originalResumeRef.current = originalResume;
      const parsed = parseResumeData(originalResume.data);
      setSectionedData(parsed);
      setLastSavedData(parsed);
      lastSavedPayloadRef.current = serializeResumeData(parsed);
      isLoadedRef.current = true;
      setAutoSaveState('saved');
      setLastSavedTime(new Date());
    }
  }, [originalResume, error]);

  useEffect(() => {
    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
  }, []);

  // Pragmatic DnD monitor
  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const target = location.current.dropTargets[0];
        if (!target) return;
        const sourceSectionId = source.data.sectionId as string;
        const targetSectionId = target.data.sectionId as string;
        const edge = extractClosestEdge(target.data);
        if (sourceSectionId === targetSectionId) return;

        setSectionedData((prev) => {
          const sorted = [...prev.sections].sort((a, b) => a.position - b.position);
          const fromIdx = sorted.findIndex((s) => s.id === sourceSectionId);
          const toIdx = sorted.findIndex((s) => s.id === targetSectionId);
          if (fromIdx === -1 || toIdx === -1) return prev;

          let insertIdx = edge === 'bottom' ? toIdx + 1 : toIdx;
          if (fromIdx < insertIdx) insertIdx--;

          const reordered = [...sorted];
          const [moved] = reordered.splice(fromIdx, 1);
          reordered.splice(insertIdx, 0, moved);
          return { ...prev, sections: reordered.map((s, i) => ({ ...s, position: i })) };
        });
      },
    });
  }, []);

  const runAutoSave = async (payload: string) => {
    if (!isEdit || !isLoadedRef.current || isGuest) return;
    if (payload === lastSavedPayloadRef.current) { setAutoSaveState('saved'); return; }
    if (isSavingRef.current) { pendingPayloadRef.current = payload; return; }

    const resume = originalResumeRef.current;
    if (!resume) return;

    isSavingRef.current = true;
    setAutoSaveState('saving');

    try {
      await updateResume(Number(id), {
        template_name: resume.template_name,
        title: resume.title,
        data: payload,
        file: 'TEST',
        template_version: 2,
      });

      lastSavedPayloadRef.current = payload;
      setLastSavedData(parseResumeData(payload));
      setLastSavedTime(new Date());

      // Invalidate the version history cache so the list refreshes immediately.
      // The backend now saves the version synchronously before responding.
      queryClient.invalidateQueries({ queryKey: ['resumeVersions', Number(id)] });

      if (pendingPayloadRef.current && pendingPayloadRef.current !== payload) {
        const queued = pendingPayloadRef.current;
        pendingPayloadRef.current = null;
        isSavingRef.current = false;
        await runAutoSave(queued);
        return;
      }
      pendingPayloadRef.current = null;
      setAutoSaveState('saved');
    } catch (err) {
      console.error(err);
      setAutoSaveState('error');
      setErrorMsg('Auto-save failed. Your changes may not be saved. Please check your connection.');
    } finally {
      isSavingRef.current = false;
    }
  };

  useEffect(() => {
    if (!isEdit || !isLoadedRef.current || isGuest) {
      // Not ready to save — cancel any timer that may have been queued
      // before load completed (e.g. from the initial render when sectionedData
      // is still the empty default state but isLoadedRef was set in the same
      // render batch by the load effect).
      if (debounceTimerRef.current) { clearTimeout(debounceTimerRef.current); debounceTimerRef.current = null; }
      return;
    }
    const payload = serializeResumeData(sectionedData);
    if (payload === lastSavedPayloadRef.current) {
      // Nothing changed — cancel any stale timer left over from a previous
      // effect run that used the empty initial sectionedData.
      if (debounceTimerRef.current) { clearTimeout(debounceTimerRef.current); debounceTimerRef.current = null; }
      setAutoSaveState('saved');
      return;
    }
    setAutoSaveState('idle');
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => runAutoSave(payload), AUTOSAVE_DEBOUNCE_MS);
  }, [sectionedData, isEdit, isGuest]);

  const orderedSections = [...sectionedData.sections].sort((a, b) => a.position - b.position);
  const profileData = sectionedData.sections.find((s) => s.sectionKey === 'profile')?.data as Profile | undefined;

  const updateSection = (sId: string, updates: Partial<Section>) =>
    setSectionedData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === sId ? { ...s, ...updates } : s)),
    }));

  const updateSectionData = (sId: string, data: Section['data']) => updateSection(sId, { data });

  const startEditTitle = (section: Section) => {
    setEditingTitleId(section.id);
    setEditingTitleValue(section.name);
  };

  const commitEditTitle = (sId: string) => {
    if (editingTitleValue.trim()) updateSection(sId, { name: editingTitleValue.trim() });
    setEditingTitleId(null);
  };

  const toggleVisibility = (sId: string, current: boolean) => updateSection(sId, { isVisible: !current });

  const deleteSection = (sId: string) => {
    setSectionedData((prev) => {
      const filtered = prev.sections.filter((s) => s.id !== sId);
      return { ...prev, sections: filtered.map((s, i) => ({ ...s, position: i })) };
    });
    if (selectedSectionId === sId) setSelectedSectionId(sectionedData.sections[0]?.id ?? '');
    setPendingDeleteSection(null);
  };

  const handleAddSection = (name: string, preset: SectionKey | '') => {
    const sId = `s_custom_${Date.now()}`;
    const position = sectionedData.sections.length;
    // Blank (no preset) → 'additional' form type but start with no entries
    const sectionKey: SectionKey = preset || 'additional';
    const data = preset ? makeSectionDefaults(preset) : [];
    setSectionedData((prev) => ({
      ...prev,
      sections: [...prev.sections, { id: sId, name, sectionKey, position, isVisible: true, data }],
    }));
    setSelectedSectionId(sId);
    setShowAddSection(false);
  };

  const handleCreateResume = async () => {
    if (!isEdit) {
      try {
        const resp = await createResume({
          template_name: 'Libre',
          title: 'New Resume',
          data: serializeResumeData(sectionedData),
          file: 'TEST',
          template_version: 2,
        });
        navigate(`/resume/${resp.data.createdResumeID}`);
      } catch {
        setErrorMsg('Failed to save resume. Please wait and try again.');
      }
    }
  };

  const handleDownloadClick = () => {
    const blob = new Blob([serializeResumeData(sectionedData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = profileData?.name ? `${profileData.name}_resume` : 'resume';
    link.click();
    URL.revokeObjectURL(url);
  };

  const triggerImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target) {
            const json = parseResumeData(event.target.result as string);
            setSectionedData(json);
            setIsExample(false);
          }
        };
        reader.readAsText(file);
      }
    });
    input.click();
  };

  const handleVersionRestored = () => {
    isLoadedRef.current = false; // Block autosave until fresh data is loaded
    if (debounceTimerRef.current) { clearTimeout(debounceTimerRef.current); debounceTimerRef.current = null; }
    getResume(Number(id)).then((fresh) => {
      originalResumeRef.current = fresh;
      const parsed = parseResumeData(fresh.data);
      setSectionedData(parsed);
      setLastSavedData(parsed);
      lastSavedPayloadRef.current = serializeResumeData(parsed);
      isLoadedRef.current = true;
      setAutoSaveState('saved');
      setLastSavedTime(new Date());
      // Update both caches so stale data never triggers a spurious save
      queryClient.invalidateQueries({ queryKey: ['resume', id] });
      queryClient.invalidateQueries({ queryKey: ['resumeVersions', Number(id)] });
    });
    setShowVersionHistory(false);
  };

  const selectedSection = sectionedData.sections.find((s) => s.id === selectedSectionId);
  const SelectedFormComponent = selectedSection ? SECTION_FORM_MAP[selectedSection.sectionKey] : null;
  const displayedData = isExample ? makeExampleSectionedData() : sectionedData;

  const styles = StyleSheet.create({
    viewer: {
      flex: 'auto',
      border: 0,
      padding: 0,
      background: 'linear-gradient(90deg, var(--background-clr), var(--secondary-clr) 75%)',
    },
  });

  const CVComponent = <CV sections={displayedData.sections} schemaVersion={2} />;

  return (
    <main className="flex max-h-screen">
      {/* Global error toast */}
      {errorMsg && (
        <ErrorToast message={errorMsg} onDismiss={() => setErrorMsg(null)} />
      )}

      <div className="buttons-bar">
        {/* Top controls */}
        <div className="sidebar-top">
          <ConfirmBack isResumeChanged={isEdit ? false : isResumeChanged} isGuest={isGuest} />
          {isEdit ? (
            <div className="sidebar-status">
              <AutosaveIndicator state={autoSaveState} lastSavedTime={lastSavedTime} />
              <button
                className={`version-history-btn${showVersionHistory ? ' active' : ''}`}
                title="Version history"
                onClick={() => setShowVersionHistory((v) => !v)}
              >
                <IconHistory size={16} />
                History
              </button>
            </div>
          ) : (
            <>
              {isGuest ? (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" className="py-2 px-6 w-full" disabled>
                        Create Resume
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start" alignOffset={-40}>
                      <p>Create an account to save your resume!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button size="sm" className="py-2 px-6 w-full" onClick={handleCreateResume}>
                  Create Resume
                </Button>
              )}
            </>
          )}
        </div>

        {/* Section nav */}
        <Buttons className="form-buttons">
          {orderedSections.map((section) => (
            <SectionNavItem
              key={section.id}
              section={section}
              isSelected={selectedSectionId === section.id}
              isEditingTitle={editingTitleId === section.id}
              editingTitleValue={editingTitleValue}
              onSelect={() => setSelectedSectionId(section.id)}
              onStartEditTitle={() => startEditTitle(section)}
              onEditTitleChange={setEditingTitleValue}
              onCommitTitle={() => commitEditTitle(section.id)}
              onCancelTitle={() => setEditingTitleId(null)}
              onToggleVisibility={() => toggleVisibility(section.id, section.isVisible)}
              onRequestDelete={() => setPendingDeleteSection(section)}
            />
          ))}

          <button className="add-section-trigger" onClick={() => setShowAddSection(true)}>
            <IconPlus size={15} /> Add section
          </button>
        </Buttons>

        {/* Bottom controls */}
        <div className="hide-on-mobile sidebar-bottom">
          <button
            className={`example-toggle-btn${isExample ? ' active' : ''}`}
            onClick={() => setIsExample((v) => !v)}
          >
            <IconLayoutGrid size={16} />
            {isExample ? 'Showing example' : 'Show example'}
          </button>
        </div>
      </div>

      {/* Add section modal */}
      <AddSectionModal
        open={showAddSection}
        onClose={() => setShowAddSection(false)}
        onAdd={handleAddSection}
      />

      {/* Delete section confirmation */}
      <AlertDialog.Root
        open={pendingDeleteSection !== null}
        onOpenChange={(o) => !o && setPendingDeleteSection(null)}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="version-dialog-overlay" />
          <AlertDialog.Content className="confirm-dialog">
            <AlertDialog.Title className="confirm-dialog-title">Delete section?</AlertDialog.Title>
            <AlertDialog.Description className="confirm-dialog-desc">
              "{pendingDeleteSection?.name}" will be permanently removed from this resume.
            </AlertDialog.Description>
            <div className="confirm-dialog-actions">
              <AlertDialog.Cancel asChild>
                <button className="confirm-btn cancel">Cancel</button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  className="confirm-btn confirm danger"
                  onClick={() => pendingDeleteSection && deleteSection(pendingDeleteSection.id)}
                >
                  Delete
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      {/* Version history modal */}
      {isEdit && (
        <VersionTimeline
          resumeID={Number(id)}
          open={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          onRestored={handleVersionRestored}
        />
      )}

      {/* Mobile: import button */}
      <button className="importJSON hide-on-desktop" onClick={triggerImportJSON}>
        <IconFileUpload size={17} />
        IMPORT JSON
      </button>

      <div className="form-container">
        {SelectedFormComponent && selectedSection && (
          <SelectedFormComponent
            formValue={selectedSection.data}
            onChange={(newData: Section['data']) => updateSectionData(selectedSection.id, newData)}
          />
        )}
      </div>

      <div className="action-buttons hide-on-desktop">
        <Button onClick={() => setIsFileVisibleMobile(true)}>View PDF</Button>
      </div>

      <div
        style={{ display: 'flex', flexDirection: 'column', ...styles.viewer }}
        className={`file ${isFileVisibleMobile ? 'show' : ''}`}
      >
        <div className="toolbar">
          <div className="downloadButtons">
            <PDFDownloadLink
              document={CVComponent}
              fileName={profileData?.name ? `${profileData.name}_resume` : 'resume'}
              style={{ textDecoration: 'none' }}
            >
              <button className="downloadButton">
                <IconDownload size={26} className="svg" />
                <p>PDF</p>
              </button>
            </PDFDownloadLink>
            <button className="downloadButton" onClick={handleDownloadClick}>
              <IconFileDownload size={26} className="svg" />
              <p>JSON</p>
            </button>
          </div>
          <button className="importJSON hide-on-mobile" onClick={triggerImportJSON}>
            <IconFileUpload size={17} />
            IMPORT JSON
          </button>
        </div>
        <PDFViewer style={styles.viewer} showToolbar={false}>
          {CVComponent}
        </PDFViewer>
        <Button className="hide-on-desktop back-button" onClick={() => setIsFileVisibleMobile(false)}>
          Back
        </Button>
      </div>
    </main>
  );
};

export default ResumeForm;
