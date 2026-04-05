'use client';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { createPortal } from 'react-dom';
import { Shield } from 'lucide-react';
import arenaLogo from '@/assets/arena-logo.png';

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	const links = [
		{ label: 'Features', href: '#features' },
		{ label: 'Book Now', href: '#booking' },
		{ label: 'My Bookings', href: '/my-bookings' } 
	];

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn(
				'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
				scrolled
					? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm'
					: 'bg-transparent',
			)}
		>
			<div className="container mx-auto flex items-center justify-between px-4 py-3">
				{/* Logo */}
				<Link to="/" className="flex items-center gap-2">
					<img src={arenaLogo} alt="ArenaTurf logo" width={28} height={28} className="h-7 w-7 object-contain" />
					<span className="font-heading md:text-2xl font-bold drop-shadow-lg text-sm bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
						ArenaTurf
					</span>
				</Link>

				{/* Desktop nav */}
				<nav className="hidden md:flex items-center gap-1">
					{links.map((link) => (
						<a
							key={link.label}
							href={link.href}
							className={cn(
								buttonVariants({ variant: 'ghost', size: 'sm' }),
								'text-muted-foreground hover:text-foreground',
							)}
						>
							{link.label}
						</a>
					))}
					<Link
						to="/admin"
						className={cn(
							buttonVariants({ variant: 'ghost', size: 'sm' }),
							'text-muted-foreground hover:text-foreground gap-1.5',
						)}
					>
						<Shield className="h-4 w-4" /> Admin
					</Link>
				</nav>

				{/* Mobile toggle */}
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setOpen(!open)}
					className="md:hidden"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
				>
					<MenuToggleIcon open={open} className="size-5" />
				</Button>
			</div>

			{/* Mobile menu */}
			<MobileMenu open={open}>
				<nav className="flex flex-col items-center gap-4 pt-8" id="mobile-menu">
					{links.map((link) => (
						<a
							key={link.label}
							href={link.href}
							onClick={() => setOpen(false)}
							className={cn(
								buttonVariants({ variant: 'ghost' }),
								'text-lg text-muted-foreground hover:text-foreground',
							)}
						>
							{link.label}
						</a>
					))}
					<Link
						to="/admin"
						onClick={() => setOpen(false)}
						className={cn(
							buttonVariants({ variant: 'ghost' }),
							'text-lg text-muted-foreground hover:text-foreground gap-1.5',
						)}
					>
						<Shield className="h-4 w-4" /> Admin
					</Link>
				</nav>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<'div'> & {
	open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	if (!open || typeof window === 'undefined') return null;

	return createPortal(
		<div
			className={cn(
				'fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-16',
				className,
			)}
			{...props}
		>
			<div className="flex flex-col items-center justify-center h-full">
				{children}
			</div>
		</div>,
		document.body,
	);
}
