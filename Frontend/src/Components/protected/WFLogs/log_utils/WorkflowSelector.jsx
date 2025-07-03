import React, { useState } from 'react';
import { ChevronDown, Search, Workflow } from 'lucide-react';

const WorkflowSelector = ({ workflows, selectedWorkflow, onWorkflowSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWorkflowSelect = (workflow) => {
    onWorkflowSelect(workflow);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)]">
      <div className="flex items-center gap-3 mb-4">
        <Workflow className="h-5 w-5 text-[var(--accent-color)]" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          Select Workflow
        </h3>
      </div>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg hover:border-[var(--accent-color)] transition-colors"
        >
          <span className="text-[var(--text-primary)]">
            {selectedWorkflow ? selectedWorkflow.name : 'Choose a workflow...'}
          </span>
          <ChevronDown 
            className={`h-5 w-5 text-[var(--text-secondary)] transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-lg z-10 max-h-96 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-[var(--border-color)]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                />
              </div>
            </div>

            {/* Workflow List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredWorkflows.length === 0 ? (
                <div className="p-4 text-center text-[var(--text-secondary)]">
                  No workflows found
                </div>
              ) : (
                filteredWorkflows.map((workflow) => (
                  <button
                    key={workflow.wf_id}
                    onClick={() => handleWorkflowSelect(workflow)}
                    className="w-full text-left px-4 py-3 hover:bg-[var(--highlight-color)] transition-colors border-b border-[var(--border-color)] last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-[var(--text-primary)]">
                          {workflow.name}
                        </div>
                        {workflow.description && (
                          <div className="text-sm text-[var(--text-secondary)] mt-1">
                            {workflow.description}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className={`w-2 h-2 rounded-full ${
                          workflow.is_active ? 'bg-green-500' : 'bg-gray-400'
                        }`}></span>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {workflow.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Workflow Info */}
      {selectedWorkflow && (
        <div className="mt-4 p-4 bg-[var(--bg-secondary)] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-[var(--text-primary)]">
              {selectedWorkflow.name}
            </h4>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                selectedWorkflow.is_active ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
              <span className="text-xs text-[var(--text-secondary)]">
                {selectedWorkflow.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          {selectedWorkflow.description && (
            <p className="text-sm text-[var(--text-secondary)]">
              {selectedWorkflow.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-secondary)]">
            <span>ID: {selectedWorkflow.wf_id}</span>
            <span>Created: {new Date(selectedWorkflow.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowSelector;