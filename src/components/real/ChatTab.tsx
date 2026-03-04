import { useState, useRef, useEffect } from 'react';
import { storage, type ChatMessage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Flag, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

export function ChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>(storage.getChatHistory());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    storage.setChatHistory(updated);
    setInput('');
    setLoading(true);

    try {
      const chatMessages = updated.map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: chatMessages }),
        }
      );

      if (response.status === 429) {
        toast.error('Too many requests. Please try again in a moment.');
        setLoading(false);
        return;
      }
      if (response.status === 402) {
        toast.error('AI usage limit reached. Please try again later.');
        setLoading(false);
        return;
      }
      if (!response.ok || !response.body) throw new Error('Failed to get response');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let assistantContent = '';
      const assistantId = crypto.randomUUID();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && last.id === assistantId) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { id: assistantId, role: 'assistant', content: assistantContent, timestamp: Date.now() }];
              });
            }
          } catch {}
        }
      }

      // Save final state
      setMessages(prev => {
        storage.setChatHistory(prev);
        return prev;
      });
    } catch (e) {
      console.error('Chat error:', e);
      toast.error('Unable to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const flagMessage = (msgId: string) => {
    storage.flagMessage(msgId);
    toast.success('Response flagged. Thank you.');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Banner */}
      <div className="px-4 py-2 bg-muted flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">This chat is powered by AI. For immediate danger, call 911.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Ask anything about safety planning. Your conversation stays on this device.</p>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-[15px]">{msg.content}</p>
              )}
              {msg.role === 'assistant' && (
                <button
                  onClick={() => flagMessage(msg.id)}
                  className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Flag className="w-3 h-3" />
                  Report
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-background">
        <form
          onSubmit={e => { e.preventDefault(); sendMessage(); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
