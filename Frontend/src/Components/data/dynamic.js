import { Activity, HomeIcon, Network, Workflow } from 'lucide-react';

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
    featureName: 'ExecuteWorkflow',
    displayName: 'Execute',
    logoUsed: Activity,
    route: '/execute',
  },
];

export { features };
