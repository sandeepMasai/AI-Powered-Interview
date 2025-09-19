import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Clock, Zap, Target, BookOpen } from 'lucide-react'

const InterviewSetup = ({ onStartInterview }) => {
  const [topic, setTopic] = useState('javascript')
  const [duration, setDuration] = useState(30)
  const [difficulty, setDifficulty] = useState('medium')
  const [isBlitzMode, setIsBlitzMode] = useState(false)

  const handleStart = () => {
    if (!onStartInterview) return
    onStartInterview({ topic, duration, difficulty, isBlitzMode })
  }

  return (
    <div className="space-y-6">
      {/* Topic Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <Label className="text-base font-medium">Interview Topic</Label>
        </div>
        <Select value={topic} onValueChange={setTopic}>
          <SelectTrigger className="bg-gradient-secondary border-0">
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript Fundamentals</SelectItem>
            <SelectItem value="react">React & Frontend</SelectItem>
            <SelectItem value="algorithms">Data Structures & Algorithms</SelectItem>
            <SelectItem value="system-design">System Design</SelectItem>
            <SelectItem value="backend">Backend Development</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Duration Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <Label className="text-base font-medium">Interview Duration</Label>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[15, 30, 45].map((mins) => (
            <Card 
              key={mins}
              className={`cursor-pointer transition-smooth border-2 ${
                duration === mins 
                  ? 'border-primary bg-gradient-secondary shadow-elegant' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setDuration(mins)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{mins}</div>
                <div className="text-sm text-muted-foreground">minutes</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <Label className="text-base font-medium">Difficulty Level</Label>
        </div>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="bg-gradient-secondary border-0">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy - Entry Level</SelectItem>
            <SelectItem value="medium">Medium - Intermediate</SelectItem>
            <SelectItem value="hard">Hard - Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Blitz Mode */}
      <div className="flex items-center justify-between p-4 bg-gradient-secondary rounded-lg">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-accent" />
          <div>
            <Label className="text-base font-medium">Blitz Mode</Label>
            <p className="text-sm text-muted-foreground">
              Quick 30-second questions for rapid practice
            </p>
          </div>
        </div>
        <Switch
          checked={isBlitzMode}
          onCheckedChange={setIsBlitzMode}
        />
      </div>

      {/* Start Button */}
      <Button 
        onClick={handleStart}
        variant="interview"
        size="lg"
        className="w-full"
      >
        Start Interview Session
      </Button>
    </div>
  )
}

export default InterviewSetup
