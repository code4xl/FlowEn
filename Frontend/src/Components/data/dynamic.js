import { Activity, AlarmClock, HomeIcon, Network, Workflow } from 'lucide-react';

const features = [
  {
    featureName: 'Home',
    displayName: 'Home',
    logoUsed: HomeIcon,
    route: '/dashboard',
  },
  {
    featureName: 'CreateWorkflow',
    displayName: 'Create',
    logoUsed: Workflow,
    route: '/create',
  },
  {
    featureName: 'ViewWorkflow',
    displayName: 'View',
    logoUsed: Network,
    route: '/view',
  },
  {
    featureName: 'TriggerWorkflow',
    displayName: 'Triggers',
    logoUsed: AlarmClock,
    route: '/trigger',
  },
  {
    featureName: 'WorkflowLogs',
    displayName: 'Logs',
    logoUsed: Activity,
    route: '/logs',
  },  
];

export { features };
