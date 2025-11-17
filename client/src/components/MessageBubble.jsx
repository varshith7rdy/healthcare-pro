import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

export default function MessageBubble({ message, isUser, timestamp }) {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`} data-testid={`message-${isUser ? 'user' : 'ai'}`}>
      {!isUser && (
        <Avatar className="h-10 w-10" data-testid="avatar-ai">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} ${isUser ? 'max-w-md' : 'max-w-lg'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'rounded-br-md bg-primary text-primary-foreground'
              : 'rounded-bl-md bg-card border border-card-border'
          }`}
          data-testid="message-content"
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        {timestamp && (
          <span className="mt-1 text-xs text-muted-foreground" data-testid="message-timestamp">
            {timestamp}
          </span>
        )}
      </div>

      {isUser && (
        <Avatar className="h-10 w-10" data-testid="avatar-user">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
