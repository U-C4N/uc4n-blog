import React from 'react';
import { Activity, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Post, Project } from '../../types';

interface AuditEvent {
  id: string;
  type: 'create' | 'update' | 'delete' | 'view';
  entityType: 'post' | 'project';
  entityId: string;
  entityTitle: string;
  timestamp: string;
  user: string;
}

interface AuditLogProps {
  events: AuditEvent[];
}

export function AuditLog({ events }: AuditLogProps) {
  const getIcon = (type: AuditEvent['type']) => {
    switch (type) {
      case 'create': return Plus;
      case 'update': return Edit;
      case 'delete': return Trash2;
      case 'view': return Eye;
      default: return Activity;
    }
  };

  const getActionColor = (type: AuditEvent['type']) => {
    switch (type) {
      case 'create': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'update': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      case 'delete': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      case 'view': return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Activity size={24} className="mr-2" />
          Activity Log
        </h2>
        <div className="space-y-4">
          {events.map((event) => {
            const Icon = getIcon(event.type);
            const actionColor = getActionColor(event.type);
            
            return (
              <div key={event.id} className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${actionColor}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.user} {event.type}d {event.entityType}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {event.entityTitle}
                  </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}