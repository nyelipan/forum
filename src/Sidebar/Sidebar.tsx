import './Sidebar.css';

import {
	ChevronsLeft,
	ChevronsRight,
	Home,
	MessageSquare,
	Settings,
	User,
} from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';

function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handlePageChange = (page: string) => {
        navigate(page);
    };

    const NavButton = ({
        icon: Icon,
        label,
        path,
    }: {
        icon: React.ElementType;
        label: string;
        path: string;
    }) => (
        <button
            className={cn(
                'nav-button group',
                location.pathname === path &&
                    'bg-accent text-accent-foreground',
            )}
            onClick={() => handlePageChange(path)}
            aria-label={label}
        >
            <Icon
                className={cn(
                    'h-5 w-5 transition-colors',
                    location.pathname === path
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-foreground',
                )}
            />
            {isSidebarOpen && (
                <span className='ml-3 text-sm transition-colors'>{label}</span>
            )}
        </button>
    );

    return (
        <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <div className='sidebar-header'>
                {isSidebarOpen && (
                    <h2 className='text-lg font-semibold dark:text-white'>
                        Menu
                    </h2>
                )}
                <button
                    className='toggle-button'
                    onClick={handleSidebarToggle}
                    aria-label={
                        isSidebarOpen ? 'Close sidebar' : 'Open sidebar'
                    }
                >
                    {isSidebarOpen ? <ChevronsLeft /> : <ChevronsRight />}
                </button>
            </div>

            <div className='sidebar-divider'></div>

            <nav className='sidebar-content'>
                <NavButton icon={Home} label='Home' path='/home' />
                <NavButton icon={User} label='Biodata' path='/biodata' />
                <NavButton icon={Settings} label='Settings' path='/settings' />
                <NavButton icon={MessageSquare} label='Forum' path='/forum' />
            </nav>

            <div className='sidebar-divider'></div>

            <div className='sidebar-footer'>
                <ModeToggle />
            </div>
        </div>
    );
}

export default Sidebar;
