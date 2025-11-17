import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Loader2 } from 'lucide-react';
import MessageBubble from '@/components/MessageBubble';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import aiImage from '@assets/generated_images/AI_health_assistant_visualization_24b473a7.png';

export default function VirtualCompanion() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your virtual health companion. I can help you understand your health data, answer questions about your wellness, and provide personalized insights. How can I assist you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "How's my heart rate trending?",
    "What can I do to improve my sleep?",
    "Show my activity summary",
    "Any health insights for me?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: (message) => apiRequest('POST', '/api/chat/query', { message }),
    onSuccess: (data) => {
      const aiMessage = {
        id: messages.length + 1,
        text: data.response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: () => {
      const errorMessage = {
        id: messages.length + 1,
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    chatMutation.mutate(input);
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
      <div className="mb-6">
        <h1 className="font-serif text-4xl font-bold">Virtual Health Companion</h1>
        <p className="mt-2 text-muted-foreground">AI-powered insights for your health journey</p>
      </div>

      <div className="rounded-lg overflow-hidden mb-4">
        <img
          src={aiImage}
          alt="AI Health Assistant"
          className="h-32 w-full object-cover"
        />
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6" data-testid="chat-messages">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          {chatMutation.isPending && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="cursor-pointer hover-elevate"
                  onClick={() => handleSuggestedQuestion(question)}
                  data-testid={`suggestion-${idx}`}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="border-t bg-card p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your health..."
              className="min-h-[60px] resize-none"
              data-testid="input-chat"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending}
              size="icon"
              className="h-[60px] w-[60px]"
              data-testid="button-send"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
