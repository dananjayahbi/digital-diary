'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button, Input, TimePicker } from '@/components/ui';
import type { TaskFormData } from '@/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskFormData) => void;
  initialData?: Partial<TaskFormData>;
  isEditing?: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = React.useState<TaskFormData>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    priority: 'medium',
  });

  // Reset form data when modal opens/closes or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || '',
        description: initialData?.description || '',
        startTime: initialData?.startTime || '',
        endTime: initialData?.endTime || '',
        priority: initialData?.priority || 'medium',
      });
    }
  }, [isOpen, initialData]);

  const priorities: Array<{ value: 'low' | 'medium' | 'high'; label: string; color: string }> = [
    { value: 'low', label: 'Low', color: 'var(--task-green)' },
    { value: 'medium', label: 'Medium', color: 'var(--task-blue)' },
    { value: 'high', label: 'High', color: 'var(--task-red)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass rounded-2xl p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="What needs to be done?"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Input
            label="Description (optional)"
            placeholder="Add some details..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <TimePicker
              label="Start Time"
              value={formData.startTime}
              onChange={(time) => setFormData({ ...formData, startTime: time })}
              placeholder="Start time"
            />
            <TimePicker
              label="End Time"
              value={formData.endTime}
              onChange={(time) => setFormData({ ...formData, endTime: time })}
              placeholder="End time"
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <div className="flex gap-2">
              {priorities.map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: value })}
                  className={`
                    flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all
                    ${formData.priority === value
                      ? 'text-white'
                      : 'bg-neutral-100 text-foreground hover:bg-neutral-200'
                    }
                  `}
                  style={formData.priority === value ? { backgroundColor: color } : undefined}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              {isEditing ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
