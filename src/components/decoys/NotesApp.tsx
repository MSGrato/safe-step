import { useState } from 'react';
import { Plus, ArrowLeft, Trash2 } from 'lucide-react';

type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  updatedAt: number;
};

const STORAGE_KEY = 'safestep_decoy_notes';

// Accent bar colors — left-side only so the other three borders stay border-border
const COLORS = [
  'border-l-yellow-400',
  'border-l-blue-400',
  'border-l-green-500',
  'border-l-purple-400',
  'border-l-orange-400',
  'border-l-pink-400',
  'border-l-red-400',
  'border-l-teal-500',
];

// Dot swatches shown in the color picker
const SWATCHES = [
  'bg-yellow-400',
  'bg-blue-400',
  'bg-green-500',
  'bg-purple-400',
  'bg-orange-400',
  'bg-pink-400',
  'bg-red-400',
  'bg-teal-500',
];

const DEFAULT_NOTES: Note[] = [
  { id: '1', title: 'Grocery List', content: 'Milk, eggs, bread, butter, cheese, spinach, chicken, rice, olive oil', color: 'border-l-yellow-400', updatedAt: Date.now() - 60000 },
  { id: '2', title: 'Meeting Notes', content: 'Discuss Q2 targets and team updates\n- Review marketing budget\n- Assign new project leads\n- Schedule follow-up for next Friday', color: 'border-l-blue-400', updatedAt: Date.now() - 120000 },
  { id: '3', title: 'Book Recommendations', content: '1. Atomic Habits\n2. Deep Work\n3. The Alchemist\n4. Thinking, Fast and Slow\n5. Sapiens', color: 'border-l-green-500', updatedAt: Date.now() - 180000 },
  { id: '4', title: 'Weekend Plans', content: 'Saturday: farmers market in the morning, yoga at noon\nSunday: brunch with Sarah, afternoon hike', color: 'border-l-purple-400', updatedAt: Date.now() - 240000 },
  { id: '5', title: 'Recipe Ideas', content: 'Try making homemade pasta this week\nLook up Thai curry recipe\nBake banana bread with overripe bananas', color: 'border-l-orange-400', updatedAt: Date.now() - 300000 },
];

function loadNotes(): Note[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTES));
    return DEFAULT_NOTES;
  }
  // Migrate old bg-* or border-* (non-directional) color values to border-l-* format
  const notes: Note[] = JSON.parse(data);
  const migrated = notes.map((n, i) => ({
    ...n,
    color: n.color.startsWith('border-l-') ? n.color : COLORS[i % COLORS.length],
  }));
  return migrated;
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function NotesApp({ onTripleTap }: { onTripleTap?: () => void }) {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editColor, setEditColor] = useState(COLORS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const persist = (updated: Note[]) => { setNotes(updated); saveNotes(updated); };

  const sorted = notes
    .filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const openNew = () => {
    setEditId(null);
    setEditTitle('');
    setEditContent('');
    setEditColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setView('edit');
  };

  const openEdit = (note: Note) => {
    setEditId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditColor(note.color);
    setView('edit');
  };

  const handleSave = () => {
    if (!editTitle.trim() && !editContent.trim()) { setView('list'); return; }
    const note: Note = {
      id: editId || crypto.randomUUID(),
      title: editTitle.trim() || 'Untitled',
      content: editContent,
      color: editColor,
      updatedAt: Date.now(),
    };
    const updated = editId ? notes.map(n => n.id === editId ? note : n) : [...notes, note];
    persist(updated);
    setView('list');
  };

  const handleDelete = (id: string) => {
    persist(notes.filter(n => n.id !== id));
    setView('list');
  };

  // --- Edit view ---
  if (view === 'edit') {
    const swatchIndex = COLORS.indexOf(editColor);
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border px-5 pt-12 pb-4 flex items-center justify-between shadow-sm">
          <button onClick={handleSave} className="flex items-center gap-1 text-primary text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Done
          </button>
          <span className="text-base font-semibold text-foreground">{editId ? 'Edit Note' : 'New Note'}</span>
          {editId ? (
            <button onClick={() => handleDelete(editId)} className="text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Color picker */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SWATCHES.map((swatch, i) => (
              <button
                key={swatch}
                onClick={() => setEditColor(COLORS[i])}
                className={`w-7 h-7 rounded-full shrink-0 ${swatch} ${swatchIndex === i ? 'ring-2 ring-offset-2 ring-foreground' : ''}`}
              />
            ))}
          </div>

          <input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50"
            autoFocus
          />
          <div className="h-px bg-border" />
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full bg-transparent text-foreground text-base outline-none placeholder:text-muted-foreground/50 resize-none min-h-[60vh] leading-relaxed"
          />
        </div>
      </div>
    );
  }

  // --- List view ---
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-5 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div onPointerDown={onTripleTap}>
            <h1 className="text-2xl font-bold text-foreground">Notes</h1>
            <p className="text-sm text-muted-foreground">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {notes.length > 3 && (
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        )}
      </div>

      <div className="px-5 py-4 pb-24 space-y-2">
        {sorted.length === 0 && (
          <p className="text-muted-foreground text-sm py-12 text-center">
            {searchQuery ? 'No notes found.' : 'Tap + to create a note.'}
          </p>
        )}
        {sorted.map(note => (
          <button
            key={note.id}
            onClick={() => openEdit(note)}
            className={`w-full bg-card rounded-2xl border-l-4 ${note.color} shadow-sm border border-border pl-4 pr-4 py-4 text-left active:scale-[0.98] transition-transform`}
          >
            <h3 className="font-semibold text-foreground mb-0.5 truncate">{note.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{note.content}</p>
            <p className="text-xs text-muted-foreground/70 mt-2">{timeAgo(note.updatedAt)}</p>
          </button>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={openNew}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
