import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Code, MessageSquare, CheckCircle } from 'lucide-react';

const QuestionCard = ({ question, onSubmitAnswer }) => {
  const [answer, setAnswer] = useState(question.userAnswer || '');
  const [selectedOption, setSelectedOption] = useState('');

  const handleSubmit = () => {
    const finalAnswer =
      question.type === 'multiple-choice' ? selectedOption : answer;
    if (finalAnswer.trim()) onSubmitAnswer(question._id, finalAnswer);
  };

  const getDifficultyColor = (diff) =>
    ({
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-amber-100 text-amber-800',
      hard: 'bg-red-100 text-red-800',
    }[diff] || 'bg-muted text-muted-foreground');

  const getTypeIcon = (type) =>
    ({
      coding: <Code className="h-4 w-4" />,
      'multiple-choice': <CheckCircle className="h-4 w-4" />,
      default: <MessageSquare className="h-4 w-4" />,
    }[type] || <MessageSquare className="h-4 w-4" />);

  const formatDifficulty = (diff) => {
    if (!diff || typeof diff !== 'string') return 'Unknown';
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-secondary rounded-lg">
            {getTypeIcon(question.type)}
          </div>
          <Badge className={getDifficultyColor(question.difficulty)}>
            {formatDifficulty(question.difficulty)}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Question Text */}
      <div className="prose prose-sm max-w-none text-lg font-medium">
        {question.text || question.question || 'Untitled Question'}
      </div>

      {/* Answer */}
      {question.type === 'multiple-choice' && question.options ? (
        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <div
              key={i}
              className={`p-3 border rounded-lg cursor-pointer ${
                selectedOption === opt
                  ? 'border-primary bg-gradient-secondary'
                  : 'hover:border-primary'
              }`}
              onClick={() => setSelectedOption(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={
              question.type === 'coding'
                ? 'Write your code here...'
                : 'Answer here...'
            }
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={
            question.type === 'multiple-choice'
              ? !selectedOption
              : !answer.trim()
          }
        >
          Submit Answer
        </Button>
      </div>
    </div>
  );
};

export default QuestionCard;
