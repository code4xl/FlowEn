import { Activity, AlarmClock, HomeIcon, Network, Workflow } from 'lucide-react';

const features = [
  {
    featureName: 'Home',
    displayName: 'Home',
    logoUsed: HomeIcon,
    route: '/dashboard',
    allowedRoles: ["user", "admin"],
  },
  {
    featureName: 'CreateWorkflow',
    displayName: 'Create',
    logoUsed: Workflow,
    route: '/create',
    allowedRoles: ["user", "admin"],
  },
  {
    featureName: 'ViewWorkflow',
    displayName: 'View',
    logoUsed: Network,
    route: '/view',
    allowedRoles: ["user", "admin"],
  },
  {
    featureName: 'TriggerWorkflow',
    displayName: 'Triggers',
    logoUsed: AlarmClock,
    route: '/trigger',
    allowedRoles: ["user", "admin"],
  },
  {
    featureName: 'WorkflowLogs',
    displayName: 'Logs',
    logoUsed: Activity,
    route: '/logs',
    allowedRoles: ["user", "admin"],
  },
  {
    featureName: 'AdminPanel',
    displayName: 'Admin',
    logoUsed: Activity,
    route: '/admin-panel',
    allowedRoles: ["admin"],
  },
];

export { features };
