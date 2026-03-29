import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExpert } from '@/contexts/ExpertContext';
import { ExpertCategory, EXPERT_CATEGORIES, EXPERT_REGIONS } from '@/models/expertIdea';
import { AlertCircle, ChevronDown, ChevronLeft, Info, Lightbulb } from 'lucide-react';

interface FormState {
  title: string;
  problemStatement: string;
  proposedSolution: string;
  shortDescription: string;
  detailedDescription: string;
  category: ExpertCategory | '';
  targetRegion: string;
  budgetMin: string;
  budgetMax: string;
  imageUrl: string;
}

const EMPTY: FormState = {
  title: '', problemStatement: '', proposedSolution: '', shortDescription: '',
  detailedDescription: '', category: '', targetRegion: '', budgetMin: '', budgetMax: '', imageUrl: '',
};

export function ExpertCreateIdeaPage() {
  const { ideas, createIdea, updateIdea } = useExpert();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (editId) {
      const idea = ideas.find((i) => i.id === editId);
      if (idea) {
        setForm({
          title: idea.title, problemStatement: idea.problemStatement,
          proposedSolution: idea.proposedSolution, shortDescription: idea.shortDescription,
          detailedDescription: idea.detailedDescription ?? '', category: idea.category,
          targetRegion: idea.targetRegion, budgetMin: idea.budgetMin > 0 ? String(idea.budgetMin) : '',
          budgetMax: idea.budgetMax > 0 ? String(idea.budgetMax) : '', imageUrl: idea.images[0] ?? '',
        });
      }
    }
  }, [editId, ideas]);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<FormState> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.problemStatement.trim()) errs.problemStatement = 'Problem statement is required';
    if (!form.proposedSolution.trim()) errs.proposedSolution = 'Proposed solution is required';
    if (!form.category) errs.category = 'Category is required' as any;
    if (form.budgetMin && isNaN(Number(form.budgetMin))) errs.budgetMin = 'Must be a number';
    if (form.budgetMax && isNaN(Number(form.budgetMax))) errs.budgetMax = 'Must be a number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    const payload = {
      title: form.title.trim(), problemStatement: form.problemStatement.trim(),
      proposedSolution: form.proposedSolution.trim(),
      shortDescription: form.shortDescription.trim() || form.title.trim(),
      detailedDescription: form.detailedDescription.trim(),
      category: form.category as ExpertCategory, targetRegion: form.targetRegion || 'National',
      budgetMin: Number(form.budgetMin) || 0, budgetMax: Number(form.budgetMax) || 0,
      images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
    };
    if (editId) {
      const existing = ideas.find((i) => i.id === editId);
      if (existing) updateIdea({ ...existing, ...payload });
    } else {
      createIdea({ ...payload, status: 'draft', interests: [] });
    }
    navigate('/expert/ideas');
  };

  const isEdit = Boolean(editId);

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        {/* Header */}
        <div style={S.header}>
          <button onClick={() => navigate(-1)} style={S.backBtn}><ChevronLeft size={18} /></button>
          <div>
            <h1 style={S.title}>{isEdit ? 'Edit Idea' : 'Create New Idea'}</h1>
            <p style={S.sub}>{isEdit ? 'Update the details of your idea' : 'Share your agricultural expertise with farmers and investors'}</p>
          </div>
        </div>

        {/* Info banner */}
        <div style={S.banner}>
          <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '0.8125rem' }}>
            <strong>Tip:</strong> The more detailed your idea, the more likely investors and farmers will engage.
            Fill in all optional fields for maximum visibility.
          </p>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} noValidate style={S.card}>
          <div style={S.cardH}>
            <div style={S.cardHIcon}><Lightbulb size={18} color="#fff" /></div>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Idea Details</span>
          </div>

          <div style={S.grid}>
            {/* Title */}
            <div style={S.fgFull}>
              <label style={S.label}>Idea Title <span style={S.req}>*</span></label>
              <input type="text" value={form.title} onChange={set('title')}
                placeholder="e.g. Smart drip irrigation for wheat"
                style={{ ...S.input, ...(errors.title ? S.inputErr : {}) }} />
              {errors.title && <span style={S.errMsg}><AlertCircle size={13} />{errors.title}</span>}
            </div>

            {/* Category */}
            <div style={S.fg}>
              <label style={S.label}>Category <span style={S.req}>*</span></label>
              <div style={S.selWrap}>
                <ChevronDown size={14} style={S.selIcon as any} />
                <select value={form.category} onChange={set('category')}
                  style={{ ...S.select, ...(errors.category ? S.inputErr : {}) }}>
                  <option value="">Select category</option>
                  {EXPERT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {errors.category && <span style={S.errMsg}><AlertCircle size={13} />{errors.category}</span>}
            </div>

            {/* Region */}
            <div style={S.fg}>
              <label style={S.label}>Target Region</label>
              <div style={S.selWrap}>
                <ChevronDown size={14} style={S.selIcon as any} />
                <select value={form.targetRegion} onChange={set('targetRegion')} style={S.select}>
                  <option value="">National (all regions)</option>
                  {EXPERT_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Short Description */}
            <div style={S.fgFull}>
              <label style={S.label}>Short Description</label>
              <input type="text" value={form.shortDescription} onChange={set('shortDescription')}
                placeholder="One-line summary shown in the feed" style={S.input} maxLength={120} />
              <span style={S.hint}>{form.shortDescription.length}/120</span>
            </div>

            {/* Problem Statement */}
            <div style={S.fgFull}>
              <label style={S.label}>Problem Statement <span style={S.req}>*</span></label>
              <textarea value={form.problemStatement} onChange={set('problemStatement')}
                placeholder="Describe the agricultural problem this idea addresses..."
                rows={4} style={{ ...S.textarea, ...(errors.problemStatement ? S.inputErr : {}) }} />
              {errors.problemStatement && <span style={S.errMsg}><AlertCircle size={13} />{errors.problemStatement}</span>}
            </div>

            {/* Proposed Solution */}
            <div style={S.fgFull}>
              <label style={S.label}>Proposed Solution <span style={S.req}>*</span></label>
              <textarea value={form.proposedSolution} onChange={set('proposedSolution')}
                placeholder="How does your idea solve the problem?..."
                rows={4} style={{ ...S.textarea, ...(errors.proposedSolution ? S.inputErr : {}) }} />
              {errors.proposedSolution && <span style={S.errMsg}><AlertCircle size={13} />{errors.proposedSolution}</span>}
            </div>

            {/* Detailed Description */}
            <div style={S.fgFull}>
              <label style={S.label}>Detailed Description</label>
              <textarea value={form.detailedDescription} onChange={set('detailedDescription')}
                placeholder="Additional details, methodology, expected outcomes..."
                rows={5} style={S.textarea} />
            </div>

            {/* Budget range */}
            <div style={S.fg}>
              <label style={S.label}>Budget Min (DZD)</label>
              <input type="number" min={0} value={form.budgetMin} onChange={set('budgetMin')}
                placeholder="e.g. 500000" style={{ ...S.input, ...(errors.budgetMin ? S.inputErr : {}) }} />
              {errors.budgetMin && <span style={S.errMsg}><AlertCircle size={13} />{errors.budgetMin}</span>}
            </div>
            <div style={S.fg}>
              <label style={S.label}>Budget Max (DZD)</label>
              <input type="number" min={0} value={form.budgetMax} onChange={set('budgetMax')}
                placeholder="e.g. 2000000" style={{ ...S.input, ...(errors.budgetMax ? S.inputErr : {}) }} />
              {errors.budgetMax && <span style={S.errMsg}><AlertCircle size={13} />{errors.budgetMax}</span>}
            </div>

            {/* Image URL */}
            <div style={S.fgFull}>
              <label style={S.label}>Cover Image URL</label>
              <input type="url" value={form.imageUrl} onChange={set('imageUrl')}
                placeholder="https://example.com/image.jpg" style={S.input} />
              {form.imageUrl && (
                <img src={form.imageUrl} alt="Preview" style={S.imgPreview}
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')} />
              )}
            </div>
          </div>

          {/* Submit row */}
          <div style={S.submitRow}>
            <button type="button" onClick={() => navigate(-1)} style={S.cancelBtn}>Cancel</button>
            <button type="submit" disabled={submitted} style={S.submitBtn}>
              {isEdit ? 'Save Changes' : 'Create Idea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: 'calc(100vh - 60px)', backgroundColor: '#f8fafc', padding: '2rem 1.5rem' },
  wrap: { maxWidth: '760px', margin: '0 auto' },

  header: { display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' },
  backBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#ffffff',
    cursor: 'pointer', flexShrink: 0, marginTop: '4px',
  },
  title: { margin: '0 0 0.25rem', fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
  sub: { margin: 0, fontSize: '0.875rem', color: '#64748b' },

  banner: {
    display: 'flex', gap: '0.75rem', padding: '0.875rem 1.125rem',
    backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px',
    color: '#92400e', marginBottom: '1.25rem',
  },

  card: {
    backgroundColor: '#ffffff', borderRadius: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
    border: '1px solid #e2e8f0', padding: '1.5rem',
  },
  cardH: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' },
  cardHIcon: {
    width: '32px', height: '32px', borderRadius: '8px',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  fgFull: { gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.375rem' },
  fg: { display: 'flex', flexDirection: 'column', gap: '0.375rem' },

  label: { fontSize: '0.875rem', fontWeight: 600, color: '#334155' },
  req: { color: '#ef4444' },

  input: {
    padding: '0.625rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '0.9375rem', fontFamily: 'inherit', outline: 'none',
    color: '#0f172a', backgroundColor: '#f8fafc',
  },
  inputErr: { borderColor: '#ef4444' },

  textarea: {
    padding: '0.625rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '0.9375rem', fontFamily: 'inherit', outline: 'none',
    color: '#0f172a', backgroundColor: '#f8fafc', resize: 'vertical' as const, lineHeight: 1.55,
  },

  selWrap: { position: 'relative' } as React.CSSProperties,
  selIcon: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' },
  select: {
    width: '100%', padding: '0.625rem 2.25rem 0.625rem 0.875rem',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9375rem',
    fontFamily: 'inherit', backgroundColor: '#f8fafc', color: '#0f172a',
    cursor: 'pointer', outline: 'none', appearance: 'none' as any,
  },

  hint: { fontSize: '0.75rem', color: '#94a3b8', textAlign: 'right' },
  errMsg: { display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: '#ef4444' },

  imgPreview: { marginTop: '0.5rem', maxHeight: '180px', borderRadius: '10px', objectFit: 'cover', border: '1.5px solid #e2e8f0' },

  submitRow: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' },
  cancelBtn: {
    padding: '0.75rem 1.5rem', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    backgroundColor: '#ffffff', color: '#475569', fontSize: '0.9375rem',
    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  submitBtn: {
    padding: '0.75rem 1.75rem', border: 'none', borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#ffffff',
    fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
  },
};
