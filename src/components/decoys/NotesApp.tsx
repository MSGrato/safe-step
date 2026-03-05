import { useState } from 'react';
import { Plus, ArrowLeft, Trash2, Pencil } from 'lucide-react';

type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  updatedAt: number;
};

const STORAGE_KEY = 'safestep_decoy_notes';
const COLORS = ['bg-yellow-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100', 'bg-pink-100', 'bg-red-100', 'bg-teal-100'];

const DEFAULT_NOTES: Note[] = [
  { id: '1', title: 'Grocery List', content: 'Milk, eggs, bread, butter, cheese, spinach, chicken, rice, olive oil', color: 'bg-yellow-100', updatedAt: Date.now() - 60000 },
  { id: '2', title: 'Meeting Notes', content: 'Discuss Q2 targets and team updates\n- Review marketing budget\n- Assign new project leads\n- Schedule follow-up for next Friday', color: 'bg-blue-100', updatedAt: Date.now() - 120000 },
  { id: '3', title: 'Book Recommendations', content: '1. Atomic Habits\n2. Deep Work\n3. The Alchemist\n4. Thinking, Fast and Slow\n5. Sapiens', color: 'bg-green-100', updatedAt: Date.now() - 180000 },
  { id: '4', title: 'Weekend Plans', content: 'Saturday: farmers market in the morning, yoga at noon\nSunday: brunch with Sarah, afternoon hike', color: 'bg-purple-100', updatedAt: Date.now() - 240000 },
  { id: '5', title: 'Recipe Ideas', content: 'Try making homemade pasta this week\nLook up Thai curry recipe\nBake banana bread with overripe bananas', color: 'bg-orange-100', updatedAt: Date.now() - 300000 },
];

function loadNotes(): Note[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTES));
    return DEFAULT_NOTES;
  }
  return JSON.parse(data);
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

  if (view === 'edit') {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-5 pt-12 pb-3 flex items-center justify-between">
          <button onClick={handleSave} className="text-foreground text-sm font-medium flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Done
          </button>
          <div className="flex gap-3">
            {editId && (
              <button onClick={() => handleDelete(editId)} className="text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className="px-5 space-y-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setEditColor(c)}
                className={`w-7 h-7 rounded-full shrink-0 ${c} ${editColor === c ? 'ring-2 ring-foreground ring-offset-2' : ''}`}
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
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full bg-transparent text-foreground/80 text-base outline-none placeholder:text-muted-foreground/50 resize-none min-h-[60vh]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-1" onPointerDown={onTripleTap}>Notes</h1>
        <p className="text-sm text-muted-foreground">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
      </div>

      {notes.length > 3 && (
        <div className="px-5 pb-3">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      )}

      <div className="px-5 pb-24 space-y-3">
        {sorted.length === 0 && (
          <p className="text-muted-foreground text-sm py-12 text-center">
            {searchQuery ? 'No notes found.' : 'Tap + to create a note.'}
          </p>
        )}
        {sorted.map(note => (
          <button
            key={note.id}
            onClick={() => openEdit(note)}
            className={`w-full ${note.color} rounded-2xl p-4 text-left active:scale-[0.98] transition-transform`}
          >
            <h3 className="font-semibold text-foreground mb-1">{note.title}</h3>
            <p className="text-sm text-foreground/70 line-clamp-2">{note.content}</p>
            <p className="text-xs text-muted-foreground mt-2">{timeAgo(note.updatedAt)}</p>
          </button>
        ))}
      </div>

      <button
        onClick={openNew}
        className="fixed bottom-6 right-6 w-14 h-14 bg-foreground text-background rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
