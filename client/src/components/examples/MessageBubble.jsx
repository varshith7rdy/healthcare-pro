import MessageBubble from '../MessageBubble';

export default function MessageBubbleExample() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      <MessageBubble 
        message="Hello! How can I help you with your health today?" 
        isUser={false}
        timestamp="2:30 PM"
      />
      <MessageBubble 
        message="I'd like to know more about my recent blood pressure readings." 
        isUser={true}
        timestamp="2:31 PM"
      />
      <MessageBubble 
        message="I can see your recent blood pressure readings. Your average systolic is 122 mmHg and diastolic is 78 mmHg over the past week, which is within the normal range. Would you like me to show you a detailed trend analysis?" 
        isUser={false}
        timestamp="2:31 PM"
      />
    </div>
  );
}
