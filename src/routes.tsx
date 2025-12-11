import { Icon } from './lib/chakra';
import { FaRocketchat } from 'react-icons/fa';
import { MdAutoAwesome } from 'react-icons/md';

// Auth Imports
import { IRoute } from './types/navigation';

const routes: IRoute[] = [
  {
    name: 'SHIVA',
    path: '/',
    icon: (
      <Icon as={MdAutoAwesome} width="20px" height="20px" color="inherit" />
    ),
    collapse: false,
  },
  { 
    name: 'Chat History',
    path: '/chatlog',
    icon: <Icon as={FaRocketchat} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
  {
    name: 'Chat Session',
    path: '/chat/[sessionId]', // Use dynamic segment for sessionId
    icon: <Icon as={FaRocketchat} width="20px" height="20px" color="inherit" />,
    collapse: false,
  },
];

export default routes;